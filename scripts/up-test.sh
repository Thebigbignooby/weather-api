#!/usr/bin/env bash

docker-compose down

docker-compose -f docker-compose.yml -f docker-compose.test.yml up -d

npm run test:dev