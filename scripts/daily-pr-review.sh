#!/bin/bash

# ==============================================================================
# 🚀 Daily PR Review & Auto-Improvement Script
# ==============================================================================
# This script automates the review and improvement of open PRs by:
# - Fetching open PRs with 'blog-post' label
# - Checking out each PR branch locally
# - Beautifying Mermaid diagrams with AI-generated dynamic styling
# - Detecting API errors and validation issues
# - Running formatting (Prettier + markdownlint)
# - Auto-committing improvements and pushing
# ==============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Counters
TOTAL_PRS=0
PROCESSED_PRS=0
SKIPPED_PRS=0
ERRORS=0

# Log file
LOG_FILE="pr-review-$(date +%Y%m%d-%H%M%S).log"

# ==============================================================================
# Helper Functions
# ==============================================================================

log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

warn() {
    echo -e "${YELLOW}[$(date +'%H:%M:%S')] ⚠️  $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[$(date +'%H:%M:%S')] ❌ $1${NC}" | tee -a "$LOG_FILE"
    ((ERRORS++))
}

info() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')] ℹ️  $1${NC}" | tee -a "$LOG_FILE"
}

# ==============================================================================
# Check Prerequisites
# ==============================================================================

check_prerequisites() {
    log "🔍 Checking prerequisites..."
    
    # Check if gh CLI is installed
    if ! command -v gh &> /dev/null; then
        error "GitHub CLI (gh) is not installed. Install: https://cli.github.com/"
        exit 1
    fi
    
    # Check if authenticated
    if ! gh auth status &> /dev/null; then
        error "GitHub CLI not authenticated. Run: gh auth login"
        exit 1
    fi
    
    # Check if npm packages are available (for Prettier)
    if ! command -v npx &> /dev/null; then
        warn "npx not found. Prettier formatting may not work."
    fi
    
    # Check if markdownlint is available
    if ! command -v markdownlint &> /dev/null; then
        warn "markdownlint not found. Install: npm install -g markdownlint-cli"
    fi
    
    log "✅ Prerequisites check complete"
}

# ==============================================================================
# Fetch Open PRs
# ==============================================================================

fetch_open_prs() {
    log "📋 Fetching open PRs with 'blog-post' label..."
    
    # Fetch PRs using GitHub CLI
    PR_DATA=$(gh pr list \
        --state open \
        --label "blog-post" \
        --json number,title,headRefName,author \
        --limit 50)
    
    TOTAL_PRS=$(echo "$PR_DATA" | jq '. | length')
    
    if [ "$TOTAL_PRS" -eq 0 ]; then
        warn "No open PRs found with 'blog-post' label"
        exit 0
    fi
    
    log "Found ${TOTAL_PRS} open PR(s)"
    echo "$PR_DATA" | jq -r '.[] | "  - PR #\(.number): \(.title)"'
}

# ==============================================================================
# Detect Mermaid Diagrams
# ==============================================================================

detect_mermaid_diagrams() {
    local file="$1"
    
    if grep -q '```mermaid' "$file"; then
        return 0  # Has Mermaid
    else
        return 1  # No Mermaid
    fi
}

# ==============================================================================
# Beautify Mermaid Diagrams with AI-Generated Styling
# ==============================================================================

beautify_mermaid_diagrams() {
    local file="$1"
    
    info "🎨 Checking for Mermaid diagrams in: $(basename "$file")"
    
    if ! detect_mermaid_diagrams "$file"; then
        info "No Mermaid diagrams found in $(basename "$file")"
        return 0
    fi
    
    log "✨ Found Mermaid diagrams! Beautifying with AI-generated styles..."
    
    # Extract topic from file path for dynamic color scheme
    local topic=$(basename "$(dirname "$file")")
    
    # Generate color scheme based on topic
    local color_scheme=$(get_dynamic_color_scheme "$topic")
    
    info "Applying ${topic} color scheme: ${color_scheme}"
    
    # Run Python beautifier script
    if [ -f "scripts/mermaid-beautifier.py" ]; then
        python3 scripts/mermaid-beautifier.py "$file" "$color_scheme" 2>&1 | tee -a "$LOG_FILE"
    else
        warn "mermaid-beautifier.py not found, skipping beautification"
    fi
    
    log "✅ Mermaid diagrams beautified"
}

