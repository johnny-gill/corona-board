#!/bin/bash

git pull

npm install

(cd ../tools && node main.js)

gatsby build

aws s3 sync \
--acl public-read \
--cache-control public,max-age=0,must-revalidate \
--exclude "*" \
--include "*.html" --include "*.json" \
--delete \
./public s3://baboonyang.kr

aws s3 sync \
--acl public-read \
--cache-control public,max-age=31536000,immutable \
--exclude "*.html" --include "*.json" \
--delete \
./public s3://baboonyang.kr