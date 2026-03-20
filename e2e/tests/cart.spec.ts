import { test, expect } from '@playwright/test';
import { loginAsStandardUser } from '../helpers/auth.helper';
import users from '../fixtures/users.json';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Cart Page', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsStandardUser(page);
    });

    test('should successfully add item to cart', async ({ page }) => {
        const inventoryPage = new InventoryPage(page);
        const cartPage = new CartPage(page);
        await inventoryPage.expectBadgeDisabled();
        await inventoryPage.addToCart('Sauce Labs Backpack');
        await inventoryPage.addToCart('Sauce Labs Onesie');
        await inventoryPage.expectBadge('2');
        await inventoryPage.goToCart();
        await expect(page).toHaveURL(/cart/);
        await cartPage.expectTitle('Your Cart');
        await cartPage.expectProductCount(2);
        await cartPage.expectInventoryItem(0, 'Sauce Labs Backpack');
        await cartPage.expectInventoryItem(1, 'Sauce Labs Onesie');
    });

    test('should successfully remove item from the cart', async ({ page }) => {
        const inventoryPage = new InventoryPage(page);
        const cartPage = new CartPage(page);
        await inventoryPage.addToCart('Sauce Labs Backpack');
        await inventoryPage.addToCart('Sauce Labs Onesie');
        await inventoryPage.goToCart();
        await expect(page).toHaveURL(/cart/);
        await cartPage.expectTitle('Your Cart');
        await cartPage.expectProductCount(2);
        await cartPage.removeItem('Sauce Labs Backpack');
        await cartPage.expectProductCount(1);
    });

    test('should successfully complete user journey (inventory -> checkout)', async ({ page }) => {
        const inventoryPage = new InventoryPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);
        await inventoryPage.addToCart('Sauce Labs Backpack');
        await inventoryPage.goToCart();
        await expect(page).toHaveURL(/cart/);
        await cartPage.expectProductCount(1);
        await cartPage.checkout();
        await expect(page).toHaveURL(/checkout-step-one/);
        await checkoutPage.expectTitle('Checkout: Your Information');
        await checkoutPage.fillFirstName(users.users.standard.firstName);
        await checkoutPage.fillLastName(users.users.standard.lastName);
        await checkoutPage.fillPostalCode(users.users.standard.postalCode);
        await checkoutPage.continueCheckout();
        await expect(page).toHaveURL(/checkout-step-two/);
        await checkoutPage.expectTitle('Checkout: Overview');
        await checkoutPage.expectInventoryItem(0, 'Sauce Labs Backpack');
        await checkoutPage.expectPriceLabel();
        await checkoutPage.finishCheckout();
        await expect(page).toHaveURL(/checkout-complete/);
        await checkoutPage.expectCheckoutCompleteHeader();
        await checkoutPage.expectBackHomeButton();
    });

    test('should successfully return to inventory page after clicking continue shopping button', async ({ page }) => {
        const inventoryPage = new InventoryPage(page);
        const cartPage = new CartPage(page);
        await inventoryPage.addToCart('Sauce Labs Backpack');
        await inventoryPage.addToCart('Sauce Labs Onesie');
        await inventoryPage.goToCart();
        await expect(page).toHaveURL(/cart/);
        await cartPage.expectTitle('Your Cart');
        await cartPage.expectProductCount(2);
        await cartPage.continueShopping();
        await expect(page).toHaveURL(/inventory/);
    });

    test('should allow checkout with empty cart (known bug).', async ({ page }) => {
        const inventoryPage = new InventoryPage(page);
        const cartPage = new CartPage(page);
        await inventoryPage.goToCart();
        await expect(page).toHaveURL(/cart/);
        await cartPage.expectTitle('Your Cart');
        await expect(cartPage.inventoryItem).not.toBeVisible()
        await cartPage.checkout();
        await expect(page).toHaveURL(/checkout-step-one/); 
    });
});