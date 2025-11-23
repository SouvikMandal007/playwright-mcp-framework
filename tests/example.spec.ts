import { test, expect, Page, BrowserContext } from '@playwright/test';
import { SetupContext, AuthContext, WorkflowContext } from '../testcontexts';

/**
 * Example test demonstrating basic UI testing with the framework
 * Tests navigation and page load functionality
 */
test.describe('Example UI Tests', () => {
  let setupContext: SetupContext;
  let workflowContext: WorkflowContext;

  test.beforeEach(async ({ page, context }) => {
    // Initialize contexts
    setupContext = new SetupContext(page, context);
    workflowContext = new WorkflowContext(page);
  });

  test('should navigate to Playwright website and verify title', async ({ page }) => {
    // Navigate to Playwright website
    await setupContext.navigateTo('https://playwright.dev');
    
    // Wait for page to load
    await setupContext.waitForPageLoad();
    
    // Verify page title
    const title = await setupContext.getPageTitle();
    expect(title).toContain('Playwright');
  });

  test('should check Playwright website header elements', async ({ page }) => {
    // Navigate to page
    await setupContext.navigateTo('https://playwright.dev');
    
    // Wait for header to be visible
    await workflowContext.waitForElement('nav', 10000);
    
    // Verify logo exists
    const logoExists = await workflowContext.elementExists('a.navbar__brand');
    expect(logoExists).toBeTruthy();
  });

  test('should navigate to docs and verify content', async ({ page }) => {
    // Navigate to Playwright docs
    await setupContext.navigateTo('https://playwright.dev/docs/intro');
    
    // Wait for page load
    await setupContext.waitForPageLoad();
    
    // Verify URL contains 'docs'
    const currentUrl = setupContext.getCurrentUrl();
    expect(currentUrl).toContain('docs');
    
    // Verify main content exists
    const contentExists = await workflowContext.elementExists('article, main');
    expect(contentExists).toBeTruthy();
  });

  test('should handle viewport changes', async ({ page }) => {
    // Set custom viewport
    await setupContext.setViewport(1920, 1080);
    
    // Navigate to page
    await setupContext.navigateTo('https://playwright.dev');
    
    // Verify navigation was successful
    const currentUrl = setupContext.getCurrentUrl();
    expect(currentUrl).toBe('https://playwright.dev/');
  });

  test('should reload page successfully', async ({ page }) => {
    // Navigate to page
    await setupContext.navigateTo('https://playwright.dev');
    
    // Get initial title
    const initialTitle = await setupContext.getPageTitle();
    
    // Reload page
    await setupContext.reloadPage();
    
    // Verify title is still the same
    const newTitle = await setupContext.getPageTitle();
    expect(newTitle).toBe(initialTitle);
  });
});
