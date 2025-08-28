import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 简单的硬编码文本扫描器
function scanFileForTexts(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const findings = [];
    
    // 简单的文本匹配模式
    const textPatterns = [
      /[>\s]['"`]([A-Z][A-Za-z\s]{2,}?)['"`][<\s]/g,  // 引号内的文本
      /<h[1-6][^>]*>([^<{]+)<\/h[1-6]>/gi,            // 标题
      /<p[^>]*>([^<{]+)<\/p>/gi,                      // 段落
      /placeholder=["']([^"'{]+)["']/gi,                // 占位符
      /title=["']([^"'{]+)["']/gi,                      // title属性
    ];
    
    lines.forEach((line, index) => {
      textPatterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(line)) !== null) {
          const text = (match[1] || match[0]).trim();
          
          // 基本过滤
          if (text.length >= 3 && 
              text.length <= 100 &&
              /[A-Za-z]/.test(text) &&
              !text.includes('$') &&
              !text.includes('import') &&
              !text.includes('className') &&
              !text.startsWith('http') &&
              !text.match(/^[0-9]+$/)) {
            
            findings.push({
              line: index + 1,
              text: text,
              context: line.trim().substring(0, 60)
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

async function main() {
  const targetFiles = [
    'src/App.tsx',
    'src/components/Topbar.tsx',
    'src/components/Settings.tsx',
    'src/components/CheckpointSettings.tsx',
    'src/components/Agents.tsx'
  ];
  
  const outputFile = path.join(__dirname, '../HARDCODED_TEXTS_SCAN.md');
  
  let report = `# 硬编码文本扫描报告

生成时间: ${new Date().toLocaleString('zh-CN')}
扫描文件: ${targetFiles.length} 个关键文件

## 扫描结果

`;
  
  let totalFindings = 0;
  
  for (const filePath of targetFiles) {
    const fullPath = path.join(__dirname, '..', filePath);
    
    if (fs.existsSync(fullPath)) {
      console.log(`🔍 扫描: ${filePath}`);
      const findings = scanFileForTexts(fullPath);
      
      if (findings.length > 0) {
        totalFindings += findings.length;
        
        report += `### ${filePath}

| 行号 | 文本内容 | 上下文预览 |
|------|----------|------------|
`;
        
        findings.forEach(({ line, text, context }) => {
          // 转义表格中的特殊字符
          const safeText = text.replace(/\|/g, '&#124;');
          const safeContext = context.replace(/\|/g, '&#124;').replace(/\n/g, ' ');
          
          report += `| ${line} | ${safeText} | ${safeContext} |\n`;
        });
        
        report += '\n';
      }
    }
  }
  
  report += `## 统计信息

- 扫描文件数: ${targetFiles.length}
- 发现文本数: ${totalFindings}
- 生成时间: ${new Date().toLocaleString('zh-CN')}

## 使用说明

1. **审核标记**: 在文本前添加标记：
   - ✅ 需要翻译
   - ⚠️  技术内容（不翻译）  
   - ❌ 已废弃/不需要

2. **分类处理**: 审核完成后运行相应脚本
3. **批量翻译**: 使用 i18n 工作流处理标记为 ✅ 的文本

## 示例标记

\`\`\`markdown
| 行号 | 文本内容 | 上下文预览 |
|------|----------|------------|
| 42 | ✅ Checkpoint Settings | <h3>Checkpoint Settings</h3> |
| 56 | ⚠️ $ARGUMENTS | placeholder="Use $ARGUMENTS for..." |
\`\`\`
`;
  
  fs.writeFileSync(outputFile, report);
  console.log(`\n✅ 扫描完成！`);
  console.log(`📋 报告文件: ${outputFile}`);
  console.log(`📊 共发现 ${totalFindings} 个文本待审核`);
}

main().catch(console.error);