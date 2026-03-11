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

// test.describe groups related tests together - like a test suite
test.describe('Login Page', () => {

  // test.beforeEach runs BEFORE every single test in this describe block
  // This ensures each test starts from a clean state (test isolation!)
  test.beforeEach(async ({ page }) => {
    // baseURL is set in playwright.config.ts, so '/' means 'https://www.saucedemo.com/'
    await page.goto('/');
  });

  // ============================================
  // POSITIVE TESTS - Things that SHOULD work
  // ============================================

  test('should login successfully with valid credentials', async ({ page }) => {
    // Fill in username field (using CSS ID selector)
    await page.fill('#user-name', users.users.standard.username);

    // Fill in password field
    await page.fill('#password', users.users.standard.password);

    // Click the login button
    await page.click('#login-button');

    // ASSERTION: After login, URL should contain 'inventory'
    // This proves we actually navigated away from the login page
    await expect(page).toHaveURL(/inventory/);

    // ASSERTION: The page title should show 'Products'
    // This proves the inventory page loaded correctly
    await expect(page.locator('.title')).toHaveText('Products');
  });

  // ============================================
  // NEGATIVE TESTS - Things that SHOULD fail gracefully
  // ============================================

  test('should show error for locked out user', async ({ page }) => {
    await page.fill('#user-name', users.users.locked_out.username);
    await page.fill('#password', users.users.locked_out.password);
    await page.click('#login-button');

    // ASSERTION: Error message should appear
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('locked out');
  });

  test('should show error for wrong password', async ({ page }) => {
    await page.fill('#user-name', users.invalid.wrong_password.username);
    await page.fill('#password', users.invalid.wrong_password.password);
    await page.click('#login-button');

    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Username and password do not match');
  });

  test('should show error when username is empty', async ({ page }) => {
    // Leave username empty, fill only password
    await page.fill('#password', users.invalid.empty_username.password);
    await page.click('#login-button');

    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Username is required');
  });

  test('should show error when password is empty', async ({ page }) => {
    // Fill username, leave password empty
    await page.fill('#user-name', users.invalid.empty_password.username);
    await page.click('#login-button');

    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Password is required');
  });

  // ============================================
  // UI STATE TESTS - Does the page behave correctly?
  // ============================================

  test('should clear error message when X button is clicked', async ({ page }) => {
    // First, trigger an error
    await page.click('#login-button');

    // Error should be visible
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();

    // Click the X button to dismiss the error
    await page.click('.error-button');

    // Error should be gone
    await expect(errorMessage).not.toBeVisible();
  });

  test('should have password field masked', async ({ page }) => {
    // The password field should have type="password" so characters are hidden
    const passwordField = page.locator('#password');
    await expect(passwordField).toHaveAttribute('type', 'password');
  });
});