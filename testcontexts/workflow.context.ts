import { Page, Locator, FrameLocator } from '@playwright/test';

/**
 * Workflow context for common UI interactions and workflows
 * Provides reusable workflow utilities
 */
export class WorkflowContext {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Fill a form with multiple fields
   */
  async fillForm(formData: Record<string, string>): Promise<void> {
    for (const [field, value] of Object.entries(formData)) {
      await this.page.fill(`[name="${field}"], [id="${field}"]`, value);
    }
  }

  /**
   * Submit a form
   */
  async submitForm(selector?: string): Promise<void> {
    if (selector) {
      await this.page.click(selector);
    } else {
      await this.page.click('button[type="submit"]');
    }
  }

  /**
   * Select dropdown option by value or text
   */
  async selectDropdown(selector: string, option: string): Promise<void> {
    await this.page.selectOption(selector, option);
  }

  /**
   * Check/uncheck checkbox
   */
  async toggleCheckbox(selector: string, checked: boolean): Promise<void> {
    const checkbox = this.page.locator(selector);
    const isChecked = await checkbox.isChecked();
    
    if (checked && !isChecked) {
      await checkbox.check();
    } else if (!checked && isChecked) {
      await checkbox.uncheck();
    }
  }

  /**
   * Upload a file
   */
  async uploadFile(selector: string, filePath: string): Promise<void> {
    await this.page.setInputFiles(selector, filePath);
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(selector: string, timeout?: number): Promise<Locator> {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible', timeout });
    return element;
  }

  /**
   * Wait for element to be hidden
   */
  async waitForElementToHide(selector: string, timeout?: number): Promise<void> {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Scroll to element
   */
  async scrollToElement(selector: string): Promise<void> {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  /**
   * Hover over element
   */
  async hoverElement(selector: string): Promise<void> {
    await this.page.hover(selector);
  }

  /**
   * Double click element
   */
  async doubleClickElement(selector: string): Promise<void> {
    await this.page.dblclick(selector);
  }

  /**
   * Right click element
   */
  async rightClickElement(selector: string): Promise<void> {
    await this.page.click(selector, { button: 'right' });
  }

  /**
   * Drag and drop
   */
  async dragAndDrop(sourceSelector: string, targetSelector: string): Promise<void> {
    await this.page.dragAndDrop(sourceSelector, targetSelector);
  }

  /**
   * Handle dialog/alert
   */
  async handleDialog(accept: boolean, promptText?: string): Promise<void> {
    this.page.once('dialog', async (dialog) => {
      if (accept) {
        await dialog.accept(promptText);
      } else {
        await dialog.dismiss();
      }
    });
  }

  /**
   * Switch to iframe and get frame locator
   */
  async getFrameLocator(selector: string) {
    return this.page.frameLocator(selector);
  }

  /**
   * Get element text
   */
  async getElementText(selector: string): Promise<string> {
    return await this.page.locator(selector).textContent() || '';
  }

  /**
   * Get element attribute
   */
  async getElementAttribute(selector: string, attribute: string): Promise<string | null> {
    return await this.page.locator(selector).getAttribute(attribute);
  }

  /**
   * Check if element exists
   */
  async elementExists(selector: string): Promise<boolean> {
    return await this.page.locator(selector).count() > 0;
  }

  /**
   * Wait for API response
   */
  async waitForAPIResponse(urlPattern: string | RegExp, timeout?: number): Promise<any> {
    const response = await this.page.waitForResponse(urlPattern, { timeout });
    return await response.json();
  }

  /**
   * Intercept and mock API request
   */
  async mockAPIRequest(urlPattern: string | RegExp, mockData: any): Promise<void> {
    await this.page.route(urlPattern, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockData),
      });
    });
  }
}
