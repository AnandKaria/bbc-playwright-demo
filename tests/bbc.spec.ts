import { test, expect } from '@playwright/test';

test('has key sections for Discover and Most Read', async ({ page }) => {
  // Navigate to main page
  await page.goto('https://www.bbc.co.uk/');

  // Check cookie banner exists and reject non-essential
  await expect(page.getByLabel('Cookies on the BBC website')).toBeVisible();
  await page.getByTestId('reject-button').click();

  // Navigate to news
  await page.getByTestId('header-content').getByRole('link', { name: 'News' }).click();

  // Check page title
  await expect(page).toHaveTitle(/BBC News/);

  //Validate Discover banner
  await expect(page.getByText('Discover your BBCSign in or create an account to watch, listen and join inSign')).toBeVisible();
  await expect(page.getByTestId('sign-in-banner').getByRole('heading')).toContainText('Discover your BBC');

  // Validate Most Read section
  await expect(page.getByText('Most read1Briton, 18,')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Most read' })).toBeVisible();
});