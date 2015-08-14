#!/usr/bin/env bash
# enable fail detection...
set -e
source /initialize.sh
initialize

mocha /tests/spec/

