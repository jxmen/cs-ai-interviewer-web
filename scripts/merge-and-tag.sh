#!/bin/bash

# pr merge
gh pr merge --delete-branch --rebase

# Get the current branch name
version=$(cat package.json | jq -r '.version')

# tag and
git tag $version

# push the tag
git push origin $version

