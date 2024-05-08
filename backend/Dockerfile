FROM python:3.12-slim-bookworm

ENV LANG C.UTF-8
ENV TZ Asia/Tokyo

EXPOSE 8000

ENV PATH /root/.local/bin:$PATH

WORKDIR /app

COPY ./app/poetry.lock ./
COPY ./app/pyproject.toml ./

RUN apt-get update \
    && apt-get install -y curl \
    && curl -sSL https://install.python-poetry.org | python3 - \
    && poetry config virtualenvs.create false \
    && poetry install

WORKDIR /app/src

ENTRYPOINT [ "python", "main.py" ]
