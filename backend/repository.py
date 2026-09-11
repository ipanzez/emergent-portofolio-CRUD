from typing import Generic, List, Optional, Type, TypeVar
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException
from database import db
from models import AdminUser, BaseDocument, Experience, Profile, Project, Skill, Tool

T = TypeVar("T", bound=BaseDocument)


def _oid(id: str) -> ObjectId:
    try:
        return ObjectId(id)
    except (InvalidId, TypeError):
        raise HTTPException(status_code=404, detail="Not found")


class MongoRepository(Generic[T]):
    def __init__(self, collection: str, model: Type[T]):
        self.col = db[collection]
        self.model = model

    async def list(self, filter: dict = None, sort: list = None) -> List[T]:
        cursor = self.col.find(filter or {})
        if sort:
            cursor = cursor.sort(sort)
        return [self.model.from_mongo(d) for d in await cursor.to_list(1000)]

    async def get(self, id: str) -> Optional[T]:
        return self.model.from_mongo(await self.col.find_one({"_id": _oid(id)}))

    async def find_one(self, filter: dict) -> Optional[T]:
        return self.model.from_mongo(await self.col.find_one(filter))

    async def create(self, item: T) -> T:
        res = await self.col.insert_one(item.to_mongo())
        return await self.get(str(res.inserted_id))

    async def update(self, id: str, item: T) -> Optional[T]:
        await self.col.update_one({"_id": _oid(id)}, {"$set": item.to_mongo()})
        return await self.get(id)

    async def patch(self, id: str, data: dict) -> Optional[T]:
        await self.col.update_one({"_id": _oid(id)}, {"$set": data})
        return await self.get(id)

    async def delete(self, id: str) -> bool:
        res = await self.col.delete_one({"_id": _oid(id)})
        return res.deleted_count == 1

    async def count(self, filter: dict = None) -> int:
        return await self.col.count_documents(filter or {})

    async def reorder(self, ids: List[str]) -> None:
        for index, id in enumerate(ids):
            await self.col.update_one({"_id": _oid(id)}, {"$set": {"order": index}})


class SingletonRepository(Generic[T]):
    def __init__(self, collection: str, model: Type[T]):
        self.col = db[collection]
        self.model = model

    async def get(self) -> T:
        doc = await self.col.find_one({})
        return self.model.from_mongo(doc) if doc else self.model()

    async def save(self, item: T) -> T:
        existing = await self.col.find_one({})
        if existing:
            await self.col.update_one({"_id": existing["_id"]}, {"$set": item.to_mongo()})
        else:
            await self.col.insert_one(item.to_mongo())
        return await self.get()

    async def patch(self, data: dict) -> T:
        existing = await self.col.find_one({})
        if existing:
            await self.col.update_one({"_id": existing["_id"]}, {"$set": data})
        else:
            await self.col.insert_one({**self.model().to_mongo(), **data})
        return await self.get()


admin_users = MongoRepository("admin_users", AdminUser)
profile_repo = SingletonRepository("profile", Profile)
skills_repo = MongoRepository("skills", Skill)
tools_repo = MongoRepository("tools", Tool)
experiences_repo = MongoRepository("experiences", Experience)
projects_repo = MongoRepository("projects", Project)
