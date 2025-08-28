# i18n 国际化工作流程指南

## 工具集成

### i18next-scanner + Languine 协作流程

这两个工具可以完美配合：
- **i18next-scanner**: 源代码扫描和字符串提取
- **Languine**: 翻译管理、AI翻译、团队协作

### Languine Project ID 配置

在使用 Languine 之前，需要配置项目 ID：

1. 打开项目根目录下的 `languine.json` 文件
2. 将 `projectId` 字段设置为您的项目标识符
3. 保存文件

示例配置：
```json
{
  "projectId": "your-project-id-here",
  "locale": {
    "source": "en",
    "targets": ["zh-CN", "zh-TW", "ja", "ko", "es", "fr", "de", "pt", "ru", "it"]
  },
  "files": {
    "json": {
      "include": ["src/locales/[locale].json"]
    }
  }
}
```

## 快速开始

### 1. 安装依赖
```bash
npm install i18next-scanner --save-dev
# Languine 已经安装 (@languine/cli)
```

### 2. 运行提取命令
```bash
# 提取字符串（目前主要用于管理现有翻译）
npm run i18n:extract

# 同步翻译到其他语言
npm run i18n:sync

# 使用AI翻译
npm run i18n:translate

# 完整流程
npm run i18n:all
```

## 分阶段实施策略

### 阶段一：基础设置（已完成）
- ✅ i18next 框架已配置
- ✅ 基础翻译文件结构已建立
- ✅ Languine 配置就绪
- ✅ i18next-scanner 安装完成

### 阶段二：逐步替换硬编码文本

#### 优先替换的组件：
1. **Topbar.tsx** - 导航文本
2. **Settings.tsx** - 设置界面文本  
3. **CheckpointSettings.tsx** - 检查点设置
4. **Agents.tsx** - 代理管理

#### 替换示例：
```jsx
// 替换前
<h3>Checkpoint Settings</h3>

// 替换后
<h3>{t('settings.checkpoint.title')}</h3>
```

### 阶段三：键命名规范

使用有意义的键名结构：
```
组件名.区域.文本类型
示例：
- settings.checkpoint.title
- agents.list.description  
- navigation.topbar.settings
```

## 技术性内容保护

### 不应该翻译的内容：
```javascript
// 技术性内容（不翻译）
$ARGUMENTS, import语句, className, 文件路径, 颜色值, 正则表达式

// UI文本（需要翻译）
按钮标签, 标题, 描述文本, 占位符, 错误消息
```

## 自动化脚本

### package.json 脚本：
```json
{
  "i18n:extract": "i18next-scanner --config i18next-scanner.config.cjs",
  "i18n:sync": "languine sync", 
  "i18n:translate": "languine translate",
  "i18n:all": "npm run i18n:extract && npm run i18n:sync && npm run i18n:translate",
  "i18n:check": "npm run i18n:extract && npm run check"
}
```

## 验证流程

1. **开发时**: 运行 `npm run i18n:check` 确保翻译完整性
2. **提交前**: 运行 `npm run i18n:all` 同步所有翻译
3. **发布前**: 验证所有语言文件是否完整

## 故障排除

### 常见问题：
1. **i18next-scanner 解析错误**: 禁用 trans 组件解析
2. **Languine 同步失败**: 检查网络连接和API密钥
3. **翻译键冲突**: 使用有意义的命名空间

## 最佳实践

1. **小批量替换**: 每次替换一个组件的文本
2. **及时测试**: 替换后立即验证功能正常
3. **版本控制**: 提交翻译文件变更
4. **团队协作**: 使用 Languine 的 PR 功能进行翻译审核

## 下一步行动

1. 开始替换 `src/components/Topbar.tsx` 中的硬编码文本
2. 运行 `npm run i18n:extract` 验证提取
3. 运行 `npm run i18n:sync` 同步到其他语言
4. 重复流程逐步覆盖所有界面