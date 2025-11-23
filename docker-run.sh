#!/bin/bash

# Docker run script for Playwright tests
# Usage: ./docker-run.sh [test-file]

echo "Building Docker image..."
docker build -t playwright-mcp-framework .

echo "Running Playwright tests in Docker..."
if [ -z "$1" ]; then
    # Run all tests
    docker run --rm \
        -v "$(pwd)/test-results:/app/test-results" \
        -v "$(pwd)/playwright-report:/app/playwright-report" \
        -v "$(pwd)/screenshots:/app/screenshots" \
        playwright-mcp-framework npm test
else
    # Run specific test file
    docker run --rm \
        -v "$(pwd)/test-results:/app/test-results" \
        -v "$(pwd)/playwright-report:/app/playwright-report" \
        -v "$(pwd)/screenshots:/app/screenshots" \
        playwright-mcp-framework npx playwright test "$1"
fi

echo "Tests completed. Check test-results/ and playwright-report/ directories."
