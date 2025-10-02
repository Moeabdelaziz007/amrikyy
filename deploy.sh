#!/bin/bash
# Exit immediately if a command exits with a non-zero status.
set -e

echo "Step 1: Installing dependencies..."
#!/usr/bin/env bash
# Robust deploy script for Firebase Hosting (no Docker dependency)
set -euo pipefail

# Colors
RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
BLUE="\033[0;34m"
NC="\033[0m"

log() { echo -e "${BLUE}[INFO]${NC} $*"; }
ok()  { echo -e "${GREEN}[OK]${NC} $*"; }
warn(){ echo -e "${YELLOW}[WARN]${NC} $*"; }
err() { echo -e "${RED}[ERROR]${NC} $*"; }

fail() {
	err "$*"
	exit 1
}

check_command() {
	if ! command -v "$1" >/dev/null 2>&1; then
		return 1
	fi
	return 0
}

log "Starting simplified deployment script"

# Prerequisite checks
log "Checking prerequisites..."
check_command node || fail "Node.js is not installed or not in PATH. Install Node.js (https://nodejs.org/)"
check_command npm  || fail "npm is not installed or not in PATH. Install Node.js/npm"
check_command firebase || warn "firebase CLI not found. Install with 'npm install -g firebase-tools' or ensure it's in PATH. If running in CI, set FIREBASE_TOKEN and install firebase-tools in CI."

# Use npm ci when lockfile exists (reproducible installs)
if [ -f package-lock.json ] || [ -f npm-shrinkwrap.json ]; then
	log "Lockfile detected, using 'npm ci' for reproducible installs"
	NPM_INSTALL_CMD=(npm ci)
else
	log "No lockfile detected, using 'npm install'"
	NPM_INSTALL_CMD=(npm install)
fi

log "Step 1: Installing dependencies..."
