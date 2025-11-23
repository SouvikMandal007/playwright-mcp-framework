import { test, expect } from '@playwright/test';
import { WorkflowContext } from '../testcontexts';

/**
 * Example test demonstrating workflow utilities
 * Tests form interactions and common UI workflows
 */
test.describe('Workflow Tests', () => {
  let workflowContext: WorkflowContext;

  test.beforeEach(async ({ page }) => {
    workflowContext = new WorkflowContext(page);
  });

  test('should interact with search functionality', async ({ page }) => {
    // Navigate to Playwright website
    await page.goto('https://playwright.dev');
    
    // Wait for search button
    const searchButton = await workflowContext.waitForElement('button.DocSearch', 10000);
    expect(searchButton).toBeTruthy();
  });

  test('should check element existence', async ({ page }) => {
    // Navigate to page
    await page.goto('https://playwright.dev');
    
    // Check if navigation exists
    const navExists = await workflowContext.elementExists('nav');
    expect(navExists).toBeTruthy();
    
    // Check if non-existent element doesn't exist
    const fakeExists = await workflowContext.elementExists('#non-existent-element-12345');
    expect(fakeExists).toBeFalsy();
  });

  test('should get element text', async ({ page }) => {
    // Navigate to page
    await page.goto('https://playwright.dev');
    
    // Wait for and get title text
    await workflowContext.waitForElement('h1, .hero__title');
    const titleText = await workflowContext.getElementText('h1, .hero__title');
    
    expect(titleText.length).toBeGreaterThan(0);
  });

  test('should scroll to element', async ({ page }) => {
    // Navigate to page with content
    await page.goto('https://playwright.dev/docs/intro');
    
    // Scroll to footer or bottom element
    const footerExists = await workflowContext.elementExists('footer, .footer');
    if (footerExists) {
      await workflowContext.scrollToElement('footer, .footer');
      
      // Verify we scrolled (page should not be at top)
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeGreaterThan(0);
    }
  });

  test('should hover over element', async ({ page }) => {
    // Navigate to page
    await page.goto('https://playwright.dev');
    
    // Wait for navigation element
    await workflowContext.waitForElement('nav');
    
    // Hover over a link
    const linkExists = await workflowContext.elementExists('nav a');
    if (linkExists) {
      await workflowContext.hoverElement('nav a');
      // Hover action completed successfully
      expect(true).toBeTruthy();
    }
  });

  test.skip('should fill and submit form', async ({ page }) => {
    // This test is skipped as it requires actual form page
    // Uncomment and adapt when you have a real form
    
    // await page.goto('https://your-app.com/contact');
    // 
    // await workflowContext.fillForm({
    //   name: 'John Doe',
    //   email: 'john@example.com',
    //   message: 'Test message'
    // });
    // 
    // await workflowContext.submitForm();
  });

  test.skip('should handle dropdown selection', async ({ page }) => {
    // This test is skipped as it requires actual dropdown
    // Uncomment and adapt when you have a real dropdown
    
    // await page.goto('https://your-app.com/form');
    // await workflowContext.selectDropdown('#country', 'USA');
  });
});
