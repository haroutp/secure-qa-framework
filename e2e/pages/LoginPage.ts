import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  // The page instance
  readonly page: Page;

  // All selectors for this page — defined ONCE
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly errorButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameField = page.getByTestId('username');
    this.passwordField = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
    this.errorMessage = page.getByTestId('error');
    this.errorButton = page.getByTestId('error-button');
  }

  // Actions — things a user does on this page
  async goto() {
    await this.page.goto('/');
  }

  async loginAs(user: { username: string; password: string }) {
    await this.usernameField.fill(user.username);
    await this.passwordField.fill(user.password);
    await this.loginButton.click();
  }

  async dismissError() {
    await this.errorButton.click();
  }

  // Assertions — things you verify on this page
  async expectError(message: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(message);
  }

  async assertErrorDismissed() {
    await expect(this.errorButton).not.toBeVisible();
  }

}