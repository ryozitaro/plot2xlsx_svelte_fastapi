from pydantic import BaseModel


class PS(BaseModel):
    p: float | int
    s: float | int


class Selected(BaseModel):
    spe_height: float | int
    init_t: PS
    in_t: PS
    out_t: PS
    delta_t: PS
    v: PS
    poi: float | str


class PageData(BaseModel):
    p_num: str
    s_num: str
    selected: Selected
    a1: str
