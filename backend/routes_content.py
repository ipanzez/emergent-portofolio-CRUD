import re
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from auth import require_admin
from models import Experience, Profile, Project, Skill, Tool
from repository import experiences_repo, profile_repo, projects_repo, skills_repo, tools_repo

ORDER = [("order", 1), ("_id", 1)]


def slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-") or "project"


public_router = APIRouter(prefix="/public", tags=["public"])


@public_router.get("/portfolio")
async def get_portfolio():
    return {
        "profile": await profile_repo.get(),
        "skills": await skills_repo.list(sort=ORDER),
        "tools": await tools_repo.list(sort=ORDER),
        "experiences": await experiences_repo.list(sort=ORDER),
        "projects": await projects_repo.list(sort=ORDER),
    }


@public_router.get("/projects/{slug}", response_model=Project)
async def get_project(slug: str):
    project = await projects_repo.find_one({"slug": slug})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


admin_router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(require_admin)])


@admin_router.get("/dashboard")
async def dashboard():
    profile = await profile_repo.get()
    return {
        "projects": await projects_repo.count(),
        "featured": await projects_repo.count({"featured": True}),
        "skills": await skills_repo.count(),
        "tools": await tools_repo.count(),
        "experiences": await experiences_repo.count(),
        "has_cv": bool(profile.cv_url),
        "has_photo": bool(profile.photo_url),
        "profile_name": profile.name,
    }


@admin_router.get("/profile", response_model=Profile)
async def get_profile():
    return await profile_repo.get()


@admin_router.put("/profile", response_model=Profile)
async def save_profile(body: Profile):
    return await profile_repo.save(body)


class ReorderBody(BaseModel):
    ids: List[str]


async def _prepare_project(item: Project, current_id: str = None) -> Project:
    item.slug = slugify(item.slug or item.title)
    clash = await projects_repo.find_one({"slug": item.slug})
    if clash and clash.id != current_id:
        item.slug = f"{item.slug}-{str(clash.id)[-4:]}"
    return item


def register_crud(name: str, repo, model, prepare=None):
    @admin_router.get(f"/{name}", response_model=List[model])
    async def list_items():
        return await repo.list(sort=ORDER)

    @admin_router.post(f"/{name}", response_model=model, status_code=201)
    async def create_item(item: model):
        if prepare:
            item = await prepare(item)
        if item.order == 0:
            item.order = await repo.count()
        return await repo.create(item)

    @admin_router.put(f"/{name}/reorder")
    async def reorder_items(body: ReorderBody):
        await repo.reorder(body.ids)
        return {"ok": True}

    @admin_router.get(f"/{name}/{{id}}", response_model=model)
    async def get_item(id: str):
        item = await repo.get(id)
        if not item:
            raise HTTPException(status_code=404, detail="Not found")
        return item

    @admin_router.put(f"/{name}/{{id}}", response_model=model)
    async def update_item(id: str, item: model):
        if prepare:
            item = await prepare(item, id)
        updated = await repo.update(id, item)
        if not updated:
            raise HTTPException(status_code=404, detail="Not found")
        return updated

    @admin_router.delete(f"/{name}/{{id}}")
    async def delete_item(id: str):
        if not await repo.delete(id):
            raise HTTPException(status_code=404, detail="Not found")
        return {"ok": True}


register_crud("skills", skills_repo, Skill)
register_crud("tools", tools_repo, Tool)
register_crud("experiences", experiences_repo, Experience)
register_crud("projects", projects_repo, Project, _prepare_project)
