#!/bin/bash

set -e

source ./scripts/env.sh

export NODE_ENV=test
export HOSTNAME=none
export REDIS_PORT="6379"

bin="/opt/node_modules/.bin"
runner="$bin/ava -v"
command="$runner $@"
compose="docker-compose -f ./scripts/docker-compose.yml"

$compose up --remove-orphans --build -d
$compose run --service-ports module bash -c "$command"

# https://discuss.circleci.com/t/docker-error-removing-intermediate-container/70/2
docker rm -f $CONTAINER_NAME || true
