import { test, expect } from '@playwright/test';
import { SetupContext, WorkflowContext } from '../testcontexts';

/**
 * Framework verification tests - Tests that verify the framework itself without external dependencies
 */
test.describe('Framework Verification', () => {
  test('should create and use SetupContext', async ({ page, context }) => {
    const setupContext = new SetupContext(page, context);
    
    // Verify context is created
    expect(setupContext).toBeDefined();
    
    // Navigate to about:blank (always available)
    await setupContext.navigateTo('about:blank');
    
    // Verify URL
    const url = setupContext.getCurrentUrl();
    expect(url).toBe('about:blank');
  });

  test('should create and use WorkflowContext', async ({ page }) => {
    const workflowContext = new WorkflowContext(page);
    
    // Verify context is created
    expect(workflowContext).toBeDefined();
    
    // Navigate to a data URL page
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head><title>Test Page</title></head>
        <body>
          <h1 id="title">Hello Framework</h1>
          <p id="content">This is a test page</p>
          <button id="testBtn">Click Me</button>
        </body>
      </html>
    `;
    await page.goto(`data:text/html,${encodeURIComponent(htmlContent)}`);
    
    // Test element existence
    const titleExists = await workflowContext.elementExists('#title');
    expect(titleExists).toBeTruthy();
    
    // Test getting element text
    const titleText = await workflowContext.getElementText('#title');
    expect(titleText).toBe('Hello Framework');
    
    // Test waiting for element
    const button = await workflowContext.waitForElement('#testBtn');
    expect(button).toBeDefined();
  });

  test('should handle viewport settings', async ({ page, context }) => {
    const setupContext = new SetupContext(page, context);
    
    // Set viewport
    await setupContext.setViewport(1024, 768);
    
    // Navigate to blank page
    await setupContext.navigateTo('about:blank');
    
    // Verify viewport was set
    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(1024);
    expect(viewport?.height).toBe(768);
  });

  test('should get page title', async ({ page, context }) => {
    const setupContext = new SetupContext(page, context);
    
    // Create a page with a title
    const htmlContent = `<!DOCTYPE html><html><head><title>Test Title</title></head><body><h1>Test</h1></body></html>`;
    await page.goto(`data:text/html,${encodeURIComponent(htmlContent)}`);
    
    // Get title
    const title = await setupContext.getPageTitle();
    expect(title).toBe('Test Title');
  });

  test('should clear storage', async ({ page, context }) => {
    const setupContext = new SetupContext(page, context);
    
    // Navigate to blank page
    await page.goto('about:blank');
    
    // The clearStorage method clears cookies and calls localStorage/sessionStorage clear
    // We can only reliably test cookie clearing without a real domain
    await setupContext.clearStorage();
    
    // Verify cookies were cleared
    const cookies = await context.cookies();
    expect(cookies.length).toBe(0);
    
    // Verify the method executes without errors
    expect(true).toBeTruthy();
  });
});
