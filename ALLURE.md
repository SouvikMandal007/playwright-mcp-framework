# Allure Reporting Guide

## Overview

Allure is a flexible, multi-language test report tool that provides clear and detailed test execution reports with rich visualizations, test history, and analytics.

## Prerequisites

Install Allure dependencies (already included in package.json):

```bash
npm install
```

## Generating Allure Reports

### Quick Start

```bash
# Run tests (generates allure-results/)
npm test

# Generate and open Allure report
npm run report:allure
```

The Allure report will automatically open in your browser.

### Manual Steps

```bash
# 1. Run tests to generate results
npx playwright test

# 2. Generate Allure report
npx allure generate allure-results --clean -o allure-report

# 3. Open report in browser
npx allure open allure-report
```

## Report Features

### What's Included

- **Test Results Overview** - Pass/fail statistics, duration, trends
- **Test Cases** - Detailed test execution steps
- **Timeline** - Test execution timeline visualization
- **Categories** - Test failure categorization
- **History** - Test execution history and trends
- **Screenshots** - Attached screenshots for failed tests
- **Videos** - Video recordings of test execution
- **Traces** - Playwright traces for debugging

### Viewing Reports

After generation, Allure provides:
- **Behaviors** - Tests grouped by features
- **Graphs** - Visual analytics and trends
- **Suites** - Tests organized by test suites
- **Timeline** - Execution timeline
- **Categories** - Failure categories

## Enhancing Tests with Allure Annotations

### Adding Test Descriptions

```typescript
import { test } from '@playwright/test';
import { allure } from 'allure-playwright';

test('User login', async ({ page }) => {
  await allure.description('Verify user can login with valid credentials');
  await allure.owner('QA Team');
  await allure.severity('critical');
  await allure.tag('smoke', 'authentication');
  
  // Test steps...
});
```

### Test Steps

```typescript
test('Multi-step process', async ({ page }) => {
  await allure.step('Navigate to login page', async () => {
    await page.goto('/login');
  });
  
  await allure.step('Enter credentials', async () => {
    await page.fill('#username', 'user@example.com');
    await page.fill('#password', 'password123');
  });
  
  await allure.step('Click login button', async () => {
    await page.click('button[type="submit"]');
  });
  
  await allure.step('Verify successful login', async () => {
    await expect(page).toHaveURL('/dashboard');
  });
});
```

### Attaching Files

```typescript
test('Test with attachments', async ({ page }) => {
  const screenshot = await page.screenshot();
  
  await allure.attachment('Screenshot', screenshot, 'image/png');
  
  await allure.attachment('Test Data', JSON.stringify({
    username: 'test@example.com',
    timestamp: Date.now()
  }), 'application/json');
});
```

### Test Metadata

```typescript
test('Annotated test', async ({ page }) => {
  await allure.epic('User Management');
  await allure.feature('Authentication');
  await allure.story('User Login');
  await allure.owner('John Doe');
  await allure.severity('blocker');
  await allure.tag('regression', 'p1');
  await allure.link('https://jira.example.com/ISSUE-123', 'Related Issue');
  
  // Test implementation...
});
```

## Severity Levels

Available severity levels:
- `blocker` - Critical issues that block testing
- `critical` - Critical functionality issues
- `normal` - Regular test cases
- `minor` - Minor issues
- `trivial` - Trivial issues

```typescript
test('Critical test', async ({ page }) => {
  await allure.severity('critical');
  // Test...
});
```

## Organizing Tests

### By Epic, Feature, Story

```typescript
test.describe('User Management', () => {
  test.beforeEach(async () => {
    await allure.epic('User Management');
    await allure.feature('User Profile');
  });

  test('Update profile', async ({ page }) => {
    await allure.story('Profile Update');
    // Test...
  });

  test('Delete profile', async ({ page }) => {
    await allure.story('Profile Deletion');
    // Test...
  });
});
```

### By Tags

```typescript
test('Smoke test', async ({ page }) => {
  await allure.tag('smoke', 'authentication', 'p0');
  // Test...
});

test('Regression test', async ({ page }) => {
  await allure.tag('regression', 'api', 'p1');
  // Test...
});
```

## CI/CD Integration

### GitHub Actions

```yaml
- name: Run tests
  run: npm test

- name: Generate Allure report
  if: always()
  run: npx allure generate allure-results --clean -o allure-report

- name: Deploy report to GitHub Pages
  if: always()
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./allure-report
```

### GitLab CI

```yaml
test:
  script:
    - npm test
    - npx allure generate allure-results --clean -o allure-report
  artifacts:
    when: always
    paths:
      - allure-report/
    expire_in: 30 days
```

