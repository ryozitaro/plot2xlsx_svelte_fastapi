import asyncio

import uvicorn
from brotli_asgi import BrotliMiddleware
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from migrate_db import migrate_db
from router import router
from const_path import DB_PATH

app = FastAPI()
app.include_router(router)

app.add_middleware(BrotliMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST"],
)


if __name__ == "__main__":
    if not DB_PATH.exists():
        asyncio.run(migrate_db())
    uvicorn.run("main:app", host="0.0.0.0", reload=True)
