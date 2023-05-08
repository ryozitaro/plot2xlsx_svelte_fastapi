from pathlib import Path

import uvicorn
from starlette.middleware.cors import CORSMiddleware

from directory_select import csv_select
from fastapi import FastAPI, Form, Request
from fastapi.responses import ORJSONResponse, Response, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from models import PageData
from xlsxout import XlsxOut

data_path = Path("data")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:8080"],
    allow_methods=["POST"],
)

csv_dirs_nums = tuple(
    csv_dir.name.removeprefix("ALL")
    for csv_dir in Path("data").glob("ALL????")
    if csv_dir.is_dir()
)


templates = Jinja2Templates("templates")

app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/", response_class=HTMLResponse)
def main_page(request: Request) -> HTMLResponse:
    return templates.TemplateResponse(
        "index.html", {"request": request, "csv_dirs_nums": csv_dirs_nums}
    )


@app.post("/ps_data", response_class=ORJSONResponse)
def kakunin(p_wave_select: str = Form(), s_wave_select: str = Form()) -> ORJSONResponse:
    p_data = csv_select(p_wave_select)
    s_data = csv_select(s_wave_select)
    ps_data = p_data.join(s_data)
    json_data = {"time": ps_data.index.tolist(), "columns": ps_data.to_dict("list")}
    return ORJSONResponse(json_data)


@app.post("/convert_xlsx")
def convert_xlsx(page_data_array: list[PageData]) -> Response:
    with XlsxOut() as xo:
        for sheet in page_data_array:
            xo.main_write(sheet)
    return Response(
        xo.get_xlsx(),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    )


if __name__ == "__main__":
    uvicorn.run("main:app", port=8080, reload=True)
