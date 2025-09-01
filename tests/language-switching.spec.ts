import { test, expect } from '@playwright/test';

test.describe('Language Switching Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Start the app (you'll need to adjust this based on how your app is served)
    // For now, we'll assume it's running on localhost:1420 (Vite's default for Tauri apps)
    await page.goto('http://localhost:1420');
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Additional wait for React to render
  });

  test('should find language switcher and switch language from English to Chinese', async ({ page }) => {
    // Try multiple strategies to find the language switcher
    console.log('Attempting to find language switcher...');
    
    // Strategy 1: Look for elements with data-testid
    let languageSwitcher = page.getByTestId('language-switcher');
    
    // Strategy 2: Look for button with globe icon
    if (!(await languageSwitcher.isVisible({ timeout: 3000 }).catch(() => false))) {
      console.log('Strategy 1 failed, trying strategy 2...');
      languageSwitcher = page.locator('button:has(svg[data-lucide="globe"])');
    }
    
    // Strategy 3: Look for button containing language text
    if (!(await languageSwitcher.isVisible({ timeout: 3000 }).catch(() => false))) {
      console.log('Strategy 2 failed, trying strategy 3...');
      languageSwitcher = page.locator('button:has(span:text("English"))');
    }
    
    // Strategy 4: Look for any button with LanguageSwitcher class
    if (!(await languageSwitcher.isVisible({ timeout: 3000 }).catch(() => false))) {
      console.log('Strategy 3 failed, trying strategy 4...');
      languageSwitcher = page.locator('button[class*="LanguageSwitcher"]');
    }
    
    // Final check
    await expect(languageSwitcher).toBeVisible({ timeout: 5000 });
    console.log('Language switcher found!');
    
    // Click the language switcher to open dropdown
    await languageSwitcher.click();
    console.log('Clicked language switcher');
    
    // Wait a bit for dropdown to appear
    await page.waitForTimeout(500);
    
    // Find and click Chinese option
    const chineseOption = page.getByTestId('language-option-zh-CN');
    await expect(chineseOption).toBeVisible({ timeout: 5000 });
    await chineseOption.click();
    console.log('Clicked Chinese option');
    
    // Wait for language change to take effect
    await page.waitForTimeout(1000);
    
    // Check localStorage
    const localStorageLanguage = await page.evaluate(() => localStorage.getItem('i18nextLng'));
    expect(localStorageLanguage).toBe('zh-CN');
    console.log('Language successfully changed to Chinese');
  });

  test('should switch language from Chinese to English', async ({ page }) => {
    // First set language to Chinese
    await page.evaluate(() => localStorage.setItem('i18nextLng', 'zh-CN'));
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Try multiple strategies to find the language switcher
    console.log('Attempting to find language switcher...');
    
    // Strategy 1: Look for elements with data-testid
    let languageSwitcher = page.getByTestId('language-switcher');
    
    // Strategy 2: Look for button with globe icon
    if (!(await languageSwitcher.isVisible({ timeout: 3000 }).catch(() => false))) {
      console.log('Strategy 1 failed, trying strategy 2...');
      languageSwitcher = page.locator('button:has(svg[data-lucide="globe"])');
    }
    
    // Strategy 3: Look for button containing language text
    if (!(await languageSwitcher.isVisible({ timeout: 3000 }).catch(() => false))) {
      console.log('Strategy 2 failed, trying strategy 3...');
      languageSwitcher = page.locator('button:has(span:text("中文"))');
    }
    
    // Strategy 4: Look for any button with LanguageSwitcher class
    if (!(await languageSwitcher.isVisible({ timeout: 3000 }).catch(() => false))) {
      console.log('Strategy 3 failed, trying strategy 4...');
      languageSwitcher = page.locator('button[class*="LanguageSwitcher"]');
    }
    
    // Final check
    await expect(languageSwitcher).toBeVisible({ timeout: 5000 });
    console.log('Language switcher found!');
    
    // Click the language switcher to open dropdown
    await languageSwitcher.click();
    console.log('Clicked language switcher');
    
    // Wait a bit for dropdown to appear
    await page.waitForTimeout(500);
    
    // Find and click English option
    const englishOption = page.getByTestId('language-option-en');
    await expect(englishOption).toBeVisible({ timeout: 5000 });
    await englishOption.click();
    console.log('Clicked English option');
    
    // Wait for language change to take effect
    await page.waitForTimeout(1000);
    
    // Check localStorage
    const localStorageLanguage = await page.evaluate(() => localStorage.getItem('i18nextLng'));
    expect(localStorageLanguage).toBe('en');
    console.log('Language successfully changed to English');
  });

  test('should persist language preference across sessions', async ({ page }) => {
    // Try multiple strategies to find the language switcher
    console.log('Attempting to find language switcher...');
    
    // Strategy 1: Look for elements with data-testid
    let languageSwitcher = page.getByTestId('language-switcher');
    
    // Strategy 2: Look for button with globe icon
    if (!(await languageSwitcher.isVisible({ timeout: 3000 }).catch(() => false))) {
      console.log('Strategy 1 failed, trying strategy 2...');
      languageSwitcher = page.locator('button:has(svg[data-lucide="globe"])');
    }
    
    // Strategy 3: Look for button containing language text
    if (!(await languageSwitcher.isVisible({ timeout: 3000 }).catch(() => false))) {
      console.log('Strategy 2 failed, trying strategy 3...');
      languageSwitcher = page.locator('button:has(span:text("English"))');
    }
    
    // Strategy 4: Look for any button with LanguageSwitcher class
    if (!(await languageSwitcher.isVisible({ timeout: 3000 }).catch(() => false))) {
      console.log('Strategy 3 failed, trying strategy 4...');
      languageSwitcher = page.locator('button[class*="LanguageSwitcher"]');
    }
    
    // Final check
    await expect(languageSwitcher).toBeVisible({ timeout: 5000 });
    console.log('Language switcher found!');
    
    // Click the language switcher to open dropdown
    await languageSwitcher.click();
    console.log('Clicked language switcher');
    
    // Wait a bit for dropdown to appear
    await page.waitForTimeout(500);
    
    // Find and click Chinese option
    const chineseOption = page.getByTestId('language-option-zh-CN');
    await expect(chineseOption).toBeVisible({ timeout: 5000 });
    await chineseOption.click();
    console.log('Clicked Chinese option');
    
    // Wait for language change to take effect
    await page.waitForTimeout(1000);
    
    // Store current localStorage values
    const localStorageBefore = await page.evaluate(() => ({
      i18nextLng: localStorage.getItem('i18nextLng'),
      preferredLanguage: localStorage.getItem('preferred_language')
    }));
    
    expect(localStorageBefore.i18nextLng).toBe('zh-CN');
    expect(localStorageBefore.preferredLanguage).toBe('zh-CN');
    console.log('Language preference saved to localStorage');
    
    // Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check that language is still Chinese
    const localStorageAfter = await page.evaluate(() => localStorage.getItem('i18nextLng'));
    expect(localStorageAfter).toBe('zh-CN');
    console.log('Language preference persisted after reload');
  });
});