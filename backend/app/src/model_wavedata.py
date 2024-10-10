from sqlalchemy import TEXT, JSON
from sqlalchemy.orm import Mapped, mapped_column

from db import Base


class WaveData(Base):
    __tablename__ = "WaveData"

    num: Mapped[str] = mapped_column(TEXT, primary_key=True)
    json_data: Mapped[JSON] = mapped_column(JSON, nullable=False)
    img_path: Mapped[str] = mapped_column(TEXT, nullable=False, unique=True)
