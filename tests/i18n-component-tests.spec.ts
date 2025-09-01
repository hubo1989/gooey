import { test, expect } from '@playwright/test';
import { analyzeHardcodedTexts } from './i18n-test-analyzer';
import { KNOWN_TRANSLATION_KEYS } from './i18n-test-keys';
import { UI_TEXT_PATTERNS } from './i18n-test-patterns';

// 设置页面组件测试
test('设置页面组件国际化测试', async ({ page }) => {
  await page.goto('http://localhost:1420/settings');
  
  // 测试分析设置部分
  const analyticsSection = await page.locator('[data-testid="analytics-section"]');
  const analyticsTexts = await analyticsSection.allTextContents();
  const analyticsResults = analyzeHardcodedTexts(analyticsTexts, KNOWN_TRANSLATION_KEYS, UI_TEXT_PATTERNS);
  
  expect(analyticsResults.hardcodedTexts).toEqual([]);
  
  // 测试标签页设置部分
  const tabsSection = await page.locator('[data-testid="tabs-section"]');
  const tabsTexts = await tabsSection.allTextContents();
  const tabsResults = analyzeHardcodedTexts(tabsTexts, KNOWN_TRANSLATION_KEYS, UI_TEXT_PATTERNS);
  
  expect(tabsResults.hardcodedTexts).toEqual([]);
  
  // 测试欢迎介绍部分
  const welcomeSection = await page.locator('[data-testid="welcome-section"]');
  const welcomeTexts = await welcomeSection.allTextContents();
  const welcomeResults = analyzeHardcodedTexts(welcomeTexts, KNOWN_TRANSLATION_KEYS, UI_TEXT_PATTERNS);
  
  expect(welcomeResults.hardcodedTexts).toEqual([]);
});

// 项目列表组件测试
test('项目列表组件国际化测试', async ({ page }) => {
  await page.goto('http://localhost:1420/projects');
  
  // 测试项目列表头部
  const projectsHeader = await page.locator('[data-testid="projects-header"]');
  const headerTexts = await projectsHeader.allTextContents();
  const headerResults = analyzeHardcodedTexts(headerTexts, KNOWN_TRANSLATION_KEYS, UI_TEXT_PATTERNS);
  
  expect(headerResults.hardcodedTexts).toEqual([]);
  
  // 测试空状态提示
  const emptyState = await page.locator('[data-testid="empty-state"]');
  const emptyStateTexts = await emptyState.allTextContents();
  const emptyStateResults = analyzeHardcodedTexts(emptyStateTexts, KNOWN_TRANSLATION_KEYS, UI_TEXT_PATTERNS);
  
  expect(emptyStateResults.hardcodedTexts).toEqual([]);
});

// 导航栏组件测试
test('导航栏组件国际化测试', async ({ page }) => {
  await page.goto('http://localhost:1420');
  
  // 测试主导航
  const mainNav = await page.locator('[data-testid="main-navigation"]');
  const navTexts = await mainNav.allTextContents();
  const navResults = analyzeHardcodedTexts(navTexts, KNOWN_TRANSLATION_KEYS, UI_TEXT_PATTERNS);
  
  expect(navResults.hardcodedTexts).toEqual([]);
  
  // 测试侧边栏
  const sidebar = await page.locator('[data-testid="sidebar"]');
  const sidebarTexts = await sidebar.allTextContents();
  const sidebarResults = analyzeHardcodedTexts(sidebarTexts, KNOWN_TRANSLATION_KEYS, UI_TEXT_PATTERNS);
  
  expect(sidebarResults.hardcodedTexts).toEqual([]);
});

// 代理管理组件测试
test('代理管理组件国际化测试', async ({ page }) => {
  await page.goto('http://localhost:1420/agents');
  
  // 测试代理列表
  const agentsList = await page.locator('[data-testid="agents-list"]');
  const agentsTexts = await agentsList.allTextContents();
  const agentsResults = analyzeHardcodedTexts(agentsTexts, KNOWN_TRANSLATION_KEYS, UI_TEXT_PATTERNS);
  
  expect(agentsResults.hardcodedTexts).toEqual([]);
  
  // 测试创建代理表单
  const createForm = await page.locator('[data-testid="create-agent-form"]');
  const formTexts = await createForm.allTextContents();
  const formResults = analyzeHardcodedTexts(formTexts, KNOWN_TRANSLATION_KEYS, UI_TEXT_PATTERNS);
  
  expect(formResults.hardcodedTexts).toEqual([]);
});

// 使用分析组件测试
test('使用分析组件国际化测试', async ({ page }) => {
  await page.goto('http://localhost:1420/usage');
  
  // 测试使用统计
  const usageStats = await page.locator('[data-testid="usage-statistics"]');
  const statsTexts = await usageStats.allTextContents();
  const statsResults = analyzeHardcodedTexts(statsTexts, KNOWN_TRANSLATION_KEYS, UI_TEXT_PATTERNS);
  
  expect(statsResults.hardcodedTexts).toEqual([]);
  
  // 测试图表标签
  const charts = await page.locator('[data-testid="usage-charts"]');
  const chartsTexts = await charts.allTextContents();
  const chartsResults = analyzeHardcodedTexts(chartsTexts, KNOWN_TRANSLATION_KEYS, UI_TEXT_PATTERNS);
  
  expect(chartsResults.hardcodedTexts).toEqual([]);
});

// MCP服务器管理组件测试
test('MCP服务器管理组件国际化测试', async ({ page }) => {
  await page.goto('http://localhost:1420/mcp');
  
  // 测试服务器列表
  const serversList = await page.locator('[data-testid="mcp-servers-list"]');
  const serversTexts = await serversList.allTextContents();
  const serversResults = analyzeHardcodedTexts(serversTexts, KNOWN_TRANSLATION_KEYS, UI_TEXT_PATTERNS);
  
  expect(serversResults.hardcodedTexts).toEqual([]);
  
  // 测试服务器配置表单
  const serverForm = await page.locator('[data-testid="mcp-server-form"]');
  const formTexts = await serverForm.allTextContents();
  const formResults = analyzeHardcodedTexts(formTexts, KNOWN_TRANSLATION_KEYS, UI_TEXT_PATTERNS);
  
  expect(formResults.hardcodedTexts).toEqual([]);
});