from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.ext.declarative import DeclarativeMeta, declarative_base

from workdir import WORKDIR

DB_PATH = f"sqlite+aiosqlite:///{WORKDIR}/data.sqlite3"

# 接続
engine = create_async_engine(url=DB_PATH, echo=True)

# セッション生成
Session = async_sessionmaker(engine, autoflush=False)

# テーブルとクラスを紐づけるための基底クラス
Base: DeclarativeMeta = declarative_base()


async def get_db():
    async with Session() as s:
        yield s
