import asyncio

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.gzip import GZipMiddleware

from const_path import DB_PATH
from migrate_db import migrate_db
from router import router

app = FastAPI()
app.include_router(router)

app.add_middleware(GZipMiddleware)

if __name__ == "__main__":
    if not DB_PATH.exists():
        asyncio.run(migrate_db())
    uvicorn.run("main:app", host="0.0.0.0", reload=True)
