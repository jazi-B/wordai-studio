import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main headline', async ({ page }) => {
    const headline = page.getByRole('heading', { name: /The AI-Powered Word Editor/i });
    await expect(headline).toBeVisible();
  });

  test('should have a working "Start Writing" button', async ({ page }) => {
    const startWritingBtn = page.getByRole('button', { name: /Start Writing/i });
    await expect(startWritingBtn).toBeVisible();
    await startWritingBtn.click();
    await expect(page).toHaveURL(/\/editor\/new/);
  });

  test('should show features section', async ({ page }) => {
    await expect(page.getByText('Free for Students')).toBeVisible();
    await expect(page.getByText('AI-Powered Writing')).toBeVisible();
    await expect(page.getByText('Assignment Builder')).toBeVisible();
  });
});
