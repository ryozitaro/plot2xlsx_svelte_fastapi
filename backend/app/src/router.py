from io import BytesIO

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse, Response
from plotly.io import read_json
from sqlalchemy.ext.asyncio import AsyncSession

from const_path import WORK_DIR
from db import get_db
from read_db import get_nums, get_select_num_data, get_sheet_db_data
from schema_sheetdata import SheetData, SheetDBData
from types_json_data import JsonData
from xlsx.xlsxout import XlsxOut

router = APIRouter()

fig = read_json(WORK_DIR / "plotly_figure.json")


@router.get("/wave_nums", response_class=JSONResponse, response_model=list[str])
async def send_wave_nums(db: AsyncSession = Depends(get_db)):
    data = await get_nums(db)
    return data


@router.get("/wave_data", response_class=JSONResponse, response_model=JsonData)
async def send_wave_data(num: str, db: AsyncSession = Depends(get_db)):
    data = await get_select_num_data(db, num)
    headers = {"Cache-Control": "max-age=600"}
    return JSONResponse(data.json_data, headers=headers)


@router.post("/convert_xlsx", response_class=Response)
async def convert_xlsx(
    sheet_data_array: list[SheetData], db: AsyncSession = Depends(get_db)
):
    with BytesIO() as f:
        with XlsxOut(f, fig) as xo:
            for sheet_data in sheet_data_array:
                db_data = await get_sheet_db_data(db, sheet_data)
                sheet = SheetDBData(sheet_data=sheet_data, db_data=db_data)
                xo.sheet_write(sheet)
        result = f.getvalue()
    return Response(
        result,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    )
