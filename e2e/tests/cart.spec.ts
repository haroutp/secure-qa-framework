import { test, expect } from '@playwright/test';
import users from '../fixtures/users.json';

test.describe('Cart Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.getByTestId('username').fill(users.users.standard.username)
        await page.getByTestId('password').fill(users.users.standard.password)
        await page.getByTestId('login-button').click();
        await expect(page).toHaveURL(/inventory/);
        await expect(page.locator('.title')).toHaveText('Products');
    });

    test('should successfully add item to cart', async ({ page }) => {
        await page.getByTestId('inventory-item')
            .filter({ hasText: 'Sauce Labs Backpack'})
            .getByRole('button', {name: 'Add to cart'})
            .click();
        await page.getByTestId('inventory-item')
            .filter({ hasText: 'Sauce Labs Onesie'})
            .getByRole('button', {name: 'Add to cart'})
            .click()
        await page.getByTestId('shopping-cart-link').click();
        await expect(page).toHaveURL(/cart/);
        await expect(page.getByTestId('inventory-item')).toHaveCount(2);
        await expect(page.getByTestId('inventory-item-name').nth(0)).toHaveText('Sauce Labs Backpack');
        await expect(page.getByTestId('inventory-item-name').nth(1)).toHaveText('Sauce Labs Onesie');
    });

    test('should successfully remove an item from the cart', async ({ page }) => {
        await page.getByTestId('inventory-item')
            .filter({ hasText: 'Sauce Labs Backpack'})
            .getByRole('button', {name: 'Add to cart'})
            .click();
        await page.getByTestId('inventory-item')
            .filter({ hasText: 'Sauce Labs Onesie'})
            .getByRole('button', {name: 'Add to cart'})
            .click()
        await page.getByTestId('shopping-cart-link').click();
        await expect(page).toHaveURL(/cart/);
        await expect(page.getByTestId('inventory-item')).toHaveCount(2);
        await page.getByRole('button', { name: 'Remove'}).first().click();
        await expect(page.getByTestId('inventory-item')).toHaveCount(1);
        await expect(page.getByTestId('inventory-item-name')).toHaveText('Sauce Labs Onesie');
    });

    test('should successfully complete user journey from inventory to checkout', async ({ page }) => {
        const item = 'Sauce Labs Onesie'
        await page.getByTestId('inventory-item')
            .filter({ hasText: item})
            .getByRole('button', {name: 'Add to cart'})
            .click();
        await page.getByTestId('shopping-cart-link').click();
        await expect(page).toHaveURL(/cart/);
        await expect(page.getByTestId('inventory-item')).toHaveCount(1);
        await page.getByRole('button', { name: 'Checkout'}).click();
        await expect(page).toHaveURL(/checkout-step-one/);
        await expect(page.getByTestId('title')).toHaveText('Checkout: Your Information');
        await page.getByTestId('firstName').fill(users.users.standard.firstName);
        await page.getByTestId('lastName').fill(users.users.standard.lastName);
        await page.getByTestId('postalCode').fill(users.users.standard.postalCode);
        await page.getByTestId('continue').click()
        await expect(page).toHaveURL(/checkout-step-two/);
        await expect(page.getByTestId('inventory-item-name')).toHaveText(item);
        await expect(page.getByTestId('total-label')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Finish' })).toBeVisible();
        await page.getByRole('button', { name: 'Finish' }).click();
        await expect(page).toHaveURL(/checkout-complete/);
        await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Back Home'})).toBeVisible();
    });

    test('should show error when first name is empty in checkout information', async ({ page }) => {
        const item = 'Sauce Labs Onesie'
        await page.getByTestId('inventory-item')
            .filter({ hasText: item})
            .getByRole('button', {name: 'Add to cart'})
            .click();
        await page.getByTestId('shopping-cart-link').click();
        await expect(page).toHaveURL(/cart/);
        await expect(page.getByTestId('inventory-item')).toHaveCount(1);
        await page.getByRole('button', { name: 'Checkout'}).click();
        await expect(page).toHaveURL(/checkout-step-one/);
        await expect(page.getByTestId('title')).toHaveText('Checkout: Your Information');
        await page.getByTestId('lastName').fill(users.users.standard.lastName);
        await page.getByTestId('postalCode').fill(users.users.standard.postalCode);
        await page.getByTestId('continue').click();
        // await expect(page.getByRole('heading', { name: "Error: First Name is required" })).toBeVisible(); // works but wanted to try the other way too.
        await expect(page.getByTestId('error')).toBeVisible();
        await expect(page.getByTestId('error')).toHaveText("Error: First Name is required");
    });

    test('should successfully allow to continue shopping by returning to inventory page', async ({ page }) => {
        const item = 'Sauce Labs Onesie'
        await page.getByTestId('inventory-item')
            .filter({ hasText: item})
            .getByRole('button', {name: 'Add to cart'})
            .click();
        await page.getByTestId('shopping-cart-link').click();
        await expect(page).toHaveURL(/cart/);
        await expect(page.getByTestId('inventory-item')).toHaveCount(1);
        await expect(page.getByRole('button', { name: 'Continue Shopping'})).toBeVisible();
        await page.getByRole('button', { name: 'Continue Shopping'}).click();
        await expect(page).toHaveURL(/inventory/);
    });
});