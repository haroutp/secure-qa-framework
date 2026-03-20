import { test, expect } from '@playwright/test';
import { loginAsStandardUser } from '../helpers/auth.helper';
import users from '../fixtures/users.json';
import { Page } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Checkout Page', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsStandardUser(page);
    });

    test('should show error when first name in checkout information is empty ', async ({ page }) => {
        const checkoutPage = new CheckoutPage(page);
        const inventoryPage = new InventoryPage(page);
        const cartPage = new CartPage(page);
        await navigateToCheckout(page, inventoryPage, cartPage);
        await checkoutPage.fillLastName(users.users.standard.lastName);
        await checkoutPage.fillPostalCode(users.users.standard.postalCode);
        await checkoutPage.continueCheckout();
        await expect(checkoutPage.error).toBeVisible();
        await expect(checkoutPage.error).toContainText('First Name is required');
    });
    
    test('should show error when last name in checkout information is empty', async ({ page }) => {
        const checkoutPage = new CheckoutPage(page);
        const inventoryPage = new InventoryPage(page);
        const cartPage = new CartPage(page);
        await navigateToCheckout(page, inventoryPage, cartPage);
        await checkoutPage.fillFirstName(users.users.standard.firstName);
        await checkoutPage.fillPostalCode(users.users.standard.postalCode);   
        await checkoutPage.continueCheckout();
        await expect(checkoutPage.error).toBeVisible();
        await expect(checkoutPage.error).toContainText('Last Name is required');
    });
    
    test('should show error when postal code in checkout information is empty', async ({ page }) => {
        const checkoutPage = new CheckoutPage(page);
        const inventoryPage = new InventoryPage(page);
        const cartPage = new CartPage(page);
        await navigateToCheckout(page, inventoryPage, cartPage);
        await checkoutPage.fillFirstName(users.users.standard.firstName);
        await checkoutPage.fillLastName(users.users.standard.lastName);
        await checkoutPage.continueCheckout();
        await expect(checkoutPage.error).toBeVisible();
        await expect(checkoutPage.error).toContainText('Postal Code is required');
    });

    test('should successfully cancel checkout process and return to cart page', async ({ page }) => {
        const inventoryPage = new InventoryPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);
        await inventoryPage.addToCart('Sauce Labs Backpack');
        await inventoryPage.goToCart();
        await expect(page).toHaveURL(/cart/);
        await cartPage.expectTitle('Your Cart');
        await cartPage.checkout();
        await expect(page).toHaveURL(/checkout/);
        await checkoutPage.cancelCheckout();
        await expect(page).toHaveURL(/cart/);
    });
    
    async function navigateToCheckout(page: Page, inventoryPage: InventoryPage, cartPage: CartPage) {
        await inventoryPage.addToCart('Sauce Labs Backpack');
        await inventoryPage.goToCart();
        await expect(page).toHaveURL(/cart/);
        await cartPage.checkout();
        await expect(page).toHaveURL(/checkout-step-one/);
    }
});