FROM python:3.11

ENV LANG C.UTF-8
ENV TZ Asia/Tokyo

EXPOSE 50512

COPY ./backend/app/requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY ./backend/app /app

WORKDIR /app

ENTRYPOINT [ "uvicorn", "main:app", "--reload" ]
