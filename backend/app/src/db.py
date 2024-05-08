from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.ext.declarative import DeclarativeMeta, declarative_base

from const_path import DB_PATH

DB = f"sqlite+aiosqlite:///{DB_PATH}"

# 接続
engine = create_async_engine(url=DB, echo=True)

# セッション生成
Session = async_sessionmaker(engine, autoflush=False)

# テーブルとクラスを紐づけるための基底クラス
Base: DeclarativeMeta = declarative_base()


async def get_db():
    async with Session() as s:
        yield s
