import { test, expect } from '@playwright/test';
import { APIContext } from '../testcontexts';

/**
 * API testing examples using Playwright's request context
 * Demonstrates RESTful API testing capabilities
 */
test.describe('API Tests', () => {
  let apiContext: APIContext;

  test.beforeAll(async ({ request }) => {
    // Initialize API context with base URL
    apiContext = new APIContext(request, 'https://jsonplaceholder.typicode.com');
  });

  test('should make GET request and verify response', async () => {
    // Make GET request
    const response = await apiContext.get('/posts/1');
    
    // Verify status code
    await apiContext.verifyStatus(response, 200);
    
    // Get and verify response body
    const body = await apiContext.getJSON(response);
    expect(body).toHaveProperty('id', 1);
    expect(body).toHaveProperty('userId');
    expect(body).toHaveProperty('title');
    expect(body).toHaveProperty('body');
  });

  test('should make POST request and create resource', async () => {
    // Create new post
    const newPost = {
      title: 'Test Post',
      body: 'This is a test post body',
      userId: 1,
    };
    
    const response = await apiContext.post('/posts', newPost);
    
    // Verify status code
    await apiContext.verifyStatus(response, 201);
    
    // Verify response contains created data
    const body = await apiContext.getJSON(response);
    expect(body).toHaveProperty('title', newPost.title);
    expect(body).toHaveProperty('body', newPost.body);
    expect(body).toHaveProperty('userId', newPost.userId);
    expect(body).toHaveProperty('id');
  });

  test('should make PUT request and update resource', async () => {
    // Update existing post
    const updatedPost = {
      id: 1,
      title: 'Updated Post Title',
      body: 'Updated post body',
      userId: 1,
    };
    
    const response = await apiContext.put('/posts/1', updatedPost);
    
    // Verify status code
    await apiContext.verifyStatus(response, 200);
    
    // Verify response contains updated data
    const body = await apiContext.getJSON(response);
    expect(body).toHaveProperty('title', updatedPost.title);
    expect(body).toHaveProperty('body', updatedPost.body);
  });

  test('should make PATCH request and partially update resource', async () => {
    // Partially update post
    const partialUpdate = {
      title: 'Partially Updated Title',
    };
    
    const response = await apiContext.patch('/posts/1', partialUpdate);
    
    // Verify status code
    await apiContext.verifyStatus(response, 200);
    
    // Verify response contains updated title
    const body = await apiContext.getJSON(response);
    expect(body).toHaveProperty('title', partialUpdate.title);
  });

  test('should make DELETE request and remove resource', async () => {
    // Delete post
    const response = await apiContext.delete('/posts/1');
    
    // Verify status code
    await apiContext.verifyStatus(response, 200);
  });

  test('should handle query parameters', async () => {
    // Get posts with query parameters
    const response = await apiContext.get('/posts', {
      params: { userId: 1 },
    });
    
    await apiContext.verifyStatus(response, 200);
    
    const body = await apiContext.getJSON(response);
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
    
    // Verify all posts belong to userId 1
    body.forEach((post: any) => {
      expect(post.userId).toBe(1);
    });
  });

  test('should handle custom headers', async () => {
    // Make request with custom headers
    const response = await apiContext.get('/posts/1', {
      headers: {
        'X-Custom-Header': 'test-value',
      },
    });
    
    await apiContext.verifyStatus(response, 200);
  });

  test('should verify response headers', async () => {
    const response = await apiContext.get('/posts/1');
    
    // Verify content-type header
    apiContext.verifyHeader(response, 'content-type', 'application/json; charset=utf-8');
  });

  test('should use authentication token', async () => {
    // Set auth token
    apiContext.setAuthToken('mock-token-12345');
    
    // Make authenticated request
    const response = await apiContext.get('/posts/1');
    
    await apiContext.verifyStatus(response, 200);
  });

  test('should verify nested response data', async () => {
    const response = await apiContext.get('/users/1');
    
    await apiContext.verifyStatus(response, 200);
    
    const body = await apiContext.getJSON(response);
    expect(body).toHaveProperty('id', 1);
    expect(body).toHaveProperty('name');
    expect(body).toHaveProperty('email');
    expect(body).toHaveProperty('address');
    expect(body.address).toHaveProperty('city');
    expect(body.address).toHaveProperty('zipcode');
  });

  test('should handle 404 error', async () => {
    const response = await apiContext.get('/posts/999999');
    
    // Verify 404 status
    await apiContext.verifyStatus(response, 404);
  });

  test('should get multiple resources', async () => {
    const response = await apiContext.get('/posts');
    
    await apiContext.verifyStatus(response, 200);
    
    const body = await apiContext.getJSON(response);
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
  });
});
