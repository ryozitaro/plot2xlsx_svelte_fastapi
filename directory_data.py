import io
from dataclasses import dataclass

import pandas as pd


@dataclass(frozen=True)
class DirectoryData:
    df: pd.DataFrame
    bmp: io.BytesIO
