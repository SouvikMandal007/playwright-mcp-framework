# Playwright MCP Framework

A comprehensive Playwright TypeScript framework with modular architecture for scalable UI automation testing.

## 🏗️ Architecture

The framework follows a modular layout designed for scalability, clarity, and maintainability:

```
playwright-mcp-framework/
├── tests/                    # UI test cases
│   ├── example.spec.ts      # Basic UI test examples
│   ├── auth.spec.ts         # Authentication workflow tests
│   └── workflow.spec.ts     # Workflow interaction tests
├── testcontexts/            # Reusable test contexts
│   ├── setup.context.ts     # Setup and teardown utilities
│   ├── auth.context.ts      # Authentication helpers
│   ├── workflow.context.ts  # Common workflow utilities
│   └── index.ts             # Context exports
├── playwright.config.ts     # Playwright configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies
```

## 🎯 Key Features

### 1. **Test Organization** (`tests/`)
- Contains all UI test cases organized by feature/module
- Uses Playwright's test runner with TypeScript
- Supports parallel execution and test isolation

### 2. **Reusable Test Contexts** (`testcontexts/`)
- **SetupContext**: Handles test initialization, navigation, and cleanup
- **AuthContext**: Manages authentication workflows (login, logout, session handling)
- **WorkflowContext**: Provides common UI interaction utilities (forms, elements, waits)

### 3. **Configuration** (`playwright.config.ts`)
- **Browser Support**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Reporters**: HTML, JSON, JUnit, and List reporters
- **Retries**: Automatic retry on CI environments
- **Artifacts**: Auto-generated screenshots, videos, and traces on failures

### 4. **Artifact Generation**
- **Screenshots**: Captured on test failures
- **Videos**: Recorded and retained on failures
- **Traces**: Generated on first retry for debugging
- **Reports**: HTML reports with detailed test results

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SouvikMandal007/playwright-mcp-framework.git
cd playwright-mcp-framework
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

## 📝 Usage

### Running Tests

```bash
# Run all tests
npm test

# Run tests in headed mode (with browser UI)
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run tests in UI mode
npm run test:ui

# Run specific test file
npx playwright test tests/example.spec.ts

# Run tests on specific browser
npx playwright test --project=chromium
```

### Viewing Reports

```bash
# Open HTML report
npm run report
```

### Writing Tests

Example using test contexts:

```typescript
import { test, expect } from '@playwright/test';
import { SetupContext, AuthContext, WorkflowContext } from '../testcontexts';

test.describe('My Feature Tests', () => {
  let setupContext: SetupContext;
  let authContext: AuthContext;
  let workflowContext: WorkflowContext;

  test.beforeEach(async ({ page, context }) => {
    setupContext = new SetupContext(page, context);
    authContext = new AuthContext(page, context);
    workflowContext = new WorkflowContext(page);
  });

  test('should login and perform action', async ({ page }) => {
    // Navigate to page
    await setupContext.navigateTo('https://example.com');
    
    // Perform login
    await authContext.login('user@example.com', 'password');
    
    // Interact with UI
    await workflowContext.fillForm({ field1: 'value1' });
    await workflowContext.submitForm();
    
    // Assert results
    expect(await setupContext.getPageTitle()).toContain('Success');
  });
});
```

## 🔧 Configuration

### Browser Configuration
Edit `playwright.config.ts` to customize:
- Timeout settings
- Parallel execution
- Retry strategies
- Reporter options
- Browser projects

### Environment Variables
- `BASE_URL`: Base URL for tests (default: http://localhost:3000)
- `CI`: Enables CI-specific configurations (retries, parallel workers)

## 📊 Artifacts

All test artifacts are automatically generated in:
- `test-results/`: Test execution results, videos, traces
- `playwright-report/`: HTML test report
- `screenshots/`: Custom screenshots (if taken)

## 🧪 Test Contexts

### SetupContext
Handles test initialization and common operations:
- `navigateTo(url)`: Navigate to a URL
- `waitForPageLoad()`: Wait for page to fully load
- `clearStorage()`: Clear cookies and storage
- `takeScreenshot(name)`: Take custom screenshots
- `getPageTitle()`: Get current page title

### AuthContext
Manages authentication workflows:
- `login(username, password)`: Perform login
- `logout()`: Perform logout
- `isAuthenticated()`: Check authentication status
- `setAuthToken(token)`: Set auth token directly
- `saveAuthState(path)`: Save auth state for reuse

### WorkflowContext
Provides UI interaction utilities:
- `fillForm(data)`: Fill multiple form fields
- `submitForm()`: Submit a form
- `waitForElement(selector)`: Wait for element visibility
- `scrollToElement(selector)`: Scroll element into view
- `dragAndDrop(source, target)`: Perform drag and drop
- `waitForAPIResponse(url)`: Wait for API responses
- `mockAPIRequest(url, data)`: Mock API requests

## 🎨 Best Practices

1. **Use Test Contexts**: Leverage reusable contexts instead of repeating code
2. **Organize Tests**: Group related tests in describe blocks
3. **Clean State**: Use `beforeEach` for test isolation
4. **Meaningful Names**: Use descriptive test and variable names
5. **Wait Properly**: Use explicit waits instead of hardcoded delays
6. **Assertions**: Include meaningful assertion messages
7. **Artifacts**: Let framework auto-generate artifacts on failures

## 🔒 CI/CD Integration

The framework is CI-ready with:
- Automatic retry on failures
- Optimized parallel execution
- Multiple report formats (HTML, JSON, JUnit)
- Artifact retention for debugging

Example GitHub Actions workflow:
```yaml
- name: Install dependencies
  run: npm ci
- name: Install Playwright
  run: npx playwright install --with-deps
- name: Run tests
  run: npm test
- name: Upload artifacts
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Test Best Practices](https://playwright.dev/docs/best-practices)

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:
1. Create a feature branch
2. Write tests for new features
3. Ensure all tests pass
4. Submit a pull request

## 📄 License

MIT License