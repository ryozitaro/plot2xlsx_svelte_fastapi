from pathlib import Path
from typing import Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class PS(BaseModel, Generic[T]):
    p: T
    s: T


class SelectedData(BaseModel):
    spe_height: float
    init_t: PS[float]
    in_t: PS[float]
    out_t: PS[float]
    delta_t: PS[float]
    v: PS[float]
    poi: float | str


class PageData(BaseModel):
    num: PS[str]
    selected: SelectedData
    a1: str


class DBData(BaseModel):
    json_data: PS[bytes]
    img_path: PS[Path]


class SheetData(BaseModel):
    page_data: PageData
    db_data: DBData
