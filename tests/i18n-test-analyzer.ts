import { matchesUIPattern, shouldExclude } from './i18n-test-patterns';

export interface AnalysisResult {
  hardcodedTexts: string[];
  missingTranslationTexts: string[];
  totalTexts: number;
  hardcodedPercentage: number;
}

// 分析硬编码文本的主要函数
export function analyzeHardcodedTexts(
  texts: string[], 
  knownTranslationKeys: Set<string>,
  uiPatterns: RegExp[]
): AnalysisResult {
  const hardcodedTexts: string[] = [];
  const missingTranslationTexts: string[] = [];
  
  const uniqueTexts = [...new Set(texts)];
  
  uniqueTexts.forEach(text => {
    // 跳过空文本和排除模式
    if (!text || text.trim().length < 2 || shouldExclude(text)) {
      return;
    }
    
    const cleanText = text.trim();
    
    // 检查是否为已知翻译键
    if (knownTranslationKeys.has(cleanText)) {
      return;
    }
    
    // 检查是否匹配UI模式
    if (matchesUIPattern(cleanText)) {
      hardcodedTexts.push(cleanText);
      return;
    }
    
    // 检查是否为英文文本（简单的启发式检查）
    if (isLikelyEnglishText(cleanText)) {
      missingTranslationTexts.push(cleanText);
    }
  });
  
  const total = uniqueTexts.length;
  const percentage = total > 0 ? (hardcodedTexts.length / total) * 100 : 0;
  
  return {
    hardcodedTexts: hardcodedTexts.sort(),
    missingTranslationTexts: missingTranslationTexts.sort(),
    totalTexts: total,
    hardcodedPercentage: parseFloat(percentage.toFixed(2))
  };
}

// 简单的英文文本检测（启发式方法）
function isLikelyEnglishText(text: string): boolean {
  // 包含常见英文单词
  const commonEnglishWords = [
    'the', 'and', 'for', 'with', 'this', 'that', 'from', 'have', 'will', 'your',
    'are', 'not', 'but', 'what', 'all', 'can', 'how', 'when', 'where', 'why'
  ];
  
  // 检查是否包含常见英文单词
  const hasEnglishWord = commonEnglishWords.some(word => 
    text.toLowerCase().includes(word.toLowerCase())
  );
  
  // 检查是否为句子结构（包含空格和标点）
  const hasSentenceStructure = text.includes(' ') && 
    (text.includes('.') || text.includes('?') || text.includes('!'));
  
  // 检查是否包含常见英文短语模式
  const englishPhrasePatterns = [
    /^[A-Z][a-z]/,
    /ing$/,
    /ed$/,
    /s$/
  ];
  
  const matchesEnglishPattern = englishPhrasePatterns.some(pattern => 
    pattern.test(text)
  );
  
  return hasEnglishWord || hasSentenceStructure || matchesEnglishPattern;
}

// 生成详细的检测报告
export function generateDetailedReport(result: AnalysisResult): string {
  let report = `=== 国际化检测详细报告 ===\n`;
  report += `总文本数量: ${result.totalTexts}\n`;
  report += `硬编码文本数量: ${result.hardcodedTexts.length}\n`;
  report += `可能缺少翻译的文本: ${result.missingTranslationTexts.length}\n`;
  report += `硬编码比例: ${result.hardcodedPercentage}%\n\n`;
  
  if (result.hardcodedTexts.length > 0) {
    report += `发现的硬编码文本:\n`;
    result.hardcodedTexts.forEach((text, index) => {
      report += `${index + 1}. ${text}\n`;
    });
    report += '\n';
  }
  
  if (result.missingTranslationTexts.length > 0) {
    report += `可能需要添加翻译的文本:\n`;
    result.missingTranslationTexts.forEach((text, index) => {
      report += `${index + 1}. ${text}\n`;
    });
  }
  
  return report;
}

// 导出CSV格式的报告
export function generateCSVReport(result: AnalysisResult): string {
  let csv = 'Type,Text\n';
  
  result.hardcodedTexts.forEach(text => {
    csv += `Hardcoded,"${text.replace(/"/g, '""')}"\n`;
  });
  
  result.missingTranslationTexts.forEach(text => {
    csv += `Missing Translation,"${text.replace(/"/g, '""')}"\n`;
  });
  
  return csv;
}

// 比较两次检测结果
export function compareResults(
  previous: AnalysisResult, 
  current: AnalysisResult
): { improved: boolean; changes: string } {
  const hardcodedImproved = current.hardcodedTexts.length < previous.hardcodedTexts.length;
  const missingImproved = current.missingTranslationTexts.length < previous.missingTranslationTexts.length;
  
  let changes = '';
  
  if (hardcodedImproved) {
    changes += `硬编码文本减少了 ${previous.hardcodedTexts.length - current.hardcodedTexts.length} 个\n`;
  }
  
  if (missingImproved) {
    changes += `缺少翻译的文本减少了 ${previous.missingTranslationTexts.length - current.missingTranslationTexts.length} 个\n`;
  }
  
  return {
    improved: hardcodedImproved || missingImproved,
    changes
  };
}