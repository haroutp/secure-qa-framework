import { test, expect } from '@playwright/test';
import users from '../fixtures/users.json';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Cart Page', () => {
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

    test('should successfully remove an item from the cart', async ({ page }) => {
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

    test('should successfully complete user journey from inventory to checkout', async ({ page }) => {
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
        await checkoutPage.fillFirstName(users.users.standard.username);
        await checkoutPage.fillLastName(users.users.standard.lastName);
        await checkoutPage.fillPostalCode(users.users.standard.postalCode);
        // await checkoutPage.fillCheckoutInformation(users.users.standard);
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

    test('should show error when first name is empty in checkout information', async ({ page }) => {
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
        await checkoutPage.fillLastName(users.users.standard.lastName);
        await checkoutPage.fillPostalCode(users.users.standard.postalCode);
        // await checkoutPage.fillCheckoutInformation(users.users.standard);
        await checkoutPage.continueCheckout();
        await checkoutPage.error.isVisible();
    });

    test('should successfully allow to continue shopping by returning to inventory page', async ({ page }) => {
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
        await cartPage.continueShopping();
        await expect(page).toHaveURL(/inventory/); 
    });
});