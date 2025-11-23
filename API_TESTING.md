# API Testing Guide

## Overview

The framework includes comprehensive API testing capabilities using Playwright's built-in request context. This allows you to test RESTful APIs alongside your UI tests.

## Quick Start

```typescript
import { test, expect } from '@playwright/test';
import { APIContext } from '../testcontexts';

test('API test example', async ({ request }) => {
  const api = new APIContext(request, 'https://api.example.com');
  
  const response = await api.get('/users/1');
  await api.verifyStatus(response, 200);
  
  const data = await api.getJSON(response);
  expect(data).toHaveProperty('id', 1);
});
```

## APIContext

The `APIContext` class provides a clean API for making HTTP requests and verifying responses.

### Initialization

```typescript
// Basic initialization
const api = new APIContext(request);

// With base URL
const api = new APIContext(request, 'https://api.example.com');
```

### HTTP Methods

#### GET Request

```typescript
// Simple GET
const response = await api.get('/users');

// With query parameters
const response = await api.get('/users', {
  params: { page: 1, limit: 10 }
});

// With custom headers
const response = await api.get('/users', {
  headers: { 'X-Custom-Header': 'value' }
});
```

#### POST Request

```typescript
// Create resource
const response = await api.post('/users', {
  name: 'John Doe',
  email: 'john@example.com'
});

// With custom headers
const response = await api.post('/users', data, {
  headers: { 'Content-Type': 'application/json' }
});
```

#### PUT Request

```typescript
// Update resource
const response = await api.put('/users/1', {
  name: 'Jane Doe',
  email: 'jane@example.com'
});
```

#### PATCH Request

```typescript
// Partial update
const response = await api.patch('/users/1', {
  name: 'Jane Smith'
});
```

#### DELETE Request

```typescript
// Delete resource
const response = await api.delete('/users/1');

// With headers
const response = await api.delete('/users/1', {
  headers: { 'X-Confirm': 'true' }
});
```

### Authentication

#### Bearer Token

```typescript
// Set authentication token
api.setAuthToken('your-jwt-token');

// All subsequent requests will include:
// Authorization: Bearer your-jwt-token
```

#### Custom Headers

```typescript
// Set default headers for all requests
api.setDefaultHeaders({
  'X-API-Key': 'your-api-key',
  'X-Client-Id': 'your-client-id'
});
```

### Response Verification

#### Status Code

```typescript
const response = await api.get('/users/1');
await api.verifyStatus(response, 200);
```

#### Response Body

```typescript
// Get JSON response
const data = await api.getJSON(response);
expect(data).toHaveProperty('id');

// Get text response
const text = await api.getText(response);
expect(text).toContain('expected value');
```

#### Verify Response Data

```typescript
// Verify specific fields
await api.verifyResponseContains(response, {
  id: 1,
  name: 'John Doe',
  status: 'active'
});
```

#### Response Headers

```typescript
// Verify header value
api.verifyHeader(response, 'content-type', 'application/json');
```

### Response Time

```typescript
// Verify response time is acceptable
await api.verifyResponseTime(response, 1000); // Max 1000ms
```

## Complete Examples

### CRUD Operations

```typescript
test.describe('User API', () => {
  let api: APIContext;
  let userId: number;

  test.beforeAll(async ({ request }) => {
    api = new APIContext(request, 'https://api.example.com');
    api.setAuthToken('test-token');
  });

  test('Create user', async () => {
    const response = await api.post('/users', {
      name: 'John Doe',
      email: 'john@example.com'
    });
    
    await api.verifyStatus(response, 201);
    
    const data = await api.getJSON(response);
    userId = data.id;
    expect(data).toHaveProperty('name', 'John Doe');
  });

  test('Read user', async () => {
    const response = await api.get(`/users/${userId}`);
    await api.verifyStatus(response, 200);
    
    const data = await api.getJSON(response);
    expect(data).toHaveProperty('id', userId);
  });

  test('Update user', async () => {
    const response = await api.put(`/users/${userId}`, {
      name: 'Jane Doe'
    });
    
    await api.verifyStatus(response, 200);
    
    const data = await api.getJSON(response);
    expect(data).toHaveProperty('name', 'Jane Doe');
  });

  test('Delete user', async () => {
    const response = await api.delete(`/users/${userId}`);
    await api.verifyStatus(response, 204);
  });
});
```

