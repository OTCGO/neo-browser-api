#!/bin/bash
export NVM_DIR="/home/qknow/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
git reset --hard
git pull origin master:master
rm -rf dist/
npm install
npm run build
