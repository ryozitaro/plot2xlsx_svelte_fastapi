from pathlib import Path

from brotli import compress
import orjson
import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

from db import Base
from model_wavedata import WaveData
from workdir import WORKDIR

DB_PATH = f"sqlite:///{WORKDIR}/data.sqlite3"


# 接続
engine = create_engine(DB_PATH, echo=True)
Session = scoped_session(sessionmaker(engine))

DATA_PATH = WORKDIR / "data"


def add_data_table():
    csv_dirs = (csv_dir for csv_dir in DATA_PATH.glob("ALL????") if csv_dir.is_dir())
    for dir in csv_dirs:
        num = dir.name.removeprefix("ALL")
        ch1_path = dir / f"F{num}CH1.CSV"
        ch2_path = dir / f"F{num}CH2.CSV"
        img_path = dir / f"F{num}TEK.BMP"
        if not img_path.exists():
            raise FileNotFoundError(f"{img_path} is not exists.")
        df = [read_csv(path) for path in (ch1_path, ch2_path)]
        df = df[0].join(df[1])
        json_data = {
            "time": df.index.tolist(),
            "voltages": [{col: df[col].tolist()} for col in df.columns],
        }
        json_dump = orjson.dumps(json_data)
        comp = compress(json_dump)
        Session.add(WaveData(num=num, json_data=comp, img_path=str(img_path.resolve())))
    Session.commit()


def read_csv(path: Path):
    return pd.read_csv(
        path, usecols=(3, 4), index_col=0, names=["time", str(path.stem)]
    )


def reset_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    if not DATA_PATH.exists():
        raise FileNotFoundError("data directory not found.")
    reset_database()
    add_data_table()
