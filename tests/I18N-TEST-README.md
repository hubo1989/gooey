# 国际化测试套件

## 概述

这个测试套件用于检测Gooey应用中的硬编码英文文本和缺少翻译的文本。测试套件采用模块化设计，包含多个专门的文件来处理不同的测试功能。

## 文件结构

```
tests/
├── i18n-test-main.spec.ts      # 主测试文件
├── i18n-test-keys.ts           # 翻译键管理
├── i18n-test-patterns.ts       # UI文本模式检测
├── i18n-test-analyzer.ts       # 文本分析器
├── i18n-component-tests.spec.ts # 组件特定测试
├── i18n-test-utils.ts          # 测试工具函数
├── i18n-test-config.ts         # 测试配置
└── I18N-TEST-README.md         # 说明文档
```

## 安装和运行

### 前置条件
- Node.js 16+
- Playwright 1.40+
- Gooey应用运行在 http://localhost:1420

### 安装依赖
```bash
npm install @playwright/test
# 或
bun add @playwright/test
```

### 运行测试
```bash
# 运行所有国际化测试
npx playwright test tests/i18n-test-main.spec.ts

# 运行组件特定测试
npx playwright test tests/i18n-component-tests.spec.ts

# 使用UI模式运行
npx playwright test tests/i18n-test-main.spec.ts --ui

# 生成HTML报告
npx playwright test tests/i18n-test-main.spec.ts --reporter=html
```

## 测试功能

### 1. 硬编码文本检测
- 检测页面中的所有可见文本
- 区分硬编码文本和缺少翻译的文本
- 使用正则表达式模式匹配常见UI文本

### 2. 翻译键验证
- 验证已知翻译键是否已正确实现
- 检测缺少翻译键的文本

### 3. 组件级测试
- 针对特定组件进行国际化测试
- 包括设置页面、项目列表、导航栏等

### 4. 多语言支持验证
- 验证不同语言环境下的文本显示
- 检测语言切换功能

## 配置说明

### 修改测试配置
编辑 `i18n-test-config.ts` 文件：

```typescript
// 修改应用URL
export const I18N_TEST_CONFIG = {
  baseUrl: 'http://localhost:1420',
  // ...其他配置
};
```

### 添加新的翻译键
在 `i18n-test-keys.ts` 文件中添加新的翻译键：

```typescript
export const KNOWN_TRANSLATION_KEYS = new Set([
  // 添加新的翻译键
  'new.feature.title',
  'new.feature.description',
  // ...
]);
```

### 添加新的UI模式
在 `i18n-test-patterns.ts` 文件中添加新的模式：

```typescript
export const UI_TEXT_PATTERNS = [
  // 添加新的正则表达式模式
  /^(New Pattern|Another Pattern)$/i,
  // ...
];
```

## 测试报告

测试完成后会生成详细的报告：

### 控制台输出
```
=== 国际化检测详细报告 ===
总文本数量: 150
硬编码文本数量: 5
可能缺少翻译的文本: 10
硬编码比例: 3.33%

发现的硬编码文本:
1. Save Changes
2. Cancel
3. Delete
4. Edit Profile
5. View Details

可能需要添加翻译的文本:
1. Please wait while we process your request
2. Your changes have been saved successfully
3. An error occurred while processing your request
4. Are you sure you want to delete this item?
5. This action cannot be undone
```

### HTML报告
运行测试时使用 `--reporter=html` 参数生成交互式HTML报告。

## 自定义测试

### 创建新的测试文件
```typescript
import { test, expect } from '@playwright/test';
import { analyzeHardcodedTexts } from './i18n-test-analyzer';
import { KNOWN_TRANSLATION_KEYS } from './i18n-test-keys';
import { UI_TEXT_PATTERNS } from './i18n-test-patterns';

// 自定义测试
test('自定义页面测试', async ({ page }) => {
  await page.goto('http://localhost:1420/custom-page');
  
  const texts = await page.locator('body').allTextContents();
  const results = analyzeHardcodedTexts(texts, KNOWN_TRANSLATION_KEYS, UI_TEXT_PATTERNS);
  
  expect(results.hardcodedTexts).toEqual([]);
});
```

### 扩展分析功能
在 `i18n-test-analyzer.ts` 中添加新的分析逻辑。

## 故障排除

### 常见问题

1. **测试无法连接到应用**
   - 确保Gooey应用正在运行
   - 检查 `baseUrl` 配置是否正确

2. **测试超时**
   - 增加 `timeouts.navigation` 配置值
   - 检查网络连接

3. **误报硬编码文本**
   - 在 `EXCLUDE_PATTERNS` 中添加排除模式
   - 在 `KNOWN_TRANSLATION_KEYS` 中添加已知翻译键

4. **缺少翻译键检测不准确**
   - 调整 `isLikelyEnglishText` 函数中的启发式规则

### 调试测试
```bash
# 使用调试模式运行
npx playwright test tests/i18n-test-main.spec.ts --debug

# 使用开发者工具
npx playwright test tests/i18n-test-main.spec.ts --devtools
```

## 持续集成

### GitHub Actions 示例
```yaml
name: I18N Tests
on: [push, pull_request]

jobs:
  i18n-test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Run I18N tests
      run: npx playwright test tests/i18n-test-main.spec.ts --reporter=html
    
    - name: Upload HTML report
      uses: actions/upload-artifact@v4
      with:
        name: i18n-test-report
        path: playwright-report/
```

## 贡献指南

1. 添加新的测试用例时，请更新相应的模块文件
2. 修改配置时，请更新文档说明
3. 添加新的功能时，请编写相应的测试
4. 保持代码风格一致

## 许可证

MIT License