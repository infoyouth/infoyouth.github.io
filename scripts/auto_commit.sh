#!/bin/bash

# Define the modified file (assuming a single file, adjust if needed)
MODIFIED_FILE=$(git status --porcelain | grep "^ M _posts/" | awk '{print $2}')

if [[ -z "$MODIFIED_FILE" ]]; then
    echo "No modified files in _posts/ to commit."
    exit 0
fi

# First commit
git add "$MODIFIED_FILE"
git commit -m "New blogpost"

# Format the file
./format.sh

# Second commit for formatting
git add "$MODIFIED_FILE"
git commit -m "Fix formatting issues"

# Push changes
git push

