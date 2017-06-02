#!/usr/bin/env bash

set -e

./scripts/wait-for-it.sh redis:6379 -s -t 200

"$@"
