FROM node:22-bookworm-slim

ENV LANG C.UTF-8
ENV TZ Asia/Tokyo

EXPOSE 5173

WORKDIR /app

COPY ./app/package*.json .

RUN npm install

ENTRYPOINT [ "npm", "run", "dev" ]
