import uvicorn
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from router import router

app = FastAPI()
app.include_router(router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST"],
)


if __name__ == "__main__":
    uvicorn.run("main:app", port=50512, reload=True)
