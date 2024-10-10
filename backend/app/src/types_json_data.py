from pydantic import BaseModel


class Voltages(BaseModel):
    name: str
    voltage: list[float]


class JsonData(BaseModel):
    time: list[float]
    voltages: list[Voltages]
