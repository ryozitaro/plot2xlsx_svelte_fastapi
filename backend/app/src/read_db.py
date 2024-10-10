from sqlalchemy import case, select
from sqlalchemy.ext.asyncio import AsyncSession

from model_wavedata import WaveData
from schema_sheetdata import PS, DBData, SheetData
from types_json_data import JsonData


async def get_nums(db: AsyncSession):
    result = await db.scalars(select(WaveData.num))
    return result.all()


async def get_select_num_data(db: AsyncSession, num: str):
    result = await db.execute(
        select(WaveData.num, WaveData.json_data).where(WaveData.num == num)
    )
    data = result.one()
    return data


async def get_sheet_db_data(db: AsyncSession, sheet_data: SheetData):
    num = sheet_data.num
    result = await db.execute(
        select(WaveData.json_data, WaveData.img_path)
        .where(WaveData.num.in_((num.p, num.s)))
        .order_by(case({num.p: 1, num.s: 2}, value=WaveData.num))
    )
    p, s = result.all()
    return DBData(
        json_data=PS[JsonData](p=p.json_data, s=s.json_data),
        img_path=PS[str](p=p.img_path, s=s.img_path),
    )
