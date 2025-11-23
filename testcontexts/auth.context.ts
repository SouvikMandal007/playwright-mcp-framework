import { Page, BrowserContext } from '@playwright/test';

/**
 * Authentication context for handling login/logout workflows
 * Provides reusable authentication utilities
 */
export class AuthContext {
  private page: Page;
  private context: BrowserContext;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
  }

  /**
   * Perform login with username and password
   */
  async login(username: string, password: string, loginUrl?: string): Promise<void> {
    if (loginUrl) {
      await this.page.goto(loginUrl);
    }

    // Generic login - adapt selectors based on your application
    await this.page.fill('[name="username"], [id="username"], [type="email"]', username);
    await this.page.fill('[name="password"], [id="password"], [type="password"]', password);
    await this.page.click('button[type="submit"], button:has-text("Login"), button:has-text("Sign in")');
    
    // Wait for navigation after login
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Perform logout
   */
  async logout(logoutUrl?: string): Promise<void> {
    if (logoutUrl) {
      await this.page.goto(logoutUrl);
    } else {
      // Generic logout - adapt selectors based on your application
      await this.page.click('button:has-text("Logout"), a:has-text("Logout"), button:has-text("Sign out")');
    }
    
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      // Check for common authentication indicators
      const authToken = await this.page.evaluate(() => localStorage.getItem('authToken'));
      return !!authToken;
    } catch {
      return false;
    }
  }

  /**
   * Set authentication token directly (for API-based auth)
   */
  async setAuthToken(token: string): Promise<void> {
    await this.page.evaluate((tkn) => {
      localStorage.setItem('authToken', tkn);
    }, token);
  }

  /**
   * Get authentication token
   */
  async getAuthToken(): Promise<string | null> {
    return await this.page.evaluate(() => localStorage.getItem('authToken'));
  }

  /**
   * Save authentication state for reuse
   */
  async saveAuthState(path: string): Promise<void> {
    await this.context.storageState({ path });
  }

  /**
   * Login with OAuth/Social provider
   */
  async loginWithOAuth(provider: string, credentials: { username: string; password: string }): Promise<void> {
    // Click OAuth button
    await this.page.click(`button:has-text("${provider}"), a:has-text("${provider}")`);
    
    // Wait for OAuth popup or redirect
    const popup = await this.page.waitForEvent('popup', { timeout: 5000 }).catch(() => null);
    
    if (popup) {
      // Handle popup-based OAuth
      await popup.fill('[name="username"], [type="email"]', credentials.username);
      await popup.fill('[name="password"], [type="password"]', credentials.password);
      await popup.click('button[type="submit"]');
      await popup.waitForEvent('close');
    } else {
      // Handle redirect-based OAuth
      await this.page.fill('[name="username"], [type="email"]', credentials.username);
      await this.page.fill('[name="password"], [type="password"]', credentials.password);
      await this.page.click('button[type="submit"]');
      await this.page.waitForLoadState('networkidle');
    }
  }
}
