from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class PS[T](BaseModel):
    p: T
    s: T


class DetailsData(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel)

    spe_height: float
    init_t: PS[float]
    in_t: PS[float]
    out_t: PS[float]
    delta_t: PS[float]
    v: PS[float]
    poi: float | str


class SheetData(BaseModel):
    num: PS[str]
    details: DetailsData
    a1: str


class DBData(BaseModel):
    json_data: PS[str]
    img_path: PS[str]


class SheetDBData(BaseModel):
    sheet_data: SheetData
    db_data: DBData
