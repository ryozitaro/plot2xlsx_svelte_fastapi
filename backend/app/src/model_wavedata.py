from sqlalchemy import TEXT
from sqlalchemy.orm import Mapped, mapped_column

from db import Base


class WaveData(Base):
    __tablename__ = "WaveData"

    num: Mapped[str] = mapped_column(TEXT, primary_key=True)
    json_data: Mapped[str] = mapped_column(TEXT, nullable=False)
    img_path: Mapped[str] = mapped_column(TEXT, nullable=False, unique=True)
