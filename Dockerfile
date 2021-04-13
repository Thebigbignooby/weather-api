FROM node:15.13.0-alpine3.13 as base

WORKDIR /api

COPY package.json ./

RUN npm i

COPY . .

FROM base as test
ENV NODE_ENV=test
# RUN npm i
# RUN npm ci
COPY . .
CMD npm run test

FROM base as production
ENV NODE_PATH=./build
RUN npm run build