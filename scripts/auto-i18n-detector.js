import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 增强的UI文本模式检测
const ENHANCED_UI_PATTERNS = [
  // JSX文本内容
  />\s*([A-Z][A-Za-z\s]{2,}?)\s*</g,
  /<[a-z][a-z0-9]*[^>]*>([^<{]+)<\/[a-z][a-z0-9]*>/gi,
  
  // 属性文本
  /placeholder=["']([^"'{]+)["']/gi,
  /title=["']([^"'{]+)["']/gi,
  /aria-label=["']([^"'{]+)["']/gi,
  /alt=["']([^"'{]+)["']/gi,
  /label=["']([^"'{]+)["']/gi,
  
  // React组件文本
  /children:\s*["']([^"'{]+)["']/gi,
  /text:\s*["']([^"'{]+)["']/gi,
  
  // 模板字符串文本
  /`([^`{]+)`/g
];

// 技术性内容排除模式
const TECHNICAL_EXCLUDE_PATTERNS = [
  /\$[A-Z_]+/,                   // 变量
  /import\s+.*from/,             // import语句
  /require\(/,                   // require调用
  /className="/,                 // className属性
  /<[A-Z][A-Za-z]*/,             // JSX组件标签
  /\/\w+\//,                     // 正则表达式
  /http[s]?:\/\//,               // URL
  /[A-Za-z0-9_]+@[A-Za-z0-9_]+/, // 邮箱
  /^[0-9]+$/,                    // 纯数字
  /oklch\(/,                     // 颜色值
  /\/path\//,                    // 路径
  /e\.g\./,                      // 示例
  /Promise/,                     // Promise相关
  /set[A-Z]/,                    // setState函数
  /update[A-Z]/,                 // update函数
  /handle[A-Z]/,                 // handler函数
  /\.[a-z]+\(/,                  // 方法调用
  /^[^A-Za-z]*$/,                // 不包含字母
  /node_modules/,                // node_modules路径
  /\.d\.ts$/,                    // 类型定义文件
  /^[\s\p{P}]+$/u,              // 纯标点符号
  /^[A-Za-z]{1,2}$/              // 单个字母或两个字母
];

// 英文文本检测模式
const ENGLISH_TEXT_PATTERNS = [
  // 常见英文单词
  /\b(the|and|for|with|this|that|from|have|will|your|are|not|but|what|all|can|how|when|where|why)\b/gi,
  
  // 常见UI动词
  /\b(save|cancel|delete|edit|view|close|yes|no|ok|back|next|previous|add|remove|create|update|submit|reset|refresh|search|filter|sort)\b/gi,
  
  // 常见名词
  /\b(name|title|description|email|password|username|phone|address|city|country|first name|last name|full name|date|time|age|gender)\b/gi,
  
  // 导航相关
  /\b(home|dashboard|settings|profile|account|help|about|contact|login|logout|register|projects|files|documents|images|videos|audio|downloads|uploads)\b/gi
];

function isTechnicalContent(text) {
  const trimmedText = text.trim();
  
  // 基本过滤
  if (trimmedText.length < 3 || trimmedText.length > 100) {
    return true;
  }
  
  // 检查技术性模式
  return TECHNICAL_EXCLUDE_PATTERNS.some(pattern => pattern.test(trimmedText));
}

function isLikelyEnglishText(text) {
  const trimmedText = text.trim();
  
  // 检查是否包含常见英文单词
  const hasEnglishWord = ENGLISH_TEXT_PATTERNS.some(pattern => pattern.test(trimmedText));
  
  // 检查句子结构
  const hasSentenceStructure = trimmedText.includes(' ') && 
    (trimmedText.includes('.') || trimmedText.includes('?') || trimmedText.includes('!'));
  
  // 检查英文短语模式
  const englishPhrasePatterns = [
    /^[A-Z][a-z]/,      // 首字母大写
    /ing$/,             // 以ing结尾
    /ed$/,              // 以ed结尾
    /s$/                // 以s结尾
  ];
  
  const matchesEnglishPattern = englishPhrasePatterns.some(pattern => 
    pattern.test(trimmedText)
  );
  
  return hasEnglishWord || hasSentenceStructure || matchesEnglishPattern;
}

function generateTranslationKey(text) {
  const trimmedText = text.trim();
  
  // 转换为小写并用下划线替换空格
  let key = trimmedText
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')  // 移除特殊字符
    .replace(/\s+/g, '_')         // 空格转下划线
    .replace(/_+/g, '_')         // 合并多个下划线
    .replace(/^_+|_+$/g, '');     // 移除首尾下划线
  
  // 根据文本内容分类
  if (trimmedText.match(/\b(save|cancel|delete|edit|view|close|yes|no|ok|back|next|previous)\b/i)) {
    return `buttons.${key}`;
  }
  
  if (trimmedText.match(/\b(name|title|description|email|password|username|phone|address)\b/i)) {
    return `forms.${key}`;
  }
  
  if (trimmedText.match(/\b(home|dashboard|settings|profile|account|help|about|contact)\b/i)) {
    return `navigation.${key}`;
  }
  
  if (trimmedText.match(/\b(loading|processing|saving|uploading|downloading|success|error|warning)\b/i)) {
    return `status.${key}`;
  }
  
  // 默认使用common分类
  return `common.${key}`;
}

function scanFileForHardcodedTexts(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const findings = [];
    
    lines.forEach((line, lineNumber) => {
      ENHANCED_UI_PATTERNS.forEach(pattern => {
        let match;
        while ((match = pattern.exec(line)) !== null) {
          const text = (match[1] || match[0]).trim();
          
          if (text && !isTechnicalContent(text) && isLikelyEnglishText(text)) {
            const translationKey = generateTranslationKey(text);
            
            findings.push({
              line: lineNumber + 1,
              text: text,
              translationKey: translationKey,
              context: line.trim(),
              file: path.basename(filePath)
            });
          }
        }
      });
    });
    
    return findings;
  } catch (error) {
    console.error(`读取文件失败: ${filePath}`, error);
    return [];
  }
}

async function scanProject() {
  const srcDir = path.join(__dirname, '../src');
  const outputFile = path.join(__dirname, '../AUTO_I18N_DETECTION_REPORT.md');
  
  // 扫描所有React组件文件
  const scanFiles = [
    'src/App.tsx',
    'src/components/Topbar.tsx',
    'src/components/Settings.tsx',
    'src/components/CheckpointSettings.tsx',
    'src/components/Agents.tsx',
    'src/components/AgentExecution.tsx',
    'src/components/UsageDashboard.tsx',
    'src/components/MCPManager.tsx',
    'src/components/TabManager.tsx',
    'src/components/CreateAgent.tsx',
    'src/components/AgentsModal.tsx'
  ];
  
  const allFindings = [];
  
  console.log('🔍 开始自动国际化检测扫描...');
  
  for (const relativePath of scanFiles) {
    const filePath = path.join(__dirname, '..', relativePath);
    
    if (fs.existsSync(filePath)) {
      console.log(`📄 扫描文件: ${relativePath}`);
      const findings = scanFileForHardcodedTexts(filePath);
      
      if (findings.length > 0) {
        allFindings.push(...findings);
        console.log(`  发现 ${findings.length} 个潜在文本`);
      }
    }
  }
  
  // 按文件分组
  const findingsByFile = {};
  allFindings.forEach(finding => {
    if (!findingsByFile[finding.file]) {
      findingsByFile[finding.file] = [];
    }
    findingsByFile[finding.file].push(finding);
  });
  
  // 生成详细的Markdown报告
  let report = `# 自动国际化检测报告

## 📊 扫描摘要

- **生成时间**: ${new Date().toLocaleString('zh-CN')}
- **扫描文件数**: ${scanFiles.length}
- **发现文本数**: ${allFindings.length}
- **需要翻译的文本**: ${allFindings.filter(f => f.text.includes('create')).length} 个包含'create'

## 🔍 扫描结果

`;
  
  Object.entries(findingsByFile).forEach(([fileName, findings]) => {
    report += `### 📁 ${fileName}

| 行号 | 原文内容 | 建议翻译键 | 上下文预览 |
|------|----------|------------|------------|
`;
    
    findings.forEach(({ line, text, translationKey, context }) => {
      const shortContext = context.length > 40 ? context.substring(0, 40) + '...' : context;
      report += `| ${line} | ${text.replace(/\|/g, '&#124;')} | ${translationKey} | ${shortContext.replace(/\|/g, '&#124;')} |\n`;
    });
    
    report += '\n';
  });
  
  // 特别关注'create'相关文本
  const createTexts = allFindings.filter(f => 
    f.text.toLowerCase().includes('create')
  );
  
  if (createTexts.length > 0) {
    report += `## ⚡ 紧急处理 - 'create'相关文本

这些文本在测试中被检测为硬编码文本，需要优先处理：

| 文件 | 行号 | 原文内容 | 建议翻译键 |
|------|------|----------|------------|
`;
    
    createTexts.forEach(({ file, line, text, translationKey }) => {
      report += `| ${file} | ${line} | ${text} | ${translationKey} |\n`;
    });
    
    report += '\n';
  }
  
  report += `## 🚀 后续处理步骤

### 1. 审核建议翻译键
检查自动生成的翻译键是否合适，可以根据需要进行调整。

### 2. 添加到翻译文件
将建议的翻译键添加到相应的翻译文件中：

\`\`\`bash
# 编辑英文翻译文件
code src/locales/en/translation.json

# 编辑中文翻译文件  
code src/locales/zh-CN/translation.json
\`\`\`

### 3. 替换硬编码文本
使用建议的翻译键替换源代码中的硬编码文本：

\`\`\`typescript
// 替换前
<button>Create Agent</button>

// 替换后  
<button>{t('buttons.create_agent')}</button>
\`\`\`

### 4. 验证修复
运行国际化测试验证修复：

\`\`\`bash
bun run test:i18n
\`\`\`

## 📈 统计信息

- **总扫描文件**: ${scanFiles.length}
- **有文本的文件**: ${Object.keys(findingsByFile).length}
- **总发现文本**: ${allFindings.length}
- **包含'create'的文本**: ${createTexts.length}
- **建议翻译键分类**:
  - buttons.*: ${allFindings.filter(f => f.translationKey.startsWith('buttons.')).length}
  - forms.*: ${allFindings.filter(f => f.translationKey.startsWith('forms.')).length}
  - navigation.*: ${allFindings.filter(f => f.translationKey.startsWith('navigation.')).length}
  - status.*: ${allFindings.filter(f => f.translationKey.startsWith('status.')).length}
  - common.*: ${allFindings.filter(f => f.translationKey.startsWith('common.')).length}

## 💡 使用技巧

1. **批量处理**: 可以一次性处理同一分类的多个文本
2. **模式识别**: 系统会自动识别文本类型并建议合适的分类
3. **优先级**: 优先处理测试中发现的'create'相关文本
4. **验证**: 每次修改后运行测试确保没有引入新的问题

---

*报告由自动国际化检测工具生成* ✨
`;
  
  fs.writeFileSync(outputFile, report);
  console.log(`✅ 扫描完成！报告已保存至: ${outputFile}`);
  console.log(`📊 发现 ${allFindings.length} 个潜在文本`);
  
  if (createTexts.length > 0) {
    console.log(`⚠️  发现 ${createTexts.length} 个包含'create'的文本需要优先处理`);
  }
}

// 执行扫描
scanProject().catch(console.error);