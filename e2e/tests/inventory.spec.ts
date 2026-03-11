import { test, expect } from '@playwright/test';
import users from '../fixtures/users.json';

test.describe('Inventory Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.fill('#user-name', users.users.standard.username);
        await page.fill('#password', users.users.standard.password);
        await page.click('#login-button');
        await expect(page).toHaveURL(/inventory/);
        await expect(page.locator('.title')).toHaveText('Products');
    });

    test('should verify inventory page displays exactly 6 products', async ({ page }) => {
        const locator = page.getByTestId('inventory-item');
        await expect(locator).toHaveCount(6);
    });

    test('should add item to cart and verify cart badge', async ({ page }) => {
        const locator = page.getByTestId('shopping-cart-badge');
        // await expect(locator).toBeHidden();
        await expect(locator).not.toBeVisible();
        await page.getByTestId('inventory-item')
            .filter({ hasText: 'Sauce Labs Backpack'})
            .getByRole('button', {name: 'Add to cart'})
            .click()
        await expect(locator).toBeVisible();
        await expect(locator).toHaveText('1');
        await page.getByTestId('inventory-item')
            .filter({ hasText: 'Sauce Labs Bolt T-Shirt'})
            .getByRole('button', {name: 'Add to cart'})
            .click()
        await expect(locator).toHaveText('2');
    });

    test('should sort products by price low to high', async ({ page }) => {
        // await page.getByTestId('product-sort-container').selectOption({value: 'lohi'});
        await page.getByTestId('product-sort-container').selectOption('Price (low to high)');
        const locator = page.getByTestId('inventory-item-name').nth(0);
        await expect(locator).toContainText('Sauce Labs Onesie');
        await expect(page.getByTestId('inventory-item-price').nth(0)).toHaveText('$7.99');
        await expect(page.getByTestId('inventory-item-name').nth(5)).toContainText('Fleece Jack');
        await expect(page.getByTestId('inventory-item-price').nth(5)).toHaveText('$49.99');
    });
});