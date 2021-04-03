FROM node:15.13.0-alpine3.13 as base

WORKDIR /wefox/api

COPY package.json ./

RUN npm i

COPY . .

FROM base as production

ENV NODE_PATH=./build

RUN npm run build