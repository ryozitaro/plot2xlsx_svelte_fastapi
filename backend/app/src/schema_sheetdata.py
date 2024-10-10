from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

from types_json_data import JsonData


class PS[T](BaseModel):
    p: T
    s: T


class DetailsData(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel)

    spe_height: str
    init_t: PS[str]
    in_t: PS[str]
    out_t: PS[str]
    delta_t: PS[str]
    v: PS[str]
    poi: str


class SheetData(BaseModel):
    num: PS[str]
    details: DetailsData
    a1: str


class DBData(BaseModel):
    json_data: PS[JsonData]
    img_path: PS[str]


class SheetDBData(BaseModel):
    sheet_data: SheetData
    db_data: DBData
