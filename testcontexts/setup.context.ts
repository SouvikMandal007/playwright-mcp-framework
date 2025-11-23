import { Page, Browser, BrowserContext } from '@playwright/test';

/**
 * Setup context for test initialization and teardown
 * Provides reusable setup utilities for tests
 */
export class SetupContext {
  private page: Page;
  private context: BrowserContext;
  private readonly SCREENSHOTS_DIR = 'test-results/screenshots';

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
  }

  /**
   * Navigate to a URL with error handling
   */
  async navigateTo(url: string): Promise<void> {
    try {
      await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    } catch (error) {
      throw new Error(`Failed to navigate to ${url}: ${error}`);
    }
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Clear browser storage
   */
  async clearStorage(): Promise<void> {
    await this.context.clearCookies();
    try {
      await this.page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
    } catch (error) {
      // Storage might not be available on certain pages (like about:blank or data: URLs)
      // This is expected behavior, so we silently ignore the error
    }
  }

  /**
   * Set viewport size
   */
  async setViewport(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({ width, height });
  }

  /**
   * Take a screenshot with custom name
   */
  async takeScreenshot(name: string): Promise<Buffer> {
    return await this.page.screenshot({ 
      path: `${this.SCREENSHOTS_DIR}/${name}.png`,
      fullPage: true 
    });
  }

  /**
   * Get current page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get current URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Reload the page
   */
  async reloadPage(): Promise<void> {
    await this.page.reload({ waitUntil: 'domcontentloaded' });
  }
}
