#!/bin/bash

yum update -y
sudo yum install -y nodejs npm
npm install -g pm2

APP_DIR="/home/ec2-user/polylingo"
mkdir -p "$APP_DIR"
cd "$APP_DIR"

pm2 start dist/app.js --name backend
pm2 startup
pm2 save

