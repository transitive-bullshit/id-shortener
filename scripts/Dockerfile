FROM node:8.0.0-alpine

RUN apk add --no-cache bash

ENV NODE_ENV=production
ENV NODE_PATH=/opt/node_modules

WORKDIR /opt/module

COPY ["package.json", "yarn.lock", "./"]

RUN \
  NODE_ENV=production yarn --no-emoji --modules-folder $NODE_PATH --pure-lockfile && \
  NODE_ENV=development yarn --no-emoji  --modules-folder $NODE_PATH --pure-lockfile && \
  yarn cache clean

COPY . ./
