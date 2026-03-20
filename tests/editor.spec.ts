import { test, expect } from '@playwright/test';

test.describe('Editor Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a demo document
    await page.goto('/editor/demo-1');
  });

  test('should load the editor with the correct document title', async ({ page }) => {
    await expect(page.getByText('Impact of AI on Higher Education')).toBeVisible();
  });

  test('should display the editor toolbar', async ({ page }) => {
    // Check for some toolbar buttons
    await expect(page.getByRole('button', { name: /Undo/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Bold/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Table/i })).toBeVisible();
  });

  test('should allow switching sidebar tabs', async ({ page }) => {
    // Use the tabs list
    const chatTab = page.getByRole('tab', { name: /Chat/i });
    const writeTab = page.getByRole('tab', { name: /Write/i });
    const imagesTab = page.getByRole('tab', { name: /Images/i });
    const formatTab = page.getByRole('tab', { name: /Format/i });
    const settingsTab = page.getByRole('tab', { name: /Settings/i });

    await expect(chatTab).toBeVisible();
    
    await writeTab.click();
    await expect(page.getByText('Quick Actions')).toBeVisible();
    await expect(page.getByText('Assignment Builder')).toBeVisible();

    await imagesTab.click();
    await expect(page.getByPlaceholder(/What image do you need/i)).toBeVisible();

    await formatTab.click();
    await expect(page.getByText('Document Templates')).toBeVisible();

    await settingsTab.click();
    // The heading is inside the tab content
    await expect(page.getByRole('heading', { name: 'AI Preferences' })).toBeVisible({ timeout: 10000 });
  });

  test('should be able to type in the editor', async ({ page }) => {
    const editor = page.locator('.ProseMirror');
    await expect(editor).toBeVisible({ timeout: 10000 });
    await editor.click();
    await editor.fill('Testing Playwright input in WordAI Studio editor.');
    await expect(page.getByText('Testing Playwright input')).toBeVisible();
  });

  test('should update word and char count in status bar', async ({ page }) => {
    const editor = page.locator('.ProseMirror');
    await editor.click();
    await editor.fill('Hello world');
    // Give it a moment to update counts
    await expect(page.getByText(/Words: [21]/)).toBeVisible();
  });
});
