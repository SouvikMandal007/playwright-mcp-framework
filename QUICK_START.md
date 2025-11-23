# Quick Start Guide

## Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npx playwright test tests/framework.spec.ts

# Run tests in headed mode
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run tests in UI mode
npm run test:ui

# Run tests on specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Viewing Reports

```bash
# Open HTML report
npm run report

# Reports are auto-generated in:
# - playwright-report/ (HTML)
# - test-results/ (JSON, JUnit, videos, screenshots, traces)
```

## Writing Your First Test

```typescript
import { test, expect } from '@playwright/test';
import { SetupContext, WorkflowContext } from '../testcontexts';

test.describe('My Tests', () => {
  let setupContext: SetupContext;
  let workflowContext: WorkflowContext;

  test.beforeEach(async ({ page, context }) => {
    setupContext = new SetupContext(page, context);
    workflowContext = new WorkflowContext(page);
  });

  test('my first test', async ({ page }) => {
    await setupContext.navigateTo('https://example.com');
    const title = await setupContext.getPageTitle();
    expect(title).toContain('Example');
  });
});
```

## Context Usage Examples

### SetupContext
```typescript
// Navigate
await setupContext.navigateTo('https://example.com');

// Wait for page load
await setupContext.waitForPageLoad();

// Set viewport
await setupContext.setViewport(1920, 1080);

// Clear storage
await setupContext.clearStorage();

// Get page info
const title = await setupContext.getPageTitle();
const url = setupContext.getCurrentUrl();

// Take screenshot
await setupContext.takeScreenshot('my-screenshot');

// Reload page
await setupContext.reloadPage();
```

### WorkflowContext
```typescript
// Fill form
await workflowContext.fillForm({
  username: 'john',
  email: 'john@example.com'
});

// Submit form
await workflowContext.submitForm();

// Select dropdown
await workflowContext.selectDropdown('#country', 'USA');

// Toggle checkbox
await workflowContext.toggleCheckbox('#agree', true);

// Wait for element
await workflowContext.waitForElement('.success-message');

// Get element text
const text = await workflowContext.getElementText('#title');

// Check if element exists
const exists = await workflowContext.elementExists('#logo');

// Interact with elements
await workflowContext.hoverElement('#menu');
await workflowContext.scrollToElement('#footer');

// Wait for API
const data = await workflowContext.waitForAPIResponse('/api/users');

// Mock API
await workflowContext.mockAPIRequest('/api/data', { status: 'ok' });
```

### AuthContext
```typescript
// Login
await authContext.login('user@example.com', 'password123');

// Logout
await authContext.logout();

// Check authentication
const isAuth = await authContext.isAuthenticated();

// Set auth token
await authContext.setAuthToken('token-123');

// Get auth token
const token = await authContext.getAuthToken();

// Save auth state
await authContext.saveAuthState('.auth/user.json');

// OAuth login
await authContext.loginWithOAuth('Google', {
  username: 'user@gmail.com',
  password: 'pass123'
});
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Configuration

Edit `playwright.config.ts` to customize:
- Browsers and devices
- Timeouts
- Retry logic
- Reporter options
- Base URL
- Test directory
- Artifact settings

## Tips

1. Use `test.only()` to run a single test during development
2. Use `test.skip()` to skip tests temporarily
3. Group related tests with `test.describe()`
4. Use `test.beforeEach()` for common setup
5. Use `test.afterEach()` for cleanup
6. Check artifacts in `test-results/` for debugging
7. Use trace viewer: `npx playwright show-trace trace.zip`

## Troubleshooting

**Tests failing?**
- Check network connectivity
- Verify selectors are correct
- Check timeout settings
- Review screenshots/videos in test-results/

**TypeScript errors?**
```bash
npx tsc --noEmit
```

**Browser not installed?**
```bash
npx playwright install chromium
```

## Support

- Documentation: See README.md
- Playwright Docs: https://playwright.dev
- Issues: GitHub repository issues
