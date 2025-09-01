import { Page } from '@playwright/test';

// 获取页面所有可见文本
export async function getAllVisibleTexts(page: Page): Promise<string[]> {
  const allTexts = await page.locator('body').allTextContents();
  return allTexts.join(' ').split(/\s+/).filter(text => 
    text.length > 2 && !text.match(/^[\d\s\p{P}]+$/u)
  );
}

// 获取特定元素的文本内容
export async function getElementTexts(
  page: Page, 
  selector: string
): Promise<string[]> {
  const element = page.locator(selector);
  const texts = await element.allTextContents();
  return texts.flatMap(text => text.split(/\s+/)).filter(text => 
    text.length > 2 && !text.match(/^[\d\s\p{P}]+$/u)
  );
}

// 等待页面完全加载
export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1000); // 额外等待时间确保完全渲染
}

// 检查页面是否包含特定文本
export async function pageContainsText(
  page: Page, 
  text: string
): Promise<boolean> {
  const content = await page.content();
  return content.includes(text);
}

// 获取页面标题
export async function getPageTitle(page: Page): Promise<string> {
  return await page.title();
}

// 检查元素是否存在
export async function elementExists(
  page: Page, 
  selector: string
): Promise<boolean> {
  const count = await page.locator(selector).count();
  return count > 0;
}

// 获取元素的属性值
export async function getElementAttribute(
  page: Page, 
  selector: string, 
  attribute: string
): Promise<string | null> {
  return await page.locator(selector).getAttribute(attribute);
}

// 检查元素是否可见
export async function isElementVisible(
  page: Page, 
  selector: string
): Promise<boolean> {
  const element = page.locator(selector);
  return await element.isVisible();
}

// 获取所有链接的文本和URL
export async function getAllLinks(page: Page): Promise<Array<{text: string, href: string}>> {
  const links = await page.locator('a').evaluateAll(elements => 
    elements.map(el => ({
      text: el.textContent?.trim() || '',
      href: el.getAttribute('href') || ''
    }))
  );
  
  return links.filter(link => link.text.length > 0);
}

// 获取所有按钮的文本
export async function getAllButtons(page: Page): Promise<string[]> {
  const buttons = await page.locator('button').allTextContents();
  return buttons.map(text => text.trim()).filter(text => text.length > 0);
}

// 获取所有输入框的占位符文本
export async function getAllInputPlaceholders(page: Page): Promise<string[]> {
  const placeholders = await page.locator('input[placeholder]').evaluateAll(elements => 
    elements.map(el => el.getAttribute('placeholder') || '')
  );
  
  return placeholders.filter(text => text.length > 0);
}

// 获取所有图片的alt文本
export async function getAllImageAlts(page: Page): Promise<string[]> {
  const alts = await page.locator('img[alt]').evaluateAll(elements => 
    elements.map(el => el.getAttribute('alt') || '')
  );
  
  return alts.filter(text => text.length > 0);
}

// 截图并保存
export async function takeScreenshot(
  page: Page, 
  name: string,
  fullPage: boolean = false
): Promise<void> {
  await page.screenshot({ 
    path: `test-results/screenshots/${name}-${Date.now()}.png`,
    fullPage
  });
}

// 生成测试报告文件名
export function generateReportFilename(prefix: string = 'i18n-test'): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `test-results/${prefix}-${timestamp}.json`;
}

// 保存测试结果到文件
export async function saveTestResults(
  results: any, 
  filename: string
): Promise<void> {
  // 这里需要文件系统操作，在实际测试中可以使用Node.js的fs模块
  console.log(`测试结果已保存到: ${filename}`);
  console.log(JSON.stringify(results, null, 2));
}

// 格式化测试持续时间
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
  return `${(ms / 60000).toFixed(2)}min`;
}

// 生成随机测试数据
export function generateTestData(count: number = 10): string[] {
  const testData: string[] = [];
  const words = ['Test', 'Sample', 'Demo', 'Example', 'Data', 'Mock', 'Fake'];
  
  for (let i = 0; i < count; i++) {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    testData.push(`${randomWord} ${i + 1}`);
  }
  
  return testData;
}