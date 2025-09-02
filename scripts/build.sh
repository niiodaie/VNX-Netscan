#!/usr/bin/env bash
set -euo pipefail

# Build client
pushd client
npm ci
npm run build
popd

# Install server deps
pushd server
npm ci
popd