### Error Handling

```typescript
test('Handle 404 error', async ({ request }) => {
  const api = new APIContext(request, 'https://api.example.com');
  
  const response = await api.get('/users/999999');
  await api.verifyStatus(response, 404);
  
  const error = await api.getJSON(response);
  expect(error).toHaveProperty('message');
});

test('Handle validation error', async ({ request }) => {
  const api = new APIContext(request, 'https://api.example.com');
  
  const response = await api.post('/users', {
    // Missing required field
    email: 'invalid-email'
  });
  
  await api.verifyStatus(response, 422);
  
  const error = await api.getJSON(response);
  expect(error).toHaveProperty('errors');
});
```

### Authentication Flow

```typescript
test('Login and use token', async ({ request }) => {
  const api = new APIContext(request, 'https://api.example.com');
  
  // Login
  const loginResponse = await api.post('/auth/login', {
    username: 'user@example.com',
    password: 'password123'
  });
  
  await api.verifyStatus(loginResponse, 200);
  
  const { token } = await api.getJSON(loginResponse);
  
  // Set token for authenticated requests
  api.setAuthToken(token);
  
  // Make authenticated request
  const profileResponse = await api.get('/users/me');
  await api.verifyStatus(profileResponse, 200);
});
```

### Pagination

```typescript
test('Handle paginated results', async ({ request }) => {
  const api = new APIContext(request, 'https://api.example.com');
  
  let page = 1;
  let allUsers = [];
  
  while (true) {
    const response = await api.get('/users', {
      params: { page, limit: 10 }
    });
    
    const data = await api.getJSON(response);
    allUsers.push(...data.users);
    
    if (!data.hasMore) break;
    page++;
  }
  
  expect(allUsers.length).toBeGreaterThan(0);
});
```

### Parallel API Requests

```typescript
test('Execute parallel requests', async ({ request }) => {
  const api = new APIContext(request, 'https://api.example.com');
  
  // Execute multiple requests in parallel
  const [users, posts, comments] = await Promise.all([
    api.get('/users'),
    api.get('/posts'),
    api.get('/comments')
  ]);
  
  await api.verifyStatus(users, 200);
  await api.verifyStatus(posts, 200);
  await api.verifyStatus(comments, 200);
});
```

## Running API Tests

```bash
# Run all API tests
npm run test:api

# Run specific API test file
npx playwright test tests/api.spec.ts

# Run with specific browser (for hybrid tests)
npx playwright test tests/api.spec.ts --project=chromium
```

## Best Practices

1. **Use Base URL** - Initialize APIContext with base URL to avoid repetition
2. **Set Auth Once** - Use `setAuthToken()` or `setDefaultHeaders()` for all authenticated requests
3. **Verify Status First** - Always verify status code before checking response body
4. **Test Error Cases** - Include tests for error responses (4xx, 5xx)
5. **Use Type Safety** - Define TypeScript interfaces for request/response data
6. **Reuse Context** - Share APIContext instance across related tests
7. **Test Performance** - Use `verifyResponseTime()` for critical endpoints

## Integration with UI Tests

You can combine API and UI tests for powerful end-to-end scenarios:

```typescript
test('Create user via API and verify in UI', async ({ request, page }) => {
  // Create user via API
  const api = new APIContext(request, 'https://api.example.com');
  const response = await api.post('/users', {
    name: 'Test User',
    email: 'test@example.com'
  });
  
  const user = await api.getJSON(response);
  
  // Verify in UI
  await page.goto(`/users/${user.id}`);
  await expect(page.locator('h1')).toContainText('Test User');
});
```

## Troubleshooting

### CORS Issues

If you encounter CORS errors:
```typescript
// API tests don't have CORS restrictions
// Make requests directly without browser context
```

### SSL Certificate Issues

```typescript
// Ignore SSL errors (use only in test environments)
const response = await api.get('/users', {
  headers: { /* your headers */ }
});
```

### Rate Limiting

```typescript
// Add delays between requests
test('Handle rate limiting', async ({ request }) => {
  const api = new APIContext(request, 'https://api.example.com');
  
  for (let i = 0; i < 10; i++) {
    await api.get('/users');
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1s delay
  }
});
```
