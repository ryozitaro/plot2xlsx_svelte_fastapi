import orjson
from sqlalchemy import case, select
from sqlalchemy.ext.asyncio import AsyncSession

from model_wavedata import WaveData
from schema_sheetdata import PS, DBData, SheetData


async def get_all_json_data(db: AsyncSession):
    result = await db.execute(
        select(WaveData.num, WaveData.json_data).order_by(WaveData.num)
    )
    data = result.all()
    return {row.num: orjson.loads(row.json_data) for row in data}


async def get_sheet_db_data(db: AsyncSession, sheet_data: SheetData):
    num = sheet_data.num
    result = await db.execute(
        select(WaveData.json_data, WaveData.img_path)
        .where(WaveData.num.in_((num.p, num.s)))
        .order_by(case({num.p: 1, num.s: 2}, value=WaveData.num))
    )
    p, s = result.all()
    return DBData(
        json_data=PS[str](p=p.json_data, s=s.json_data),
        img_path=PS[str](p=p.img_path, s=s.img_path),
    )
