from pydantic import BaseModel


class JsonData(BaseModel):
    time: list[float]
    voltages: list[dict[str, list[float]]]
