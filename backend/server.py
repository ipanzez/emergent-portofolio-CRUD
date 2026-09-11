from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import logging  # noqa: E402
import os  # noqa: E402

from fastapi import FastAPI  # noqa: E402
from fastapi.staticfiles import StaticFiles  # noqa: E402
from starlette.middleware.cors import CORSMiddleware  # noqa: E402

from auth import router as auth_router, seed_admin  # noqa: E402
from database import client  # noqa: E402
from routes_content import admin_router, public_router  # noqa: E402
from routes_upload import router as upload_router  # noqa: E402
from seed import seed_content  # noqa: E402
from storage import get_storage  # noqa: E402

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(title="Portfolio CMS API")

app.include_router(auth_router, prefix="/api")
app.include_router(public_router, prefix="/api")
app.include_router(admin_router, prefix="/api")
app.include_router(upload_router, prefix="/api")
app.mount("/api/uploads", StaticFiles(directory=str(get_storage().upload_dir)), name="uploads")


@app.get("/api/")
async def root():
    return {"message": "Portfolio CMS API"}


app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    await seed_admin()
    await seed_content()
    logger.info("Admin and content seeded")


@app.on_event("shutdown")
async def on_shutdown():
    client.close()
