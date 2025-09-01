import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 需要修复的硬编码文本映射
const HARDCODED_TEXT_MAP = {
  // AgentsModal.tsx 中的硬编码文本
  'Agent Management': 'agents.agent_management',
  'Create new agents or manage running agent executions': 'agents.agent_management_description',
  'Available Agents': 'agents.available_agents',
  'Running Agents': 'agents.running_agents',
  'Create Agent': 'buttons.create_agent',
  'Import Agent': 'buttons.import_agent',
  'From File': 'buttons.from_file',
  'From GitHub': 'buttons.from_github',
  'No agents available': 'buttons.no_agents_available',
  'Create your first agent to get started': 'agents.create_first_agent_prompt',
  'Export': 'buttons.export',
  'Delete': 'buttons.delete',
  'Run': 'buttons.run',
  'No running agents': 'buttons.no_running_agents',
  'Agent executions will appear here when started': 'agents.no_running_agents_description',
  'View': 'buttons.view',
  
  // 其他可能存在的硬编码文本
  'Delete Agent': 'buttons.delete_agent',
  'Save Agent': 'buttons.save_agent',
  'Edit Agent': 'buttons.edit_agent',
  'Back to Agents': 'buttons.back_to_agents'
};

// 需要修复的文件列表
const FILES_TO_FIX = [
  'src/components/AgentsModal.tsx',
  'src/components/CreateAgent.tsx',
  'src/components/Agents.tsx',
  'src/components/TabManager.tsx'
];

function fixHardcodedTextsInFile(filePath) {
  try {
    const fullPath = path.join(__dirname, '..', filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ 文件不存在: ${filePath}`);
      return { fixed: 0, errors: 0 };
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    let fixedCount = 0;
    let errorCount = 0;
    
    // 替换硬编码文本
    Object.entries(HARDCODED_TEXT_MAP).forEach(([hardcodedText, translationKey]) => {
      // 创建正则表达式来匹配文本
      const patterns = [
        // 匹配JSX文本内容
        new RegExp(`>\\s*${hardcodedText}\\s*<`, 'g'),
        // 匹配属性值
        new RegExp(`=["']${hardcodedText}["']`, 'g'),
        // 匹配DialogTitle等组件文本
        new RegExp(`<[A-Za-z]+>\\s*${hardcodedText}\\s*<\/[A-Za-z]+>`, 'g')
      ];
      
      patterns.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
          matches.forEach(match => {
            // 根据匹配类型进行替换
            let replacement;
            if (match.includes('="') || match.includes('=\'')) {
              // 属性值替换
              replacement = match.replace(hardcodedText, `{t('${translationKey}')}`);
            } else if (match.includes('><')) {
              // JSX文本替换
              replacement = match.replace(hardcodedText, `{t('${translationKey}')}`);
            } else {
              // 组件文本替换
              replacement = match.replace(hardcodedText, `{t('${translationKey}')}`);
            }
            
            content = content.replace(match, replacement);
            fixedCount++;
            console.log(`✅ 修复: ${hardcodedText} -> ${translationKey}`);
          });
        }
      });
    });
    
    // 保存修复后的文件
    if (fixedCount > 0) {
      fs.writeFileSync(fullPath, content);
      console.log(`📝 已修复 ${filePath} 中的 ${fixedCount} 处文本`);
    }
    
    return { fixed: fixedCount, errors: errorCount };
  } catch (error) {
    console.error(`❌ 修复文件失败: ${filePath}`, error);
    return { fixed: 0, errors: 1 };
  }
}

async function fixAllHardcodedTexts() {
  console.log('🔧 开始修复硬编码文本...');
  
  let totalFixed = 0;
  let totalErrors = 0;
  
  for (const filePath of FILES_TO_FIX) {
    console.log(`\n📄 处理文件: ${filePath}`);
    const result = fixHardcodedTextsInFile(filePath);
    totalFixed += result.fixed;
    totalErrors += result.errors;
  }
  
  console.log(`\n📊 修复完成:`);
  console.log(`✅ 总共修复: ${totalFixed} 处文本`);
  console.log(`❌ 修复错误: ${totalErrors} 处`);
  
  if (totalFixed > 0) {
    console.log('\n🚀 接下来需要:');
    console.log('1. 将新的翻译键添加到翻译文件中');
    console.log('2. 运行测试验证修复');
    console.log('3. 检查UI显示是否正确');
  }
}

// 执行修复
fixAllHardcodedTexts().catch(console.error);