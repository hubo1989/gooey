import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 简单的翻译提取器 - 专注于UI文本
function extractUIText(content) {
  const patterns = [
    /<h[1-6]>([^<]+)<\/h[1-6]>/g,      // 标题
    /<p>([^<]+)<\/p>/g,                // 段落  
    /<span>([^<]+)<\/span>/g,          // span
    /placeholder=["']([^"']+)["']/g,   // 占位符
    /title=["']([^"']+)["']/g,         // title
    /aria-label=["']([^"']+)["']/g,    // aria标签
    />[\s]*([A-Za-z][^<{]+)[\s]*</g,   // 标签间的文本
  ];
  
  const texts = new Set();
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const text = (match[1] || match[0]).trim();
      // 过滤技术性内容和短文本
      if (text.length > 2 && 
          !text.includes('$') &&
          !text.includes('import') &&
          !text.includes('require') &&
          !text.includes('className') &&
          !text.match(/^[A-Za-z0-9_]+\.[A-Za-z0-9_]+$/) &&
          !text.match(/^[0-9]+$/) &&
          text.match(/[A-Za-z]/)) {
        texts.add(text);
      }
    }
  });
  
  return Array.from(texts);
}

async function main() {
  const componentsDir = path.join(__dirname, '../src/components');
  const outputFile = path.join(__dirname, '../src/locales/en/translation.json');
  
  let existing = {};
  try {
    existing = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
  } catch (e) {
    existing = { common: {} };
  }
  
  const allTexts = new Set();
  
  // 读取几个关键组件来演示
  const sampleFiles = [
    'CheckpointSettings.tsx',
    'Topbar.tsx', 
    'Settings.tsx',
    'Agents.tsx'
  ];
  
  for (const file of sampleFiles) {
    const filePath = path.join(componentsDir, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const texts = extractUIText(content);
      texts.forEach(text => allTexts.add(text));
    }
  }
  
  // 添加到common命名空间
  if (!existing.common) existing.common = {};
  Array.from(allTexts).forEach((text, index) => {
    existing.common[`ui_text_${index}`] = text;
  });
  
  // 确保目录存在
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputFile, JSON.stringify(existing, null, 2));
  console.log('✓ 提取了', allTexts.size, '个UI文本');
  console.log('✓ 已保存到', outputFile);
}

main().catch(console.error);