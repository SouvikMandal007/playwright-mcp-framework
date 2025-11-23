import { test, expect } from '@playwright/test';
import { SetupContext, WorkflowContext } from '../testcontexts';

/**
 * Comprehensive example demonstrating all framework capabilities
 * This test shows how to use multiple contexts together
 */
test.describe('Complete Framework Demo', () => {
  let setupContext: SetupContext;
  let workflowContext: WorkflowContext;

  test.beforeEach(async ({ page, context }) => {
    setupContext = new SetupContext(page, context);
    workflowContext = new WorkflowContext(page);
  });

  test('should demonstrate complete framework workflow', async ({ page }) => {
    // Create a comprehensive test page
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Framework Demo</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; }
            h1 { color: #333; }
            form { margin: 20px 0; }
            input, select, button { margin: 10px 0; padding: 8px; width: 100%; }
            button { background: #007bff; color: white; border: none; cursor: pointer; }
            button:hover { background: #0056b3; }
            #result { margin-top: 20px; padding: 15px; background: #f0f0f0; display: none; }
            .success { color: green; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 id="title">Playwright Framework Demo</h1>
            <p>This page demonstrates various framework capabilities</p>
            
            <form id="demoForm">
              <input type="text" id="name" name="name" placeholder="Enter your name" required />
              <input type="email" id="email" name="email" placeholder="Enter your email" required />
              <select id="country" name="country">
                <option value="">Select Country</option>
                <option value="usa">USA</option>
                <option value="uk">UK</option>
                <option value="canada">Canada</option>
              </select>
              <label>
                <input type="checkbox" id="agree" name="agree" /> I agree to terms
              </label>
              <button type="submit">Submit Form</button>
            </form>
            
            <div id="result">
              <p class="success">Form submitted successfully!</p>
            </div>
          </div>
          
          <script>
            document.getElementById('demoForm').addEventListener('submit', function(e) {
              e.preventDefault();
              document.getElementById('result').style.display = 'block';
              localStorage.setItem('formSubmitted', 'true');
            });
          </script>
        </body>
      </html>
    `;

    // Step 1: Setup - Navigate and verify page
    await setupContext.navigateTo(`data:text/html,${encodeURIComponent(htmlContent)}`);
    await setupContext.waitForPageLoad();
    
    const title = await setupContext.getPageTitle();
    expect(title).toBe('Framework Demo');
    
    // Step 2: Verify elements exist
    const titleExists = await workflowContext.elementExists('#title');
    expect(titleExists).toBeTruthy();
    
    const formExists = await workflowContext.elementExists('#demoForm');
    expect(formExists).toBeTruthy();
    
    // Step 3: Get element text
    const heading = await workflowContext.getElementText('#title');
    expect(heading).toBe('Playwright Framework Demo');
    
    // Step 4: Set viewport
    await setupContext.setViewport(1920, 1080);
    
    // Step 5: Fill form using workflow context
    await workflowContext.fillForm({
      name: 'John Doe',
      email: 'john.doe@example.com'
    });
    
    // Step 6: Select dropdown
    await workflowContext.selectDropdown('#country', 'usa');
    
    // Step 7: Toggle checkbox
    await workflowContext.toggleCheckbox('#agree', true);
    
    // Step 8: Submit form
    await workflowContext.submitForm('button[type="submit"]');
    
    // Step 9: Wait for result to appear
    await workflowContext.waitForElement('#result', 5000);
    
    // Step 10: Verify result is visible
    const resultText = await workflowContext.getElementText('#result');
    expect(resultText).toContain('successfully');
    
    // Step 11: Scroll to result
    await workflowContext.scrollToElement('#result');
    
    // Step 12: Verify current URL
    const currentUrl = setupContext.getCurrentUrl();
    expect(currentUrl).toContain('data:text/html');
    
    // Step 13: Clear storage (cookies only for data URLs)
    await setupContext.clearStorage();
  });

  test('should demonstrate element interactions', async ({ page }) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head><title>Interactions Demo</title></head>
        <body>
          <h1 id="header">Hover and Click Demo</h1>
          <button id="clickMe" onclick="this.textContent='Clicked!'">Click Me</button>
          <div id="hoverTarget" onmouseover="this.style.background='yellow'">Hover Here</div>
          <p id="info">Information text</p>
        </body>
      </html>
    `;
    
    await page.goto(`data:text/html,${encodeURIComponent(htmlContent)}`);
    
    // Wait for elements
    await workflowContext.waitForElement('#header');
    
    // Hover over element
    await workflowContext.hoverElement('#hoverTarget');
    
    // Get attribute
    const buttonId = await workflowContext.getElementAttribute('#clickMe', 'id');
    expect(buttonId).toBe('clickMe');
    
    // Get text before click
    const beforeText = await workflowContext.getElementText('#clickMe');
    expect(beforeText).toBe('Click Me');
  });

  test('should handle page navigation and reload', async ({ page }) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head><title>Navigation Test</title></head>
        <body>
          <h1>Navigation Page</h1>
          <p id="timestamp"></p>
          <script>
            document.getElementById('timestamp').textContent = Date.now();
          </script>
        </body>
      </html>
    `;
    
    // Navigate to page
    await setupContext.navigateTo(`data:text/html,${encodeURIComponent(htmlContent)}`);
    
    // Get initial timestamp
    const timestamp1 = await workflowContext.getElementText('#timestamp');
    
    // Wait a moment
    await page.waitForTimeout(100);
    
    // Reload page
    await setupContext.reloadPage();
    
    // Get new timestamp (should be different after reload)
    const timestamp2 = await workflowContext.getElementText('#timestamp');
    
    // Timestamps should be different (page reloaded)
    expect(timestamp1).not.toBe(timestamp2);
  });
});
