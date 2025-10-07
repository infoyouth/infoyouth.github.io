#!/bin/bash

set -e  # Exit immediately if any command fails

git checkout main

echo "🔄 Pulling latest changes from remote..."
git pull
echo "✅ Pull complete."

# Prompt user for branch selection
echo "📌 Available remote branches:"
git branch -r

read -p "Enter the branch you want to switch to: " target_branch

echo "🚀 Checking out branch: $target_branch..."
git checkout "$target_branch"

echo "🔄 Pulling latest changes for $target_branch..."
git pull
echo "✅ Branch $target_branch is up to date."

# Open VS Code and wait for user input
echo "🖥️ Opening VS Code in background..."
code ./ &

read -p "Press Enter to continue once you're done editing..."

# Run the auto_commit.sh script
if [[ -f "auto_commit.sh" ]]; then
    echo "📜 Running auto_commit.sh..."
    ./auto_commit.sh
    echo "✅ auto_commit.sh execution complete."
else
    echo "⚠️ auto_commit.sh not found!"
fi

echo "🎉 Script execution completed!"

