#!/usr/bin/env bash

./node_modules/.bin/tsc
./node_modules/.bin/tsconfig-replace-paths
find build -mindepth 1 -maxdepth 1 ! -name "src" -exec rm -rf {} +
mv build/src/* build
rm -rf build/src
