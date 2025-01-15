import { test, expect } from '@playwright/test';

test.beforeEach('Load home page, set cookie status', async ({ page }) => {
  // Navigate to main page
  await page.goto('https://www.bbc.co.uk/');

  // Check cookie banner exists, reject non-essential, check banner dismissed
  await expect(page.getByLabel('Cookies on the BBC website')).toBeVisible();
  await page.getByTestId('reject-button').click();
  await expect(page.getByLabel('Cookies on the BBC website')).not.toBeVisible();
});

const w_search_data = {
  term: 'Heathrow',
  list_entry: 'London Heathrow Airport, Greater London',
  link: 'London Heathrow Airport,',
  heading: 'London Heathrow Airport',
  obs_station: 'Observation Station: London/Heathrow Intl (Lat: 51.4833 | Long: -0.45)',
};

test.describe('Search for weather forecasts', () => {
  test('Weather page search returns results for ' + w_search_data.term, async ({ page }) => {
    // Navigate to weather link
    await page.getByTestId('header-content').getByRole('link', { name: 'Weather' }).click();

    // Check page title
    // await expect(page).toHaveTitle(/BBC Weather/);

    // Check page content
    await expect(page.getByRole('link', { name: 'BBC Weather' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'UK Summary' })).toBeVisible();

    // Search for and find Heathrow
    const w_search_header = page.getByTestId('weather-masthead');
    const w_search_textbox = w_search_header.getByPlaceholder('Enter a town, city or UK');
    await w_search_textbox.click();
    await w_search_textbox.fill(w_search_data.term);
    // await w_search_textbox.press('Enter');
    await w_search_header.getByRole('button', { name: 'Search', exact: true }).click();
    await expect(w_search_header.locator('#location-list')).toContainText(w_search_data.list_entry);
    await expect(w_search_header.getByRole('link', { name: w_search_data.link })).toBeVisible();
    await w_search_header.getByRole('link', { name: w_search_data.link }).click();
    
    // Validate weather page for Heathrow
    await expect(page.getByTestId('location').getByRole('heading', { name: w_search_data.heading })).toBeVisible();
    //FIXME: Needs more accurate locator
    await expect(page.locator('#site-container')).toContainText(w_search_data.obs_station);
  });
});