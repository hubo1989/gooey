import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

interface TextAnalysisResult {
  pageUrl: string;
  englishTexts: string[];
  potentialHardcoded: string[];
  missingTranslations: string[];
  timestamp: string;
}

// English text detection patterns
const ENGLISH_PATTERNS = [
  /^[A-Za-z0-9\s.,!?;:'"()\[\]{}<>@#$%^&*\-=+_\\|/~`]+$/,
  /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*$/, // Proper nouns
  /^[a-z]+(?:\s+[a-z]+)*$/, // Lowercase words
  /^[A-Z]+(?:\s+[A-Z]+)*$/, // Uppercase words
  /^\d+\s*[A-Za-z]+$/, // Numbers with text
];

// Common UI text that might be intentionally in English
const COMMON_UI_ENGLISH = [
  'OK', 'Cancel', 'Save', 'Delete', 'Edit', 'Add', 'Remove', 'Close', 'Open',
  'Yes', 'No', 'Loading', 'Error', 'Success', 'Warning', 'Info', 'Settings',
  'Help', 'About', 'Exit', 'Back', 'Next', 'Previous', 'Submit', 'Reset',
  'Search', 'Filter', 'Sort', 'Refresh', 'Update', 'Create', 'New', 'Old',
  'Copy', 'Paste', 'Cut', 'Undo', 'Redo', 'Zoom', 'Print', 'Download', 'Upload'
];

// Technical terms that might remain in English
const TECHNICAL_TERMS = [
  'API', 'URL', 'HTTP', 'HTTPS', 'JSON', 'XML', 'HTML', 'CSS', 'JS', 'TS',
  'SQL', 'DB', 'CPU', 'RAM', 'GPU', 'SSD', 'HDD', 'USB', 'WiFi', 'Bluetooth',
  'PDF', 'DOC', 'XLS', 'PPT', 'ZIP', 'RAR', 'TXT', 'CSV', 'SVG', 'PNG', 'JPG',
  'GIF', 'MP3', 'MP4', 'AVI', 'MKV', 'EXE', 'DLL', 'BAT', 'SH', 'BASH', 'ZSH'
];

function isLikelyEnglish(text: string): boolean {
  if (!text.trim()) return false;
  
  const trimmedText = text.trim();
  
  // Skip very short texts (likely icons or symbols)
  if (trimmedText.length <= 2) return false;
  
  // Check against common patterns
  return ENGLISH_PATTERNS.some(pattern => pattern.test(trimmedText));
}

function isCommonUIText(text: string): boolean {
  return COMMON_UI_ENGLISH.includes(text.trim());
}

function isTechnicalTerm(text: string): boolean {
  return TECHNICAL_TERMS.includes(text.trim().toUpperCase());
}

function shouldSkipText(text: string): boolean {
  const trimmed = text.trim();
  
  // Skip empty or very short texts
  if (!trimmed || trimmed.length <= 1) return true;
  
  // Skip numeric only texts
  if (/^\d+$/.test(trimmed)) return true;
  
  // Skip common punctuation and symbols
  if (/^[.,!?;:()\[\]{}<>@#$%^&*\-=+_\\|/~`]+$/.test(trimmed)) return true;
  
  // Skip URLs and email addresses
  if (/^(https?:\/\/|www\.|mailto:|@)/.test(trimmed)) return true;
  
  return false;
}

async function navigateToAllPages(page: any): Promise<string[]> {
  const visitedUrls = new Set<string>();
  const pagesToVisit = ['/'];
  
  while (pagesToVisit.length > 0) {
    const currentUrl = pagesToVisit.pop()!;
    
    if (visitedUrls.has(currentUrl)) continue;
    visitedUrls.add(currentUrl);
    
    try {
      await page.goto(`http://localhost:1420${currentUrl}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Extract all links from the current page
      const links = await page.$$eval('a[href]', (anchors: HTMLAnchorElement[]) => 
        anchors.map(a => a.getAttribute('href')).filter(Boolean) as string[]
      );
      
      // Add new links to visit (filter out external links and already visited)
      for (const link of links) {
        if (link.startsWith('/') && !visitedUrls.has(link) && !pagesToVisit.includes(link)) {
          pagesToVisit.push(link);
        }
      }
      
    } catch (error) {
      console.warn(`Failed to navigate to ${currentUrl}:`, error);
    }
  }
  
  return Array.from(visitedUrls);
}

async function analyzePageText(page: any, url: string): Promise<TextAnalysisResult> {
  console.log(`Analyzing page: ${url}`);
  
  await page.goto(`http://localhost:1420${url}`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Get all visible text content
  const allText = await page.$$eval('*', (elements: Element[]) => {
    const texts: string[] = [];
    
    elements.forEach(element => {
      // Skip script and style elements
      if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') return;
      
      // Get text content and split by lines
      const textContent = element.textContent?.trim();
      if (textContent) {
        textContent.split('\n').forEach(line => {
          const trimmed = line.trim();
          if (trimmed) texts.push(trimmed);
        });
      }
    });
    
    return [...new Set(texts)]; // Remove duplicates
  });
  
  const englishTexts: string[] = [];
  const potentialHardcoded: string[] = [];
  const missingTranslations: string[] = [];
  
  for (const text of allText) {
    if (shouldSkipText(text)) continue;
    
    if (isLikelyEnglish(text)) {
      englishTexts.push(text);
      
      // Classify the English text
      if (isCommonUIText(text) || isTechnicalTerm(text)) {
        potentialHardcoded.push(text);
      } else {
        missingTranslations.push(text);
      }
    }
  }
  
  return {
    pageUrl: url,
    englishTexts,
    potentialHardcoded,
    missingTranslations,
    timestamp: new Date().toISOString()
  };
}

test.describe('Text Content Analysis', () => {
  test('analyze all pages for English text content', async ({ page }) => {
    const results: TextAnalysisResult[] = [];
    const outputDir = path.join(process.cwd(), 'tests', 'text-analysis-results');
    
    // Create output directory
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Navigate to homepage first
    await page.goto('http://localhost:1420');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Discover all pages
    const allPages = await navigateToAllPages(page);
    console.log(`Found ${allPages.length} pages to analyze:`, allPages);
    
    // Analyze each page
    for (const pageUrl of allPages) {
      try {
        const result = await analyzePageText(page, pageUrl);
        results.push(result);
        
        // Save individual page results
        const filename = `page-analysis-${pageUrl.replace(/[^a-zA-Z0-9]/g, '-')}.json`;
        fs.writeFileSync(
          path.join(outputDir, filename),
          JSON.stringify(result, null, 2),
          'utf-8'
        );
        
        console.log(`Page ${pageUrl}: Found ${result.englishTexts.length} English texts`);
        
      } catch (error) {
        console.error(`Error analyzing page ${pageUrl}:`, error);
      }
    }
    
    // Generate summary report
    const summary = {
      totalPagesAnalyzed: results.length,
      totalEnglishTexts: results.reduce((sum, r) => sum + r.englishTexts.length, 0),
      totalPotentialHardcoded: results.reduce((sum, r) => sum + r.potentialHardcoded.length, 0),
      totalMissingTranslations: results.reduce((sum, r) => sum + r.missingTranslations.length, 0),
      pages: results.map(r => ({
        url: r.pageUrl,
        englishTextsCount: r.englishTexts.length,
        hardcodedCount: r.potentialHardcoded.length,
        missingTranslationsCount: r.missingTranslations.length
      })),
      detailedResults: results,
      analysisDate: new Date().toISOString()
    };
    
    // Save summary report
    fs.writeFileSync(
      path.join(outputDir, 'summary-report.json'),
      JSON.stringify(summary, null, 2),
      'utf-8'
    );
    
    // Generate CSV report for easy analysis
    const csvHeader = 'Page URL,English Text,Type\n';
    const csvLines = results.flatMap(result => 
      result.englishTexts.map(text => {
        const type = result.potentialHardcoded.includes(text) ? 'Hardcoded' : 'Missing Translation';
        return `"${result.pageUrl}","${text.replace(/"/g, '""')}","${type}"`;
      })
    );
    
    fs.writeFileSync(
      path.join(outputDir, 'detailed-analysis.csv'),
      csvHeader + csvLines.join('\n'),
      'utf-8'
    );
    
    console.log('Analysis completed!');
    console.log(`Total pages analyzed: ${summary.totalPagesAnalyzed}`);
    console.log(`Total English texts found: ${summary.totalEnglishTexts}`);
    console.log(`Potential hardcoded texts: ${summary.totalPotentialHardcoded}`);
    console.log(`Missing translations: ${summary.totalMissingTranslations}`);
    console.log(`Reports saved to: ${outputDir}`);
    
    // Assert that we found some pages to analyze
    expect(results.length).toBeGreaterThan(0);
  });
});