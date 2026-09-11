import os
from abc import ABC, abstractmethod
from pathlib import Path
from uuid import uuid4


class StorageService(ABC):
    @abstractmethod
    async def save(self, data: bytes, filename: str, content_type: str) -> str:
        """Persist bytes and return a public URL path."""

    @abstractmethod
    async def delete(self, url: str) -> None:
        """Remove a previously stored file by its public URL path."""


class LocalStorageService(StorageService):
    def __init__(self, upload_dir: Path, public_prefix: str = "/api/uploads"):
        self.upload_dir = upload_dir
        self.public_prefix = public_prefix
        self.upload_dir.mkdir(parents=True, exist_ok=True)

    async def save(self, data: bytes, filename: str, content_type: str) -> str:
        ext = Path(filename).suffix.lower() or ""
        name = f"{uuid4().hex}{ext}"
        (self.upload_dir / name).write_bytes(data)
        return f"{self.public_prefix}/{name}"

    async def delete(self, url: str) -> None:
        if url.startswith(self.public_prefix):
            (self.upload_dir / Path(url).name).unlink(missing_ok=True)


_storage: StorageService = None


def get_storage() -> StorageService:
    global _storage
    if _storage is None:
        _storage = LocalStorageService(Path(os.environ["UPLOAD_DIR"]))
    return _storage
