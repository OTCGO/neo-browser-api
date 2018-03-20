#!/bin/bash
git reset --hard
git pull origin master:master
rm -rf dist/
npm install
npm run build
pm2 restart pm2.prod.config.js