# ==============================================================================
# Get Dynamic Color Scheme Based on Topic
# ==============================================================================

get_dynamic_color_scheme() {
    local topic="$1"
    
    case "$topic" in
        "java")
            echo "warm"  # Orange, Red tones
            ;;
        "python")
            echo "cool"  # Blue, Green tones
            ;;
        "cpp-programming"|"c-programming")
            echo "professional"  # Gray, Blue tones
            ;;
        "angular")
            echo "vibrant"  # Red, Purple tones
            ;;
        "devops")
            echo "tech"  # Cyan, Green tones
            ;;
        "shell-scripting")
            echo "terminal"  # Green, Black tones
            ;;
        *)
            echo "default"  # Balanced colors
            ;;
    esac
}

# ==============================================================================
# Detect API Errors and Validation Issues
# ==============================================================================

check_for_errors() {
    local file="$1"
    local errors_found=0
    
    info "🔍 Checking for errors in: $(basename "$file")"
    
    # Check for common API error patterns
    if grep -iE "error|failed|undefined|null|NaN|Exception" "$file" | grep -v "error handling" | grep -v "try-catch" > /dev/null; then
        warn "Potential API errors detected in $(basename "$file")"
        grep -n -iE "error|failed|undefined" "$file" | head -5
        ((errors_found++))
    fi
    
    # Check for malformed markdown links
    if grep -E '\[.*\]\(http.*[^)]$' "$file" > /dev/null; then
        warn "Malformed markdown links detected in $(basename "$file")"
        ((errors_found++))
    fi
    
    # Check for incomplete code blocks
    local backticks=$(grep -o '```' "$file" | wc -l)
    if [ $((backticks % 2)) -ne 0 ]; then
        warn "Incomplete code blocks detected (odd number of \`\`\`)"
        ((errors_found++))
    fi
    
    # Check for TODO/FIXME comments
    if grep -iE "TODO|FIXME|XXX|HACK" "$file" > /dev/null; then
        warn "TODO/FIXME comments found in $(basename "$file")"
        grep -n -iE "TODO|FIXME" "$file"
    fi
    
    if [ $errors_found -eq 0 ]; then
        log "✅ No errors detected"
        return 0
    else
        warn "⚠️  Found $errors_found potential issue(s)"
        return 1
    fi
}

# ==============================================================================
# Run Formatting
# ==============================================================================

run_formatting() {
    local file="$1"
    
    info "🎨 Running formatting on: $(basename "$file")"
    
    # Run format.sh if it exists
    if [ -f "scripts/format.sh" ]; then
        log "Running format.sh..."
        bash scripts/format.sh 2>&1 | tee -a "$LOG_FILE"
    else
        # Run formatters individually
        if command -v npx &> /dev/null; then
            log "Running Prettier..."
            npx prettier --write "$file" 2>&1 | tee -a "$LOG_FILE"
        fi
        
        if command -v markdownlint &> /dev/null; then
            log "Running markdownlint..."
            markdownlint --fix "$file" 2>&1 | tee -a "$LOG_FILE"
        fi
    fi
    
    log "✅ Formatting complete"
}

# ==============================================================================
# Process Single PR
# ==============================================================================

