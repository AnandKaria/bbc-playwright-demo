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

  test('News page accessible and has key content', async ({ page }) => {
    // Navigate to news
    await page.getByTestId('header-content').getByRole('link', { name: 'News', exact: true }).click();

    // Check page title
    await expect(page).toHaveTitle(/BBC News/);

    //Validate Discover banner
    await expect(page.getByText('Discover your BBCSign in or create an account to watch, listen and join inSign')).toBeVisible();
    await expect(page.getByTestId('sign-in-banner').getByRole('heading')).toContainText('Discover your BBC');

    // Validate Most Read section
    await expect(page.getByRole('heading', { name: 'Most read' })).toBeVisible();
  });

  test('Weather page accessible and has key content', async ({ page }) => {
    // Navigate to weather link
    await page.getByTestId('header-content').getByRole('link', { name: 'Weather' }).click();

    // Check page title
    await expect(page).toHaveTitle(/BBC Weather/);

    // Check page content
    await expect(page.getByRole('link', { name: 'BBC Weather' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'UK Summary' })).toBeVisible();

    // Search for and find Heathrow
    const w_search_header = page.getByTestId('weather-masthead');
    const w_search_textbox = w_search_header.getByPlaceholder('Enter a town, city or UK');
    await w_search_textbox.click();
    await w_search_textbox.fill('Heathrow');
    // await w_search_textbox.press('Enter');
    await w_search_header.getByRole('button', { name: 'Search', exact: true }).click();
    await expect(w_search_header.locator('#location-list')).toContainText('London Heathrow Airport, Greater London');
    await expect(w_search_header.getByRole('link', { name: 'London Heathrow Airport,' })).toBeVisible();
    await w_search_header.getByRole('link', { name: 'London Heathrow Airport,' }).click();
    
    // Validate weather page for Heathrow
    await expect(page.getByTestId('location').getByRole('heading', { name: 'London Heathrow Airport' })).toBeVisible();
    await expect(page.locator('#site-container')).toContainText('Observation Station: London/Heathrow Intl (Lat: 51.4833 | Long: -0.45)');
    await page.getByLabel('BBC-wide').getByRole('link', { name: 'Home', exact: true }).click();
  });
});