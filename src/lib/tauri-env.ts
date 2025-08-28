/**
 * Tauri环境检测工具函数
 * 用于检测当前是否在Tauri环境中运行，避免浏览器预览时API调用失败
 */

/**
 * 检测是否在Tauri环境中运行
 * @returns 如果在Tauri环境中返回true，否则返回false
 */
export function isTauriEnvironment(): boolean {
  return typeof window !== 'undefined' && 
         '__TAURI__' in window && 
         typeof window.__TAURI__ !== 'undefined';
}

/**
 * 安全调用Tauri API函数
 * @param invokeFn - 要调用的Tauri API函数
 * @param fallbackValue - 非Tauri环境下的默认返回值
 * @param errorMessage - 错误信息（可选）
 * @returns Promise解析为调用结果或默认值
 */
export async function safeInvoke<T>(
  invokeFn: () => Promise<T>,
  fallbackValue: T,
  errorMessage?: string
): Promise<T> {
  if (!isTauriEnvironment()) {
    console.warn('Tauri环境不可用，使用默认值:', fallbackValue);
    return fallbackValue;
  }
  
  try {
    return await invokeFn();
  } catch (error) {
    console.error(errorMessage || 'Tauri API调用失败:', error);
    return fallbackValue;
  }
}

/**
 * 获取当前环境信息
 * @returns 环境信息对象
 */
export function getEnvironmentInfo() {
  const isTauri = isTauriEnvironment();
  const isBrowser = typeof window !== 'undefined' && !isTauri;
  const isNode = typeof process !== 'undefined' && process.versions?.node;
  
  return {
    isTauri,
    isBrowser,
    isNode,
    environment: isTauri ? 'tauri' : isBrowser ? 'browser' : isNode ? 'node' : 'unknown'
  };
}