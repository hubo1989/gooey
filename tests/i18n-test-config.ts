// 国际化测试配置
export const I18N_TEST_CONFIG = {
  // 应用URL配置
  baseUrl: 'http://localhost:1420',
  
  // 测试页面路径
  pages: {
    home: '/',
    settings: '/settings',
    projects: '/projects',
    agents: '/agents',
    usage: '/usage',
    mcp: '/mcp'
  },
  
  // 测试超时设置
  timeouts: {
    navigation: 30000, // 导航超时（毫秒）
    element: 10000,    // 元素等待超时
    assertion: 5000    // 断言超时
  },
  
  // 测试重试设置
  retries: {
    maxRetries: 2,     // 最大重试次数
    retryDelay: 1000   // 重试延迟（毫秒）
  },
  
  // 文本检测设置
  textDetection: {
    minTextLength: 2,   // 最小文本长度
    maxTextLength: 100, // 最大文本长度
    excludePatterns: [  // 排除模式
      /^[\d\s\p{P}]+$/u,
      /^.$/,
      /^[A-Z_][A-Z0-9_]*$/, // 常量
      /^[a-z][a-zA-Z0-9]*\.[a-z][a-zA-Z0-9]*$/ // 对象属性
    ]
  },
  
  // 报告设置
  reporting: {
    outputDir: 'test-results',
    screenshots: true,
    videos: false,
    trace: false,
    
    // 报告格式
    formats: ['json', 'html'],
    
    // 详细程度
    verbosity: 'normal' // 'minimal' | 'normal' | 'verbose'
  },
  
  // 浏览器设置
  browser: {
    viewport: {
      width: 1280,
      height: 720
    },
    
    userAgent: 'Playwright I18N Test Runner',
    
    // 浏览器类型
    type: 'chromium' // 'chromium' | 'firefox' | 'webkit'
  },
  
  // 性能监控
  performance: {
    enable: true,
    thresholds: {
      loadTime: 3000,   // 页面加载时间阈值（毫秒）
      responseTime: 1000, // API响应时间阈值
      memoryUsage: 100   // 内存使用阈值（MB）
    }
  },
  
  // 语言设置
  languages: {
    default: 'en',
    supported: ['en', 'zh-CN', 'zh-TW', 'ja', 'ko', 'fr', 'de', 'es', 'it', 'pt', 'ru'],
    
    // 语言切换测试
    switchTest: {
      enabled: true,
      testLanguages: ['en', 'zh-CN'] // 要测试的语言
    }
  },
  
  // 组件特定配置
  components: {
    // 设置页面
    settings: {
      sections: ['analytics', 'tabs', 'welcome', 'export', 'import'],
      
      // 预期存在的元素
      expectedElements: [
        '[data-testid="analytics-section"]',
        '[data-testid="tabs-section"]',
        '[data-testid="welcome-section"]'
      ]
    },
    
    // 项目页面
    projects: {
      expectedElements: [
        '[data-testid="projects-header"]',
        '[data-testid="empty-state"]',
        '[data-testid="project-list"]'
      ]
    },
    
    // 导航栏
    navigation: {
      expectedElements: [
        '[data-testid="main-navigation"]',
        '[data-testid="sidebar"]'
      ]
    }
  },
  
  // 测试数据
  testData: {
    // 示例项目数据
    projects: [
      { name: 'Test Project 1', description: 'A test project for i18n testing' },
      { name: '示例项目 2', description: '用于国际化测试的示例项目' }
    ],
    
    // 示例代理数据
    agents: [
      { name: 'Test Agent', type: 'typescript', description: 'Test agent for i18n' },
      { name: '示例代理', type: 'javascript', description: '用于国际化测试的示例代理' }
    ]
  },
  
  // 环境变量
  environment: {
    // CI环境检测
    isCI: process.env.CI === 'true',
    
    // 开发模式
    isDevelopment: process.env.NODE_ENV === 'development',
    
    // 测试模式
    isTest: process.env.NODE_ENV === 'test'
  }
};

// 获取配置值
export function getConfig<T>(path: string): T | undefined {
  const parts = path.split('.');
  let value: any = I18N_TEST_CONFIG;
  
  for (const part of parts) {
    if (value && typeof value === 'object' && part in value) {
      value = value[part];
    } else {
      return undefined;
    }
  }
  
  return value as T;
}

// 设置配置值
export function setConfig(path: string, value: any): void {
  const parts = path.split('.');
  let config: any = I18N_TEST_CONFIG;
  
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!config[part]) {
      config[part] = {};
    }
    config = config[part];
  }
  
  config[parts[parts.length - 1]] = value;
}

// 验证配置
export function validateConfig(): string[] {
  const errors: string[] = [];
  
  // 检查基本URL
  if (!I18N_TEST_CONFIG.baseUrl) {
    errors.push('baseUrl is required');
  }
  
  // 检查超时设置
  if (I18N_TEST_CONFIG.timeouts.navigation <= 0) {
    errors.push('navigation timeout must be positive');
  }
  
  // 检查浏览器设置
  if (!I18N_TEST_CONFIG.browser.viewport.width || !I18N_TEST_CONFIG.browser.viewport.height) {
    errors.push('browser viewport dimensions are required');
  }
  
  return errors;
}

// 导出默认配置
export default I18N_TEST_CONFIG;