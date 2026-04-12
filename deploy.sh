#!/bin/sh
# deploy.sh
set -e

# build
hugo
cp public/404.html public/not_found.html

# commit and push to github
git add -A
git commit -m "chore: deploy $(date '+%Y-%m-%d %H:%M')"
git push

# push to neocities
neocities push public
