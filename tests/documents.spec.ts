import { test, expect } from '@playwright/test';

test.describe('Documents Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/documents');
  });

  test('should display "My Documents" title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'My Documents' })).toBeVisible();
  });

  test('should show the sample documents', async ({ page }) => {
    await expect(page.getByText('Impact of AI on Higher Education')).toBeVisible();
    await expect(page.getByText('Climate Policy Analysis')).toBeVisible();
  });

  test('should have a working search bar', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search documents...');
    await searchInput.fill('Climate');
    await expect(page.getByText('Climate Policy Analysis')).toBeVisible();
    await expect(page.getByText('Impact of AI on Higher Education')).not.toBeVisible();
  });

  test('should navigate to editor on document click', async ({ page }) => {
    // Use a more specific selector for the document card
    const docCard = page.getByText('Impact of AI on Higher Education').first();
    await docCard.click();
    // Wait for the editor to load by checking for the same title in the header
    await expect(page).toHaveURL(/\/editor\/demo-1/, { timeout: 15000 });
    await expect(page.getByRole('heading', { name: 'Impact of AI on Higher Education' })).toBeVisible({ timeout: 10000 });
  });
});
