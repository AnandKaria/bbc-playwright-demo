import { test, expect } from '@playwright/test';

test.beforeEach('Load home page, set cookie status', async ({ page }) => {
  // Navigate to main page
  await page.goto('https://www.bbc.co.uk/');

  // Check cookie banner exists, reject non-essential, check banner dismissed
  await expect(page.getByLabel('Cookies on the BBC website')).toBeVisible();
  await page.getByTestId('reject-button').click();
  await expect(page.getByLabel('Cookies on the BBC website')).not.toBeVisible();
});

test.describe('Open BBC frontpages', () => {
  test('Homepage link works', async ({ page }) => {
    // Navigate to home
    await page.getByTestId('header-content').getByRole('link', { name: 'Home', exact: true }).click();
  });

  test('News page accessible and has key content', async ({ page, browserName }) => {
    // Navigate to news
    await page.getByTestId('header-content').getByRole('link', { name: 'News', exact: true }).click();

    // Check page title
    await expect(page).toHaveTitle(/BBC News/);

    //Validate Discover banner
    await expect(page.getByText('Discover your BBCSign in or create an account to watch, listen and join inSign')).toBeVisible();
    await expect(page.getByTestId('sign-in-banner').getByRole('heading')).toContainText('Discover your BBC');

    // Validate Most Read section
    await expect(page.getByRole('heading', { name: 'Most read' })).toBeVisible();

    // Capture screenshot
    await page.screenshot({ path: `test-results-media/news-${browserName}.png` });
  });

  test('Weather page accessible and has key content', async ({ page }) => {
    // Navigate to weather link
    await page.getByTestId('header-content').getByRole('link', { name: 'Weather' }).click();

    // Check page title
    await expect(page).toHaveTitle(/BBC Weather/, { timeout: 10000 }); // timeout adjusted for slow app

    // Check page content
    await expect(page.getByRole('link', { name: 'BBC Weather' })).toBeVisible({ timeout: 10000 }); // timeout adjusted for slow app
    await expect(page.getByRole('heading', { name: 'UK Summary' })).toBeVisible();
  });
});