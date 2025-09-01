import { test, expect } from '@playwright/test';
import { KNOWN_TRANSLATION_KEYS } from './i18n-test-keys';
import { UI_TEXT_PATTERNS } from './i18n-test-patterns';
import { analyzeHardcodedTexts } from './i18n-test-analyzer';

// 主测试：检测页面中的硬编码英文文本
test('检测所有页面的硬编码英文文本', async ({ page }) => {
  // 导航到应用首页
  await page.goto('http://localhost:1420');
  
  // 获取页面所有可见文本
  const allTexts = await page.locator('body').allTextContents();
  const visibleTexts = allTexts.join(' ').split(/\s+/).filter(text => 
    text.length > 2 && !text.match(/^[\d\s\p{P}]+$/u)
  );
  
  // 分析硬编码文本
  const results = analyzeHardcodedTexts(visibleTexts, KNOWN_TRANSLATION_KEYS, UI_TEXT_PATTERNS);
  
  // 输出检测结果
  console.log('=== 硬编码英文文本检测结果 ===');
  console.log(`总文本数量: ${visibleTexts.length}`);
  console.log(`硬编码文本数量: ${results.hardcodedTexts.length}`);
  console.log(`可能缺少翻译的文本: ${results.missingTranslationTexts.length}`);
  
  // 断言：不应该有硬编码英文文本
  expect(results.hardcodedTexts).toEqual([]);
  
  if (results.hardcodedTexts.length > 0) {
    console.log('\n发现的硬编码文本:');
    results.hardcodedTexts.forEach(text => console.log(`  - ${text}`));
  }
  
  if (results.missingTranslationTexts.length > 0) {
    console.log('\n可能需要添加翻译的文本:');
    results.missingTranslationTexts.forEach(text => console.log(`  - ${text}`));
  }
});

// 测试：验证特定页面的国际化
test('验证设置页面的国际化', async ({ page }) => {
  await page.goto('http://localhost:1420/settings');
  
  // 检查设置页面特定元素
  const settingsTexts = await page.locator('.settings-section').allTextContents();
  const results = analyzeHardcodedTexts(settingsTexts, KNOWN_TRANSLATION_KEYS, UI_TEXT_PATTERNS);
  
  expect(results.hardcodedTexts).toEqual([]);
});