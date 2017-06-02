#!/bin/bash

set -e

export REVISION=$(git rev-parse HEAD)
export MODULE_NAME="${MODULE_NAME:=$(jq -r '.name' package.json)}"
export CONTAINER_NAME="$MODULE_NAME"
export IMAGE_NAME="sesh/$MODULE_NAME"
export VOLUME="$(pwd)/.dummy:/opt/.dummy"

mkdir -p .dummy
touch .env

set +e