### Jenkins

```groovy
stage('Test') {
  steps {
    sh 'npm test'
  }
  post {
    always {
      allure([
        includeProperties: false,
        jdk: '',
        results: [[path: 'allure-results']]
      ])
    }
  }
}
```

## Report History

Allure supports test history tracking:

```bash
# Copy history from previous run
cp -r allure-report/history allure-results/history

# Generate report with history
npx allure generate allure-results --clean -o allure-report
```

### Automated History Management

```bash
#!/bin/bash
# save-history.sh

# Save history before cleaning
if [ -d "allure-report/history" ]; then
  mkdir -p allure-results/history
  cp -r allure-report/history/* allure-results/history/
fi

# Generate new report
npx allure generate allure-results --clean -o allure-report
```

## Custom Categories

Create `categories.json` in project root to categorize failures:

```json
[
  {
    "name": "UI Failures",
    "matchedStatuses": ["failed"],
    "messageRegex": ".*ElementNotFound.*"
  },
  {
    "name": "API Failures",
    "matchedStatuses": ["failed"],
    "messageRegex": ".*API.*"
  },
  {
    "name": "Timeout Issues",
    "matchedStatuses": ["failed"],
    "messageRegex": ".*timeout.*"
  }
]
```

## Report Hosting

### Local Server

```bash
# Serve report on local server
npx allure open allure-report

# Report will be available at http://localhost:random-port
```

### Static Hosting

Deploy the `allure-report/` directory to any static hosting:
- GitHub Pages
- Netlify
- AWS S3
- Azure Blob Storage
- Google Cloud Storage

### Docker

```dockerfile
FROM nginx:alpine
COPY allure-report /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
docker build -t allure-report .
docker run -p 8080:80 allure-report
```

## Troubleshooting

### Report Not Generating

```bash
# Verify allure-results directory exists and has data
ls -la allure-results/

# Clean and regenerate
rm -rf allure-report allure-results
npm test
npm run report:allure
```

### Missing Test Results

```bash
# Ensure allure-playwright is in playwright.config.ts
# Check reporter configuration
```

### History Not Showing

```bash
# Ensure history is copied before cleaning
cp -r allure-report/history allure-results/history
npx allure generate allure-results --clean -o allure-report
```

## Best Practices

1. **Use Descriptive Names** - Write clear test names and descriptions
2. **Add Test Steps** - Break tests into logical steps
3. **Attach Evidence** - Include screenshots, logs, and data
4. **Categorize Tests** - Use epic/feature/story hierarchy
5. **Tag Appropriately** - Use tags for filtering and organization
6. **Set Severity** - Mark critical tests with appropriate severity
7. **Maintain History** - Keep test execution history for trends
8. **Clean Reports** - Use `--clean` flag to avoid stale data

## Example: Complete Test with Allure

```typescript
import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

test.describe('E-commerce Checkout', () => {
  test.beforeEach(async () => {
    await allure.epic('E-commerce');
    await allure.feature('Checkout Process');
  });

  test('Complete purchase flow', async ({ page }) => {
    await allure.story('End-to-End Purchase');
    await allure.severity('critical');
    await allure.owner('QA Team');
    await allure.tag('smoke', 'checkout', 'p0');
    await allure.description('Verify user can complete a purchase from cart to confirmation');

    await allure.step('Add product to cart', async () => {
      await page.goto('/products');
      await page.click('[data-testid="add-to-cart"]');
      await allure.attachment('Cart State', JSON.stringify({ items: 1 }), 'application/json');
    });

    await allure.step('Proceed to checkout', async () => {
      await page.click('[data-testid="cart-icon"]');
      await page.click('text=Checkout');
    });

    await allure.step('Fill shipping information', async () => {
      await page.fill('#address', '123 Main St');
      await page.fill('#city', 'New York');
      const screenshot = await page.screenshot();
      await allure.attachment('Shipping Form', screenshot, 'image/png');
    });

    await allure.step('Complete payment', async () => {
      await page.fill('#card', '4111111111111111');
      await page.click('text=Place Order');
    });

    await allure.step('Verify order confirmation', async () => {
      await expect(page.locator('text=Order Confirmed')).toBeVisible();
      await allure.attachment('Order ID', '12345', 'text/plain');
    });
  });
});
```

## Resources

- [Allure Documentation](https://docs.qameta.io/allure/)
- [Allure Playwright Plugin](https://www.npmjs.com/package/allure-playwright)
- [Report Examples](https://demo.qameta.io/allure/)
