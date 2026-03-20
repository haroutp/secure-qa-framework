import { test, expect } from '../fixtures/auth.fixtures'
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';

test.describe('Inventory Page', () => {
    test('should verify inventory page displays exactly 6 products', async ({ loggedInPage: page }) => {
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.expectProductCount(6);
    });

    test('should add item to cart and verify cart badge', async ({ loggedInPage: page }) => {
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.expectBadgeDisabled();
        await inventoryPage.addToCart('Sauce Labs Backpack');
        await inventoryPage.expectBadge('1');
        await inventoryPage.addToCart('Sauce Labs Bolt T-Shirt');
        await inventoryPage.expectBadge('2');
    });

    test('should remove item from inventory page', async ({ loggedInPage: page }) => {
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.expectAddItemButton('Sauce Labs Backpack');
        await inventoryPage.addToCart('Sauce Labs Backpack');
        await inventoryPage.expectRemoveButton('Sauce Labs Backpack');
        await inventoryPage.removeFromCart('Sauce Labs Backpack');
        await inventoryPage.expectAddItemButton('Sauce Labs Backpack');
    });

    test('should sort products by price low to high', async ({ loggedInPage: page }) => {
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.sortBy('Price (low to high)');
        const firstItem = inventoryPage.inventoryItem.nth(0);
        const lastItem = inventoryPage.inventoryItemName.nth(5);
        await expect(firstItem).toContainText('Sauce Labs Onesie');
        await expect(inventoryPage.inventoryItemPrice.nth(0)).toHaveText('$7.99');
        await expect(lastItem).toContainText('Fleece Jack');
        await expect(inventoryPage.inventoryItemPrice.nth(5)).toHaveText('$49.99');
    });

    test('should sort products by price high to low', async ({ loggedInPage: page}) => {
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.sortBy('Price (high to low)');
        const firstItem = inventoryPage.inventoryItem.nth(0);
        const lastItem = inventoryPage.inventoryItemName.nth(5);
        await expect(firstItem).toContainText('Fleece Jack');
        await expect(inventoryPage.inventoryItemPrice.nth(0)).toHaveText('$49.99');
        await expect(lastItem).toContainText('Sauce Labs Onesie');
        await expect(inventoryPage.inventoryItemPrice.nth(5)).toHaveText('$7.99');
    })
});