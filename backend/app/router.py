from io import BytesIO

from fastapi import APIRouter
from fastapi import Depends
from fastapi.responses import Response
from plotly.io import read_json
from sqlalchemy.ext.asyncio import AsyncSession

from db import get_db
from read_db import get_db_data, get_data
from schema_pagedata import PageData, SheetData
from workdir import WORKDIR
from xlsx.xlsxout import XlsxOut

router = APIRouter()

fig = read_json(WORKDIR / "plotly_figure.json", engine="orjson")


@router.get("/ps_data", response_class=Response)
async def send_wave_data(wave_select: str, db: AsyncSession = Depends(get_db)):
    data = await get_data(db, wave_select)
    return Response(
        data, headers={"Content-Encoding": "br"}, media_type="application/json"
    )


@router.post("/convert_xlsx", response_class=Response)
async def convert_xlsx(
    page_data_array: list[PageData], db: AsyncSession = Depends(get_db)
):
    with BytesIO() as f:
        with XlsxOut(f, fig) as xo:
            data_list = await get_db_data(db, page_data_array)
            for page, db_data in zip(page_data_array, data_list):
                sheet = SheetData(page_data=page, db_data=db_data)
                xo.sheet_write(sheet)
        result = f.getvalue()
    return Response(
        result,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    )
