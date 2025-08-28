// i18next-scanner 配置文件 (CommonJS)
// 与 Languine 协同工作，专注于字符串提取

module.exports = {
  options: {
    debug: process.env.NODE_ENV === 'development',
    
    // 识别翻译函数
    func: {
      list: ['t', 'i18next.t', 'i18n.t'],
      extensions: ['.tsx', '.ts', '.jsx', '.js']
    },
    
    // Trans 组件支持（暂时禁用，因为TypeScript语法解析有问题）
    trans: false,
    
    // 语言和命名空间配置（与Languine保持一致）
    lngs: ['en'],  // 只提取英文，翻译由Languine处理
    ns: ['translation'],
    defaultLng: 'en',
    defaultNs: 'translation',
    
    // 资源文件配置（与Languine输出路径一致）
    resource: {
      loadPath: 'src/locales/{{lng}}/translation.json',
      savePath: 'src/locales/{{lng}}/translation.json',
      jsonIndent: 2
    },
    
    // 键分隔符配置
    nsSeparator: false,
    keySeparator: false,
    
    // 上下文信息
    context: true,
    contextFallback: true,
    
    // 排序键名
    sort: true
  },
  
  // 输入文件配置（与Languine提取模式一致）
  input: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.*',
    '!src/**/*.spec.*',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**'
  ]
};