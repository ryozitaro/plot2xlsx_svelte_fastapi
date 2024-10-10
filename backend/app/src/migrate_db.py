import asyncio
from pathlib import Path

import pandas as pd

from const_path import WORK_DIR
from db import Base, Session, engine
from model_wavedata import WaveData
from types_json_data import JsonData, Voltages

DATA_DIR_PATH = WORK_DIR / "data"


def read_csv(path: Path):
    return pd.read_csv(
        path, usecols=(3, 4), index_col=0, names=["time", str(path.stem)]
    )


async def add_data_table():
    async with Session() as session:
        csv_dirs = [
            csv_dir
            for csv_dir in DATA_DIR_PATH.glob("ALL[0-9][0-9][0-9][0-9]")
            if csv_dir.is_dir()
        ]
        for dir in csv_dirs:
            num = dir.name.removeprefix("ALL")
            ch1_path = dir / f"F{num}CH1.CSV"
            ch2_path = dir / f"F{num}CH2.CSV"
            img_path = dir / f"F{num}TEK.BMP"
            for path in (ch1_path, ch2_path, img_path):
                if not path.exists():
                    raise FileNotFoundError(f"{path} is not exists.")
            df = [read_csv(path) for path in (ch1_path, ch2_path)]
            df = df[0].join(df[1])
            json_data = JsonData(
                time=df.index.to_list(),
                voltages=[
                    Voltages(name=col, voltage=df[col].tolist()) for col in df.columns
                ],
            )
            json_dump = json_data.model_dump()
            session.add(
                WaveData(num=num, json_data=json_dump, img_path=str(img_path.resolve()))
            )
        await session.commit()


async def reset_database():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)


async def migrate_db():
    if not DATA_DIR_PATH.exists():
        raise FileNotFoundError("data directory not found.")
    await reset_database()
    await add_data_table()


if __name__ == "__main__":
    asyncio.run(migrate_db())
