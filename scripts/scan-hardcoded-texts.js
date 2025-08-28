import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 不应该扫描的技术性内容模式
const TECHNICAL_PATTERNS = [
  /\$[A-Z_]+/,                   // 变量如 $ARGUMENTS
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
  /Promise/,                     // Promise
  /set[A-Z]/,                    // setState函数
  /update[A-Z]/,                 // update函数
  /handle[A-Z]/,                 // handler函数
  /\.[a-z]+\(/,                  // 方法调用
  /^[^A-Za-z]*$/,                // 不包含字母
  /node_modules/,                // node_modules路径
  /\.d\.ts$/,                    // 类型定义文件
];

// 应该扫描的UI文本模式
const UI_TEXT_PATTERNS = [
  /<h[1-6][^>]*>([^<{]+)<\/h[1-6]>/i,           // 标题
  /<p[^>]*>([^<{]+)<\/p>/i,                     // 段落
  /<span[^>]*>([^<{]+)<\/span>/i,               // span
  /placeholder=["']([^"'{]+)["']/i,              // 占位符
  /title=["']([^"'{]+)["']/i,                    // title属性
  /aria-label=["']([^"'{]+)["']/i,              // aria-label属性
  /alt=["']([^"'{]+)["']/i,                      // alt属性
  /label=["']([^"'{]+)["']/i,                    // label属性
  /<div[^>]*>[\s]*([A-Za-z][^<{]+)[\s]*<\/div>/i, // div文本内容
  /<button[^>]*>([^<{]+)<\/button>/i,           // 按钮文本
  /<a[^>]*>([^<{]+)<\/a>/i,                     // 链接文本
  />\s*([A-Z][A-Za-z\s]{2,}?)\s*</i,            // 标签间的文本
];

function isTechnicalContent(text) {
  const trimmedText = text.trim();
  
  // 过滤短文本
  if (trimmedText.length < 3 || trimmedText.length > 100) {
    return true;
  }
  
  // 检查技术性模式
  return TECHNICAL_PATTERNS.some(pattern => pattern.test(trimmedText));
}

function scanFileForHardcodedTexts(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const findings = [];
  
  lines.forEach((line, lineNumber) => {
    UI_TEXT_PATTERNS.forEach(pattern => {
      let match;
      while ((match = pattern.exec(line)) !== null) {
        const text = (match[1] || match[0]).trim();
        
        if (!isTechnicalContent(text)) {
          findings.push({
            line: lineNumber + 1,
            text: text,
            context: line.trim()
          });
        }
      }
    });
  });
  
  return findings;
}

async function scanProject() {
  const srcDir = path.join(__dirname, '../src');
  const outputFile = path.join(__dirname, '../HARDCODED_TEXTS_REPORT.md');
  
  const filePatterns = [
    'src/**/*.tsx',
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.*',
    '!src/**/*.spec.*',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**',
    '!src/locales/**'
  ];
  
  // 使用简单的文件遍历（避免复杂glob模式）
  const scanFiles = [
    'src/App.tsx',
    'src/components/Topbar.tsx',
    'src/components/Settings.tsx',
    'src/components/CheckpointSettings.tsx',
    'src/components/Agents.tsx',
    'src/components/AgentExecution.tsx',
    'src/components/UsageDashboard.tsx',
    'src/components/MCPManager.tsx'
  ];
  
  const allFindings = [];
  
  for (const relativePath of scanFiles) {
    const filePath = path.join(__dirname, '..', relativePath);
    
    if (fs.existsSync(filePath)) {
      console.log(`扫描文件: ${relativePath}`);
      const findings = scanFileForHardcodedTexts(filePath);
      
      if (findings.length > 0) {
        allFindings.push({
          file: relativePath,
          findings: findings
        });
      }
    }
  }
  
  // 生成Markdown报告
  let report = `# 硬编码文本扫描报告

生成时间: ${new Date().toLocaleString('zh-CN')}
扫描文件数: ${scanFiles.length}
发现文本数: ${allFindings.reduce((sum, item) => sum + item.findings.length, 0)}

## 扫描结果

`;
  
  allFindings.forEach(({ file, findings }) => {
    report += `### ${file}

| 行号 | 文本内容 | 上下文 |
|------|----------|---------|
`;
    
    findings.forEach(({ line, text, context }) => {
      // 缩短过长的上下文
      const shortContext = context.length > 50 ? context.substring(0, 50) + '...' : context;
      report += `| ${line} | ${text.replace(/\|/g, '&#124;')} | ${shortContext.replace(/\|/g, '&#124;')} |\n`;
    });
    
    report += '\n';
  });
  
  report += `## 后续步骤

1. **人工审核**: 检查上述文本是否需要翻译
2. **分类标记**: 使用以下标记进行分类：
   - ✅ 需要翻译
   - ⚠️  技术内容（不翻译）
   - ❌ 已废弃
3. **批量处理**: 审核完成后运行翻译脚本

## 统计信息

- 总文件数: ${scanFiles.length}
- 有文本的文件数: ${allFindings.length}
- 总文本数: ${allFindings.reduce((sum, item) => sum + item.findings.length, 0)}
`;
  
  fs.writeFileSync(outputFile, report);
  console.log(`✅ 扫描完成！报告已保存至: ${outputFile}`);
  console.log(`📊 发现 ${allFindings.reduce((sum, item) => sum + item.findings.length, 0)} 个潜在文本`);
}

// 执行扫描
scanProject().catch(console.error);