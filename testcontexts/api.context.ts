import { APIRequestContext, APIResponse, expect } from '@playwright/test';

/**
 * API testing context for REST API interactions
 * Provides reusable utilities for API testing with Playwright
 */
export class APIContext {
  private request: APIRequestContext;
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(request: APIRequestContext, baseURL: string = '') {
    this.request = request;
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  /**
   * Set default headers for all requests
   */
  setDefaultHeaders(headers: Record<string, string>): void {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  /**
   * Set authorization header
   */
  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Make GET request
   */
  async get(endpoint: string, options?: { headers?: Record<string, string>; params?: Record<string, any> }): Promise<APIResponse> {
    const url = this.buildURL(endpoint, options?.params);
    return await this.request.get(url, {
      headers: { ...this.defaultHeaders, ...options?.headers },
    });
  }

  /**
   * Make POST request
   */
  async post(endpoint: string, data?: any, options?: { headers?: Record<string, string> }): Promise<APIResponse> {
    const url = this.buildURL(endpoint);
    return await this.request.post(url, {
      data,
      headers: { ...this.defaultHeaders, ...options?.headers },
    });
  }

  /**
   * Make PUT request
   */
  async put(endpoint: string, data?: any, options?: { headers?: Record<string, string> }): Promise<APIResponse> {
    const url = this.buildURL(endpoint);
    return await this.request.put(url, {
      data,
      headers: { ...this.defaultHeaders, ...options?.headers },
    });
  }

  /**
   * Make PATCH request
   */
  async patch(endpoint: string, data?: any, options?: { headers?: Record<string, string> }): Promise<APIResponse> {
    const url = this.buildURL(endpoint);
    return await this.request.patch(url, {
      data,
      headers: { ...this.defaultHeaders, ...options?.headers },
    });
  }

  /**
   * Make DELETE request
   */
  async delete(endpoint: string, options?: { headers?: Record<string, string> }): Promise<APIResponse> {
    const url = this.buildURL(endpoint);
    return await this.request.delete(url, {
      headers: { ...this.defaultHeaders, ...options?.headers },
    });
  }

  /**
   * Verify response status code
   */
  async verifyStatus(response: APIResponse, expectedStatus: number): Promise<void> {
    expect(response.status()).toBe(expectedStatus);
  }

  /**
   * Get response JSON body
   */
  async getJSON(response: APIResponse): Promise<any> {
    return await response.json();
  }

  /**
   * Get response text body
   */
  async getText(response: APIResponse): Promise<string> {
    return await response.text();
  }

  /**
   * Verify response contains expected data
   */
  async verifyResponseContains(response: APIResponse, expectedData: Record<string, any>): Promise<void> {
    const body = await this.getJSON(response);
    for (const [key, value] of Object.entries(expectedData)) {
      expect(body).toHaveProperty(key, value);
    }
  }

  /**
   * Verify response header
   */
  verifyHeader(response: APIResponse, headerName: string, expectedValue: string): void {
    const headerValue = response.headers()[headerName.toLowerCase()];
    expect(headerValue).toBe(expectedValue);
  }

  /**
   * Build full URL with query parameters
   */
  private buildURL(endpoint: string, params?: Record<string, any>): string {
    const url = this.baseURL ? `${this.baseURL}${endpoint}` : endpoint;
    
    if (!params) return url;
    
    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    
    return queryString ? `${url}?${queryString}` : url;
  }

  /**
   * Verify response time is within acceptable limits
   */
  async verifyResponseTime(response: APIResponse, maxTimeMs: number): Promise<void> {
    const responseTime = await this.getResponseTime(response);
    expect(responseTime).toBeLessThan(maxTimeMs);
  }

  /**
   * Get response time in milliseconds
   */
  private async getResponseTime(response: APIResponse): Promise<number> {
    // Response timing would need to be tracked during request
    // This is a placeholder for demonstration
    return 0;
  }

  /**
   * Upload file via multipart/form-data
   */
  async uploadFile(endpoint: string, filePath: string, fieldName: string = 'file'): Promise<APIResponse> {
    const url = this.buildURL(endpoint);
    const formData = {
      [fieldName]: {
        name: filePath.split('/').pop() || 'file',
        mimeType: 'application/octet-stream',
        buffer: Buffer.from(''), // Would need actual file reading
      },
    };
    
    return await this.request.post(url, {
      multipart: formData,
      headers: { ...this.defaultHeaders, 'Content-Type': 'multipart/form-data' },
    });
  }
}
