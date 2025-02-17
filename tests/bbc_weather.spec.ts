import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { test, expect, type Page } from '@playwright/test';

test.beforeEach('Load home page, reject cookies, click Weather link', async ({ page }) => {
  // Navigate to main page
  await page.goto('https://www.bbc.co.uk/');

  // Check cookie banner exists, reject non-essential, check banner dismissed
  await expect(page.getByLabel('Cookies on the BBC website')).toBeVisible();
  await page.getByTestId('reject-button').click();
  await expect(page.getByLabel('Cookies on the BBC website')).not.toBeVisible();

  // Navigate to weather link
  await page.getByTestId('header-content').getByRole('link', { name: 'Weather' }).click();
});


test.describe('Search for weather forecasts - exact match', () => {
  // Test data reference
    // Data imported from ./datasets/weather_full_search.csv
    // - term: term to be searched in masthead search bar
    // - list_entry: an expected entry in the search results
    // - heading: the page heading on loading that result
    // - obs_station: the observation station data for that location in the details section

  const test_dataset = parse(fs.readFileSync(path.join(__dirname, 'datasets', 'weather_full_search.csv')), {
    columns: true,
    skip_empty_lines: true
  });

  for (const record of test_dataset) {
    test('Weather page search returns results for ' + record.term, async ({ page }) => {
      // Search for term and get locators
      const masthead = await input_search_term(page, record.term);

      // Navigate into link
      await masthead.getByRole('button', { name: 'Search', exact: true }).click();
      await expect(masthead.locator('#location-list').getByRole('link', { name: record.list_entry })).toBeVisible();
      await masthead.getByRole('link', { name: record.list_entry }).click();
      
      // Validate weather page for location
      await expect(page.getByTestId('location').getByRole('heading', { name: record.heading })).toBeVisible();
      await expect(page.locator('.wr-c-observations__details')).toContainText(record.obs_station);
    });
  }

});

test.describe('Search for weather forecasts - partial match', () => {
  // Set test data
  // - term: term to be searched in masthead search bar
  // - list_entry: an expected entry in the search results
  // - heading: the page heading on loading that result
  // - obs_station: the observation station data for that location in the details section
  [
    {
      term: 'Hilling',
      list_entry: 'Hillington, Norfolk',
      heading: 'Hillington',
      obs_station: 'Observation Station: Houghton Hall (Lat: 52.8167 | Long: 0.65)',
    },
    {
      term: 'Edin',
      list_entry: 'Edinburgh, Edinburgh',
      heading: 'Edinburgh',
      obs_station: 'Observation Station: Edinburgh/Royal Botanic Garden (Lat: 55.9667 | Long: -3.2167)',
    },
  ].forEach(({term, list_entry, heading, obs_station}) => {
    test('Weather page search returns results for ' + term, async ({ page }) => {
      // Search for term and get locators
      const masthead = await input_search_term(page, term);

      // Check autocomplete and navigate into link
      await expect(masthead.locator('#location-list').getByRole('link', { name: list_entry })).toBeVisible();
      await masthead.getByRole('link', { name: list_entry }).click();
      
      // Validate weather page for location
      await expect(page.getByTestId('location').getByRole('heading', { name: heading })).toBeVisible();
      await expect(page.locator('.wr-c-observations__details')).toContainText(obs_station);
    });
  })
});

test.describe('Search for weather forecasts - no match', () => {
  // Set test data
  // - term: term to be searched in masthead search bar
  [
    { term: 'qzqzqz', },
    { term: '1234567',},
  ].forEach(({term}) => {
    test('Weather page search doesn\'t return results for ' + term, async ({ page }) => {
      // Search for term and get locators
      const masthead = await input_search_term(page, term);

      // Get no autocompleted results
      await expect(masthead.locator('#location-list')).not.toBeVisible();

      // Click search and check "no results" message
      await masthead.getByRole('button', { name: 'Search', exact: true }).click();
      const w_search_nfmsg = masthead.locator('.ls-c-message__content').first();
      await w_search_nfmsg.waitFor({ timeout: 2000 }); // locator may need time to appear
      await expect(w_search_nfmsg).toContainText('We couldn\'t find any results for "' + term + '"');

      // Close search box
      await page.getByRole('button', { name: 'Close location search' }).click();
    });
  })
});

async function input_search_term(page: Page, term: string) {
  const masthead = page.getByTestId('weather-masthead');
  const textbox = page.getByTestId('weather-masthead').getByPlaceholder('Enter a town, city or UK');
  await textbox.click();
  await textbox.pressSequentially(term, { delay: 50 });
  return masthead;
}