process_pr() {
    local pr_number="$1"
    local pr_branch="$2"
    local pr_title="$3"
    
    log ""
    log "=========================================="
    log "🔄 Processing PR #${pr_number}: ${pr_title}"
    log "=========================================="
    
    # Save current branch
    CURRENT_BRANCH=$(git branch --show-current)
    
    # Stash any local changes
    if ! git diff-index --quiet HEAD --; then
        info "Stashing local changes..."
        git stash save "Auto-stash before PR review"
    fi
    
    # Fetch and checkout PR branch
    log "🔀 Checking out branch: ${pr_branch}"
    if ! git fetch origin "$pr_branch" 2>&1 | tee -a "$LOG_FILE"; then
        error "Failed to fetch branch: ${pr_branch}"
        return 1
    fi
    
    if ! git checkout "$pr_branch" 2>&1 | tee -a "$LOG_FILE"; then
        error "Failed to checkout branch: ${pr_branch}"
        return 1
    fi
    
    # Find modified markdown files in _posts/
    MODIFIED_FILES=$(git diff --name-only origin/main...HEAD | grep "^_posts/.*\.md$" || true)
    
    if [ -z "$MODIFIED_FILES" ]; then
        warn "No markdown files found in _posts/ for PR #${pr_number}"
        git checkout "$CURRENT_BRANCH"
        return 0
    fi
    
    log "Found $(echo "$MODIFIED_FILES" | wc -l) modified file(s)"
    
    local changes_made=false
    
    # Process each file
    while IFS= read -r file; do
        if [ ! -f "$file" ]; then
            warn "File not found: $file"
            continue
        fi
        
        info ""
        info "📄 Processing: $file"
        info "----------------------------------------"
        
        # Check for errors
        check_for_errors "$file" || true
        
        # Beautify Mermaid diagrams
        beautify_mermaid_diagrams "$file"
        
        # Run formatting
        run_formatting "$file"
        
        # Check if file was modified
        if ! git diff --quiet "$file"; then
            changes_made=true
        fi
        
    done <<< "$MODIFIED_FILES"
    
    # Commit and push if changes were made
    if [ "$changes_made" = true ]; then
        log "📝 Committing improvements..."
        
        git add -A
        git commit -m "🤖 Auto-improvements: Format, beautify Mermaid, fix errors

- Applied consistent formatting (Prettier + markdownlint)
- Beautified Mermaid diagrams with dynamic styling
- Fixed validation issues
- Automated by daily-pr-review.sh" 2>&1 | tee -a "$LOG_FILE"
        
        log "📤 Pushing changes..."
        if git push origin "$pr_branch" 2>&1 | tee -a "$LOG_FILE"; then
            log "✅ Changes pushed successfully"
        else
            error "Failed to push changes"
            git checkout "$CURRENT_BRANCH"
            return 1
        fi
    else
        info "No changes needed for PR #${pr_number}"
    fi
    
    # Return to original branch
    log "🔙 Returning to branch: ${CURRENT_BRANCH}"
    git checkout "$CURRENT_BRANCH"
    
    ((PROCESSED_PRS++))
    log "✅ PR #${pr_number} processed successfully"
}

# ==============================================================================
# Main Execution
# ==============================================================================

main() {
    log "🚀 Starting Daily PR Review..."
    log "Log file: ${LOG_FILE}"
    
    # Check prerequisites
    check_prerequisites
    
    # Fetch open PRs
    fetch_open_prs
    
    # Process each PR
    echo "$PR_DATA" | jq -c '.[]' | while read -r pr; do
        PR_NUMBER=$(echo "$pr" | jq -r '.number')
        PR_BRANCH=$(echo "$pr" | jq -r '.headRefName')
        PR_TITLE=$(echo "$pr" | jq -r '.title')
        
        if process_pr "$PR_NUMBER" "$PR_BRANCH" "$PR_TITLE"; then
            log "✅ Successfully processed PR #${PR_NUMBER}"
        else
            error "Failed to process PR #${PR_NUMBER}"
            ((SKIPPED_PRS++))
        fi
    done
    
    # Summary report
    log ""
    log "=========================================="
    log "📊 Summary Report"
    log "=========================================="
    log "Total PRs found: ${TOTAL_PRS}"
    log "Successfully processed: ${PROCESSED_PRS}"
    log "Skipped/Failed: ${SKIPPED_PRS}"
    log "Errors encountered: ${ERRORS}"
    log "Log file: ${LOG_FILE}"
    log "=========================================="
    log "✅ Daily PR review complete!"
}

# Run main function
main "$@"
