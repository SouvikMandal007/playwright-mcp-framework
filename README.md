# Playwright MCP Framework

A comprehensive Playwright TypeScript framework with modular architecture for scalable UI and API automation testing.

## 🏗️ Architecture

The framework follows a modular layout designed for scalability, clarity, and maintainability:

```
playwright-mcp-framework/
├── tests/                    # UI and API test cases
│   ├── example.spec.ts      # Basic UI test examples
│   ├── auth.spec.ts         # Authentication workflow tests
│   ├── workflow.spec.ts     # Workflow interaction tests
│   ├── api.spec.ts          # API testing examples
│   ├── framework.spec.ts    # Framework verification tests
│   └── complete-demo.spec.ts # Complete demo tests
├── testcontexts/            # Reusable test contexts
│   ├── setup.context.ts     # Setup and teardown utilities
│   ├── auth.context.ts      # Authentication helpers
│   ├── workflow.context.ts  # Common workflow utilities
│   ├── api.context.ts       # API testing utilities
│   └── index.ts             # Context exports
├── .github/workflows/       # CI/CD workflows
│   └── playwright.yml       # GitHub Actions workflow
├── playwright.config.ts     # Playwright configuration
├── tsconfig.json           # TypeScript configuration
├── Dockerfile              # Docker containerization
├── docker-compose.yml      # Docker Compose setup
└── package.json            # Project dependencies
```

## 🎯 Key Features

### 1. **Test Organization** (`tests/`)
- UI test cases organized by feature/module
- API testing with RESTful capabilities
- Framework verification tests
- Supports parallel execution and test isolation

### 2. **Reusable Test Contexts** (`testcontexts/`)
- **SetupContext**: Handles test initialization, navigation, and cleanup
- **AuthContext**: Manages authentication workflows (login, logout, session handling)
- **WorkflowContext**: Provides common UI interaction utilities (forms, elements, waits)
- **APIContext**: RESTful API testing with request/response validation

### 3. **Configuration** (`playwright.config.ts`)
- **Browser Support**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Reporters**: HTML, JSON, JUnit, Allure, and List reporters
- **Retries**: Automatic retry on CI environments
- **Artifacts**: Auto-generated screenshots, videos, and traces on failures

### 4. **CI/CD Integration**
- **GitHub Actions**: Automated test execution on push/PR
- **Notifications**: Slack and email notifications for test results
- **Matrix Testing**: Parallel execution across multiple browsers
- **Artifact Upload**: Automatic upload of test reports and results

### 5. **Docker Support**
- **Containerization**: Run tests in isolated Docker containers
- **Docker Compose**: Easy setup with multi-container configuration
- **Consistent Environment**: Same test environment across all platforms

### 6. **Advanced Reporting**
- **Allure Reports**: Rich, interactive test reports with history
- **Multiple Formats**: HTML, JSON, JUnit for different needs
- **Screenshots & Videos**: Visual evidence of test execution
- **Test Trends**: Historical data and trend analysis

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

### APIContext
REST API testing utilities:
- `get(endpoint, options)`: Make GET requests
- `post(endpoint, data, options)`: Make POST requests
- `put(endpoint, data, options)`: Make PUT requests
- `patch(endpoint, data, options)`: Make PATCH requests
- `delete(endpoint, options)`: Make DELETE requests
- `setAuthToken(token)`: Set authentication token
- `verifyStatus(response, code)`: Verify response status
- `verifyResponseContains(response, data)`: Verify response data

## 🐳 Docker Support

Run tests in containers for consistent environments:

```bash
# Using docker-run.sh script
./docker-run.sh

# Using Docker directly
docker build -t playwright-framework .
docker run --rm -v "$(pwd)/test-results:/app/test-results" playwright-framework npm test

# Using Docker Compose
docker-compose up
```

See [DOCKER.md](DOCKER.md) for complete Docker documentation.

## 🔔 Notifications

Get automated test result notifications:

### Slack Notifications
Configure Slack webhook in GitHub repository secrets:
```
SLACK_WEBHOOK_URL: Your Slack webhook URL
```

### Email Notifications
Configure email settings in GitHub secrets:
```
EMAIL_SERVER, EMAIL_PORT, EMAIL_USERNAME, EMAIL_PASSWORD, EMAIL_TO
```

See [NOTIFICATIONS.md](NOTIFICATIONS.md) for setup instructions.

## 📊 API Testing

Full REST API testing support:

```typescript
import { test } from '@playwright/test';
import { APIContext } from '../testcontexts';

test('API test', async ({ request }) => {
  const api = new APIContext(request, 'https://api.example.com');
  const response = await api.get('/users/1');
  await api.verifyStatus(response, 200);
});
```

Run API tests:
```bash
npm run test:api
```

See [API_TESTING.md](API_TESTING.md) for complete API testing guide.

## 📈 Allure Reporting

Generate rich, interactive Allure reports:

```bash
# Run tests and generate Allure report
npm test
npm run report:allure
```

Allure provides:
- Interactive test results
- Historical trends
- Test execution timeline
- Failure categorization
- Screenshots and videos

See [ALLURE.md](ALLURE.md) for Allure setup and usage.

## 🎨 Best Practices

1. **Use Test Contexts**: Leverage reusable contexts instead of repeating code
2. **Organize Tests**: Group related tests in describe blocks
3. **Clean State**: Use `beforeEach` for test isolation
4. **Meaningful Names**: Use descriptive test and variable names
5. **Wait Properly**: Use explicit waits instead of hardcoded delays
6. **Assertions**: Include meaningful assertion messages
7. **Artifacts**: Let framework auto-generate artifacts on failures
8. **API + UI**: Combine API and UI tests for comprehensive coverage

## 🔒 CI/CD Integration

The framework includes a complete GitHub Actions workflow with:
- Multi-browser parallel execution
- Automatic test retries
- Artifact upload (reports, screenshots, videos)
- Slack and email notifications
- Multiple report formats

The workflow is automatically triggered on:
- Push to main/master/develop branches
- Pull requests
- Manual workflow dispatch

See `.github/workflows/playwright.yml` for the complete workflow configuration.

## 📚 Documentation

- [Quick Start Guide](QUICK_START.md) - Get started quickly
- [Docker Setup](DOCKER.md) - Containerization guide
- [API Testing](API_TESTING.md) - REST API testing
- [Allure Reports](ALLURE.md) - Advanced reporting
- [Notifications](NOTIFICATIONS.md) - Slack/Email setup
- [Playwright Documentation](https://playwright.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:
1. Create a feature branch
2. Write tests for new features
3. Ensure all tests pass
4. Submit a pull request

## 📄 License

MIT License