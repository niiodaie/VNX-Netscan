#!/usr/bin/env bash
set -euo pipefail

# Copy client build into server (to serve statically)
rm -rf server/dist
mkdir -p server/dist
cp -R client/dist/* server/dist/

# Create deployment zip from server folder only
pushd server
zip -r ../VNX-Netscan-Deployment.zip . -x "node_modules/*"
popd