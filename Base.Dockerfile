FROM node:20-alpine3.18

WORKDIR /app

COPY package.json yarn.lock ./
COPY .yarn/ ./.yarn

RUN yarn set version berry
RUN yarn install
