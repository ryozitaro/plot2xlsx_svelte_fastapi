from pathlib import Path
from typing import Sequence

from sqlalchemy import case, select
from sqlalchemy.ext.asyncio import AsyncSession

from model_wavedata import WaveData
from schema_pagedata import PS, DBData, PageData


async def get_nums(db: AsyncSession) -> Sequence[str]:
    result = await db.stream_scalars(select(WaveData.num))
    return await result.all()


async def get_data(db: AsyncSession, num: str) -> bytes:
    result = await db.stream_scalars(
        select(WaveData.json_data).where(WaveData.num == num)
    )
    return await result.one()


async def get_db_data(db: AsyncSession, arr: list[PageData]) -> list[DBData]:
    num_arr = [i.num for i in arr]
    ps_arr = [ps for num in num_arr for ps in (num.p, num.s)]
    order_dict = dict(zip(ps_arr, range(len(ps_arr))))
    result = await db.stream(
        select(WaveData.json_data, WaveData.img_path)
        .where(WaveData.num.in_(ps_arr))
        .order_by(case(order_dict, value=WaveData.num))
    )
    result_seq = await result.all()
    ps_rows = [result_seq[i : i + 2] for i in range(0, len(result_seq), 2)]
    data_list = []
    for ps_row in ps_rows:
        data, img_path = [col for col in zip(*ps_row)]
        data = PS(p=data[0], s=data[1])
        img_path = PS[Path](p=img_path[0], s=img_path[1])
        data_list.append(DBData(json_data=data, img_path=img_path))
    return data_list
