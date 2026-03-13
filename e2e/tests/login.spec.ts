/**
 * SauceDemo Login Tests
 *
 * These are your FIRST Playwright tests. Every line is commented
 * so you understand exactly what's happening and why.
 *
 * Run with: npx playwright test e2e/tests/login.spec.ts
 * Run headed (see browser): npx playwright test e2e/tests/login.spec.ts --headed
 */

import { test, expect } from '@playwright/test';
import users from '../fixtures/users.json';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

// test.describe groups related tests together - like a test suite
test.describe('Login Page', () => {
  // test.beforeEach runs BEFORE every single test in this describe block
  // This ensures each test starts from a clean state (test isolation!)
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    // baseURL is set in playwright.config.ts, so '/' means 'https://www.saucedemo.com/'
    await loginPage.goto();
  });

  // ============================================
  // POSITIVE TESTS - Things that SHOULD work
  // ============================================

  test('should login successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    await loginPage.loginAs(users.users.standard)

    // ASSERTION: After login, URL should contain 'inventory'
    // This proves we actually navigated away from the login page
    await expect(page).toHaveURL(/inventory/);

    // ASSERTION: The page title should show 'Products'
    // This proves the inventory page loaded correctly
    await inventoryPage.expectTitle('Products');
  });

  // ============================================
  // NEGATIVE TESTS - Things that SHOULD fail gracefully
  // ============================================

  test('should show error for locked out user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginAs(users.users.locked_out);

    // ASSERTION: Error message should appear
    await loginPage.expectError('locked out');
  });

  test('should successfully login as performance glitch user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    await loginPage.loginAs(users.users.performance_glitch);
    await expect(page).toHaveURL(/inventory/);
    await inventoryPage.expectTitle('Products');
  });

  test('should show error for wrong password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginAs(users.invalid.wrong_password);
    
    // ASSERTION: Error message should appear
    await loginPage.expectError('password do not match');
  });

  test('should show error when username is empty', async ({ page }) => {
    // Leave username empty, fill only password
    const loginPage = new LoginPage(page);
    await loginPage.passwordField.fill('secret_sauce');
    await loginPage.loginButton.click();

    // ASSERTION: Error message should appear
    await loginPage.expectError('Username is required');
  });

  test('should show error when password is empty', async ({ page }) => {
    // Fill username, leave password empty
    const loginPage = new LoginPage(page);
    await loginPage.usernameField.fill(users.users.standard.username);
    await loginPage.loginButton.click();

    // ASSERTION: Error message should appear
    await loginPage.expectError('Password is required');
  });

  // ============================================
  // UI STATE TESTS - Does the page behave correctly?
  // ============================================

  test('should clear error message when X button is clicked', async ({ page }) => {
    // First, trigger an error
    const loginPage = new LoginPage(page);
    await loginPage.loginButton.click();

    // Error should be visible
    await loginPage.expectError('Epic sadface:');

    // Click the X button to dismiss the error
    await loginPage.dismissError();

    // Error should be gone
    await loginPage.assertErrorDismissed();
  });

  test('should have password field masked', async ({ page }) => {
    // The password field should have type="password" so characters are hidden
    const loginPage = new LoginPage(page);
    await expect(loginPage.passwordField).toHaveAttribute('type', 'password');
  });
});