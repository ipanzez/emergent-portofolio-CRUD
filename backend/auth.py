import os
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from pydantic import BaseModel

from database import db
from models import AdminUser
from repository import admin_users

ALGORITHM = "HS256"
ACCESS_MINUTES = 60
REFRESH_DAYS = 7
MAX_ATTEMPTS = 5
LOCK_MINUTES = 15


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def _secret() -> str:
    return os.environ["JWT_SECRET"]


def _token(user_id: str, token_type: str, delta: timedelta) -> str:
    payload = {"sub": user_id, "type": token_type, "exp": datetime.now(timezone.utc) + delta}
    return jwt.encode(payload, _secret(), algorithm=ALGORITHM)


def _decode(token: str, token_type: str) -> dict:
    try:
        payload = jwt.decode(token, _secret(), algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    if payload.get("type") != token_type:
        raise HTTPException(status_code=401, detail="Invalid token type")
    return payload


def _set_cookies(response: Response, user_id: str) -> None:
    response.set_cookie("access_token", _token(user_id, "access", timedelta(minutes=ACCESS_MINUTES)),
                        httponly=True, secure=True, samesite="lax", max_age=ACCESS_MINUTES * 60, path="/")
    response.set_cookie("refresh_token", _token(user_id, "refresh", timedelta(days=REFRESH_DAYS)),
                        httponly=True, secure=True, samesite="lax", max_age=REFRESH_DAYS * 86400, path="/")


async def require_admin(request: Request) -> AdminUser:
    token = request.cookies.get("access_token")
    if not token:
        header = request.headers.get("Authorization", "")
        if header.startswith("Bearer "):
            token = header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    payload = _decode(token, "access")
    user = await admin_users.get(payload["sub"])
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


def _public(user: AdminUser) -> dict:
    return {"id": user.id, "username": user.username}


class LoginBody(BaseModel):
    username: str
    password: str


class ChangePasswordBody(BaseModel):
    current_password: str
    new_password: str


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login")
async def login(body: LoginBody, request: Request, response: Response):
    ip = request.headers.get("x-forwarded-for", "").split(",")[0].strip() or (request.client.host if request.client else "unknown")
    identifier = f"{ip}:{body.username.lower()}"
    now = datetime.now(timezone.utc)
    attempt = await db.login_attempts.find_one({"identifier": identifier})
    if attempt and attempt.get("locked_until") and attempt["locked_until"] > now.replace(tzinfo=None):
        raise HTTPException(status_code=429, detail="Too many attempts. Try again in 15 minutes.")

    user = await admin_users.find_one({"username": body.username})
    if not user or not verify_password(body.password, user.password_hash):
        count = (attempt or {}).get("count", 0) + 1
        update = {"identifier": identifier, "count": count}
        if count >= MAX_ATTEMPTS:
            update["locked_until"] = (now + timedelta(minutes=LOCK_MINUTES)).replace(tzinfo=None)
            update["count"] = 0
        await db.login_attempts.update_one({"identifier": identifier}, {"$set": update}, upsert=True)
        raise HTTPException(status_code=401, detail="Invalid username or password")

    await db.login_attempts.delete_one({"identifier": identifier})
    _set_cookies(response, user.id)
    return _public(user)


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"ok": True}


@router.get("/me")
async def me(user: AdminUser = Depends(require_admin)):
    return _public(user)


@router.post("/refresh")
async def refresh(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    payload = _decode(token, "refresh")
    user = await admin_users.get(payload["sub"])
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    _set_cookies(response, user.id)
    return _public(user)


@router.put("/password")
async def change_password(body: ChangePasswordBody, user: AdminUser = Depends(require_admin)):
    if not verify_password(body.current_password, user.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    if len(body.new_password) < 8:
        raise HTTPException(status_code=400, detail="New password must be at least 8 characters")
    await admin_users.patch(user.id, {"password_hash": hash_password(body.new_password)})
    return {"ok": True}


async def seed_admin() -> None:
    username = os.environ["ADMIN_USERNAME"]
    password = os.environ["ADMIN_PASSWORD"]
    existing = await admin_users.find_one({"username": username})
    if existing is None:
        await admin_users.create(AdminUser(username=username, password_hash=hash_password(password)))
    elif not verify_password(password, existing.password_hash):
        await admin_users.patch(existing.id, {"password_hash": hash_password(password)})
    await db.admin_users.create_index("username", unique=True)
    await db.login_attempts.create_index("identifier")
