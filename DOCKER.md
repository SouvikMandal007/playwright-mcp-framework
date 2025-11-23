# Docker Setup Guide

## Overview

This framework includes Docker support for containerized test execution, ensuring consistent test environments across different machines and CI/CD pipelines.

## Prerequisites

- Docker installed on your machine
- Docker Compose (optional, for docker-compose.yml)

## Quick Start

### Using Docker Run Script

The easiest way to run tests in Docker:

```bash
# Make script executable (Linux/Mac)
chmod +x docker-run.sh

# Run all tests
./docker-run.sh

# Run specific test file
./docker-run.sh tests/framework.spec.ts
```

### Using Docker Commands

```bash
# Build the Docker image
docker build -t playwright-mcp-framework .

# Run all tests
docker run --rm \
  -v "$(pwd)/test-results:/app/test-results" \
  -v "$(pwd)/playwright-report:/app/playwright-report" \
  playwright-mcp-framework npm test

# Run specific test
docker run --rm \
  -v "$(pwd)/test-results:/app/test-results" \
  -v "$(pwd)/playwright-report:/app/playwright-report" \
  playwright-mcp-framework npx playwright test tests/api.spec.ts

# Run with custom base URL
docker run --rm \
  -e BASE_URL=https://example.com \
  -v "$(pwd)/test-results:/app/test-results" \
  playwright-mcp-framework npm test
```

### Using Docker Compose

Docker Compose provides an easy way to manage multi-container setups:

```bash
# Run tests
docker-compose up playwright-tests

# Run tests and view reports
docker-compose up

# View reports at http://localhost:8080
# (after tests complete)

# Clean up
docker-compose down
```

## Dockerfile Details

The Dockerfile uses the official Microsoft Playwright image which includes:
- Node.js
- All Playwright browsers pre-installed
- System dependencies

### Customizing the Dockerfile

You can customize the base image version in the Dockerfile:

```dockerfile
FROM mcr.microsoft.com/playwright:v1.40.0-jammy
```

Change the version tag to use a different Playwright version.

## Volume Mounts

The Docker setup mounts three directories:
- `test-results/` - Test execution results, videos, traces
- `playwright-report/` - HTML reports
- `screenshots/` - Custom screenshots

These volumes allow you to access test artifacts on your host machine.

## Environment Variables

Available environment variables:
- `BASE_URL` - Base URL for tests (default: http://localhost:3000)
- `CI` - Set to true for CI mode (enables retries)
- `NODE_ENV` - Node environment (default: production)

Example:
```bash
docker run --rm \
  -e BASE_URL=https://staging.example.com \
  -e CI=true \
  playwright-mcp-framework npm test
```

## CI/CD Integration

### GitHub Actions

The Docker image can be used in GitHub Actions:

```yaml
- name: Run tests in Docker
  run: |
    docker build -t playwright-tests .
    docker run --rm \
      -v ${{ github.workspace }}/test-results:/app/test-results \
      playwright-tests npm test
```

### GitLab CI

```yaml
test:
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t playwright-tests .
    - docker run --rm playwright-tests npm test
```

## Troubleshooting

### Permission Issues

If you encounter permission issues with mounted volumes:

```bash
# Run with user ID
docker run --rm --user $(id -u):$(id -g) \
  -v "$(pwd)/test-results:/app/test-results" \
  playwright-mcp-framework npm test
```

### Browser Launch Issues

If browsers fail to launch in Docker:
- Ensure you're using the official Playwright image
- Check that `--with-deps` was used during browser installation
- Verify sufficient system resources (memory, CPU)

### Network Issues

For tests requiring network access:

```bash
# Use host network
docker run --rm --network host \
  playwright-mcp-framework npm test
```

## Best Practices

1. **Use specific image versions** - Pin Playwright version for consistency
2. **Mount volumes** - Always mount test results for debugging
3. **Environment variables** - Use env vars for configuration
4. **Clean up** - Use `--rm` flag to auto-remove containers
5. **Resource limits** - Set memory/CPU limits for CI environments

```bash
# Example with resource limits
docker run --rm \
  --memory=2g \
  --cpus=2 \
  -v "$(pwd)/test-results:/app/test-results" \
  playwright-mcp-framework npm test
```

## Examples

### Run on Different Browsers

```bash
# Chromium only
docker run --rm \
  playwright-mcp-framework \
  npx playwright test --project=chromium

# Firefox only
docker run --rm \
  playwright-mcp-framework \
  npx playwright test --project=firefox
```

### Debug Mode

```bash
# Run with headed mode
docker run --rm \
  -e HEADED=true \
  playwright-mcp-framework \
  npm run test:headed
```

### Parallel Execution

```bash
# Run with specific number of workers
docker run --rm \
  playwright-mcp-framework \
  npx playwright test --workers=4
```
