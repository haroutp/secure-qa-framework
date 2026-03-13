import { Page, Locator, expect } from '@playwright/test';

export class InventoryPage {
  // The page instance
  readonly page: Page;

  // All selectors for this page — defined ONCE
  readonly pageTitle: Locator;
  readonly inventoryItem: Locator;
  readonly inventoryItemName: Locator;
  readonly inventoryItemPrice: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly filterButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByTestId('title');
    this.inventoryItem = page.getByTestId('inventory-item');
    this.inventoryItemName = page.getByTestId('inventory-item-name');
    this.inventoryItemPrice = page.getByTestId('inventory-item-price');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.filterButton = page.getByTestId('product-sort-container');
  }

  // Actions — things a user does on this page
  async goToCart() {
    await this.cartLink.click();
  }

  async addToCart(productName: string) {
    await this.inventoryItem
                .filter({ hasText: productName})
                .getByRole('button', { name: 'Add to cart' })
                .click()
  }

  async sortBy(option: string) {
    await this.filterButton.selectOption(option);
  }

  // Assertions — things you verify on this page
  async expectTitle(text: string) {
    await expect(this.pageTitle).toHaveText(text);
  }

  async expectProductCount(count: number) {
    await expect(this.inventoryItem).toHaveCount(count);
  }

  async expectBadgeDisabled() {
    await expect(this.cartBadge).not.toBeVisible();
  }

  async expectBadge(count: string) {
    await expect(this.cartBadge).toBeVisible();
    await expect(this.cartBadge).toHaveText(count);
  }
}