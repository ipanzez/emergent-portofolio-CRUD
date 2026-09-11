from typing import Annotated, List, Literal, Optional
from bson import ObjectId
from pydantic import BaseModel, BeforeValidator, ConfigDict, Field

PyObjectId = Annotated[str, BeforeValidator(lambda v: str(v) if isinstance(v, ObjectId) else v)]


class BaseDocument(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="ignore")
    id: Optional[PyObjectId] = Field(default=None, validation_alias="_id")

    def to_mongo(self) -> dict:
        return self.model_dump(exclude={"id"})

    @classmethod
    def from_mongo(cls, doc: Optional[dict]):
        return cls.model_validate(doc) if doc is not None else None


class AdminUser(BaseDocument):
    username: str
    password_hash: str


class SocialLink(BaseModel):
    label: str
    url: str


class SeoMeta(BaseModel):
    title: str = ""
    description: str = ""
    og_image: str = ""


class Profile(BaseDocument):
    name: str = ""
    role: str = ""
    hero_greeting: str = "Hello And Welcome To My"
    hero_title: str = "PORTO FOLIO."
    hero_subtitle: str = ""
    experience_start: int = 2021
    experience_end: str = "Present"
    bio: str = ""
    photo_url: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    social_links: List[SocialLink] = []
    cv_url: str = ""
    seo: SeoMeta = SeoMeta()


class Skill(BaseDocument):
    name: str
    type: Literal["hard", "soft"] = "hard"
    order: int = 0


class Tool(BaseDocument):
    name: str
    icon: str = ""
    order: int = 0


class Experience(BaseDocument):
    position: str
    company: str
    start: str
    end: str = "Present"
    description: str = ""
    order: int = 0


class TypographyItem(BaseModel):
    name: str
    usage: str = ""


class ProcessStep(BaseModel):
    title: str
    description: str = ""


class Kpi(BaseModel):
    value: str
    label: str


class Project(BaseDocument):
    title: str
    slug: str = ""
    category: str = ""
    year: str = ""
    cover_url: str = ""
    overview: str = ""
    problem: str = ""
    goal: str = ""
    process: List[ProcessStep] = []
    kpis: List[Kpi] = []
    role: str = ""
    tools: List[str] = []
    color_palette: List[str] = []
    typography: List[TypographyItem] = []
    gallery: List[str] = []
    link: str = ""
    outcome: str = ""
    featured: bool = False
    order: int = 0
