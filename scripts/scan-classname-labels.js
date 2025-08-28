import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 扫描 className="text-" 和 label: " 模式的文本
function scanSpecificPatterns(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const findings = [];
    
    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      
      // 扫描 className="text-" 模式
      const classnameMatches = line.match(/className=\\"[^\"]*text-[^\"]*\\"/g) || 
                               line.match(/className=\"[^\"]*text-[^\"]*\"/g);
      
      if (classnameMatches) {
        classnameMatches.forEach(match => {
          findings.push({
            type: 'className',
            line: lineNumber,
            pattern: match,
            fullLine: line.trim()
          });
        });
      }
      
      // 扫描 label: " 模式
      const labelMatches = line.match(/label:\s*\"[^\"]+\"/g) || 
                          line.match(/label:\s*'[^']+'/g);
      
      if (labelMatches) {
        labelMatches.forEach(match => {
          findings.push({
            type: 'label',
            line: lineNumber,
            pattern: match,
            fullLine: line.trim()
          });
        });
      }
      
      // 扫描包含 text- 的 className（更宽松的匹配）
      const textClassMatches = line.match(/className=[\"'][^\"']*text-[^\"']*[\"']/g);
      if (textClassMatches) {
        textClassMatches.forEach(match => {
          findings.push({
            type: 'text-class',
            line: lineNumber,
            pattern: match,
            fullLine: line.trim()
          });
        });
      }
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
    'src/components/Agents.tsx',
    'src/components/AgentExecution.tsx',
    'src/components/AgentExecutionDemo.tsx',
    'src/components/AgentRunOutputViewer.tsx',
    'src/components/AgentRunsList.tsx',
    'src/components/AgentRunView.tsx'
  ];
  
  const outputFile = path.join(__dirname, '../HARDCODED_TEXTS_SCAN.md');
  
  // 读取现有报告或创建新报告
  let existingReport = '';
  try {
    existingReport = fs.readFileSync(outputFile, 'utf8');
  } catch (error) {
    existingReport = `# 硬编码文本扫描报告

生成时间: ${new Date().toLocaleString('zh-CN')}

## 扫描结果

`;
  }
  
  let report = existingReport;
  
  // 添加新的扫描章节
  report += `
## className="text-" 和 label: " 模式扫描

以下内容包含 className="text-" 和 label: " 模式的文本，供后续筛选：

`;
  
  let totalFindings = 0;
  
  for (const filePath of targetFiles) {
    const fullPath = path.join(__dirname, '..', filePath);
    
    if (fs.existsSync(fullPath)) {
      console.log(`🔍 扫描: ${filePath}`);
      const findings = scanSpecificPatterns(fullPath);
      
      if (findings.length > 0) {
        totalFindings += findings.length;
        
        report += `### ${filePath}

| 类型 | 行号 | 模式内容 | 完整行 |
|------|------|----------|---------|
`;
        
        findings.forEach(({ type, line, pattern, fullLine }) => {
          // 转义表格中的特殊字符
          const safePattern = pattern.replace(/\|/g, '&#124;');
          const safeFullLine = fullLine.replace(/\|/g, '&#124;').replace(/\n/g, ' ');
          
          report += `| ${type} | ${line} | ${safePattern} | ${safeFullLine} |\n`;
        });
        
        report += '\n';
      }
    }
  }
  
  report += `## 统计信息

- 扫描文件数: ${targetFiles.length}
- 发现模式数: ${totalFindings}
- 生成时间: ${new Date().toLocaleString('zh-CN')}

## 后续处理建议

1. **人工审核**: 检查每个模式是否包含需要翻译的文本
2. **提取文本**: 从模式中提取出真正的UI文本内容
3. **分类标记**: 使用表情符号进行分类：
   - ✅ 需要翻译的文本
   - ⚠️  Tailwind class（不翻译）
   - ❌ 技术性内容

## 示例

\`\`\`
className="text-heading-4 font-semibold"  → 可能包含需要翻译的文本
label: "Manual Only"  → 明确需要翻译
className="text-caption text-muted-foreground"  → 纯样式类
\`\`\`
`;
  
  fs.writeFileSync(outputFile, report);
  console.log(`\n✅ 扫描完成！`);
  console.log(`📋 报告已追加到: ${outputFile}`);
  console.log(`📊 共发现 ${totalFindings} 个模式待审核`);
}

main().catch(console.error);