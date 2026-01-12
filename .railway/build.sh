#!/bin/bash
set -e

# Install dependencies without frozen lockfile to allow lockfile updates
bun install

# Build the project
bun run build

