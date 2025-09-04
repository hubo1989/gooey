// i18next-scanner configuration file (CommonJS)

module.exports = {
  options: {
    debug: process.env.NODE_ENV === 'development',
    
    // Identify translation functions
    func: {
      list: ['t', 'i18next.t', 'i18n.t'],
      extensions: ['.tsx', '.ts', '.jsx', '.js']
    },
    
    // Trans component support (disabled due to TypeScript syntax parsing issues)
    trans: false,
    
    // Language and namespace configuration
    lngs: ['en', 'zh-CN', 'zh-TW', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ru', 'it'],
    ns: ['translation'],
    defaultLng: 'en',
    defaultNs: 'translation',
    
    // Resource file configuration
    resource: {
      loadPath: 'src/locales/{{lng}}/translation.json',
      savePath: 'src/locales/{{lng}}/translation.json',
      jsonIndent: 2
    },
    
    // Key separator configuration
    nsSeparator: false,
    keySeparator: false,
    
    // Context information
    context: true,
    contextFallback: true,
    
    // Sort keys
    sort: true
  },
  
  // Input file configuration
  input: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.*',
    '!src/**/*.spec.*',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**'
  ]
};