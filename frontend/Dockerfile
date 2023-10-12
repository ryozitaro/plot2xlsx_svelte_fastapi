FROM node:18.17-slim

ENV LANG C.UTF-8
ENV TZ Asia/Tokyo

EXPOSE 50128

WORKDIR /app

COPY ./frontend/app/csv2xlsx/package.json /app

RUN npm install
