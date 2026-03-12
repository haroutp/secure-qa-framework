import { test, expect } from '@playwright/test';
import users from '../fixtures/users.json';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Inventory Page', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);
        await loginPage.goto();
        await loginPage.loginAs(users.users.standard)

        // ASSERTION: After login, URL should contain 'inventory'
        // This proves we actually navigated away from the login page
        await expect(page).toHaveURL(/inventory/);

        // ASSERTION: The page title should show 'Products'
        // This proves the inventory page loaded correctly
        await inventoryPage.expectTitle('Products');
    });

    test('should verify inventory page displays exactly 6 products', async ({ page }) => {
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.expectProductCount(6);
    });

    test('should add item to cart and verify cart badge', async ({ page }) => {
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.expectBadgeDisabled();
        await inventoryPage.addToCart('Sauce Labs Backpack');
        await inventoryPage.expectBadge('1');
        await inventoryPage.addToCart('Sauce Labs Bolt T-Shirt');
        await inventoryPage.expectBadge('2');
    });

    test('should sort products by price low to high', async ({ page }) => {
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.sortBy('Price (low to high)');
        
        const firstItem = inventoryPage.inventoryItem.nth(0);
        const lastItem = inventoryPage.inventoryItemName.nth(5);
        await expect(firstItem).toContainText('Sauce Labs Onesie');
        await expect(inventoryPage.inventoryItemPrice.nth(0)).toHaveText('$7.99');
        await expect(lastItem).toContainText('Fleece Jack');
        await expect(inventoryPage.inventoryItemPrice.nth(5)).toHaveText('$49.99');
    });
});