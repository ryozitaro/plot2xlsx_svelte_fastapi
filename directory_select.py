import io
import pandas as pd
from pathlib import Path

from directory_data import DirectoryData

DATA_PATH = Path("data")


def read_csv(path: Path) -> pd.DataFrame:
    return pd.read_csv(
        path, usecols=(3, 4), index_col=0, names=["time", str(path.stem)]
    )


def read_bmp(path: Path) -> io.BytesIO:
    bmp = path.read_bytes()
    return io.BytesIO(bmp)


def csv_select(num: str) -> pd.DataFrame:
    csv1 = DATA_PATH / f"ALL{num}/F{num}CH1.CSV"
    csv2 = csv1.with_stem(f"F{num}CH2")

    data = [read_csv(path) for path in (csv1, csv2)]
    df = data[0].join(data[1])
    return df


def dir_select(num: str) -> DirectoryData:
    bmp_path = DATA_PATH / f"ALL{num}/F{num}TEK.BMP"
    bmp = read_bmp(bmp_path)
    df = csv_select(num)
    return DirectoryData(df=df, bmp=bmp)
