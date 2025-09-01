import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AnalyticsErrorBoundary } from "./components/AnalyticsErrorBoundary";
import { analytics, resourceMonitor } from "./lib/analytics";
import { PostHogProvider } from "posthog-js/react";
import { i18nInitPromise, default as i18n } from "./lib/i18n"; // 导入i18n配置和初始化promise
import "./assets/shimmer.css";
import "./styles.css";

// Initialize analytics before rendering
analytics.initialize();

// Start resource monitoring (check every 2 minutes)
resourceMonitor.startMonitoring(120000);

// Add a macOS-specific class to the <html> element to enable platform-specific styling
// Browser-safe detection using navigator properties (works in Tauri and web preview)
(() => {
  const isMacLike = typeof navigator !== "undefined" &&
    (navigator.platform?.toLowerCase().includes("mac") ||
      navigator.userAgent?.toLowerCase().includes("mac os x"));
  if (isMacLike) {
    document.documentElement.classList.add("is-macos");
  }
})();

// 设置全局语言事件监听器
const setupLanguageListener = () => {
  const handleLanguageChange = (event: Event) => {
    const customEvent = event as CustomEvent<{language: string}>;
    const newLanguage = customEvent.detail?.language;
    if (newLanguage) {
      document.documentElement.lang = newLanguage;
      
      // 确保i18n实例已正确设置
      if (window.i18n) {
        window.i18n.changeLanguage(newLanguage).catch(console.error);
      }
    }
  };
  
  window.addEventListener('language-changed', handleLanguageChange as EventListener);
};

// 等待i18n初始化完成后再渲染应用
i18nInitPromise.then(() => {
  // 设置语言监听器
  setupLanguageListener();
  
  // 确保初始语言设置正确
  const savedLanguage = localStorage.getItem('i18nextLng') || 
                       localStorage.getItem('preferred_language') || 
                       'en';
  
  if (savedLanguage && savedLanguage !== 'en') {
    document.documentElement.lang = savedLanguage;
    i18n.changeLanguage(savedLanguage).catch(console.error);
  }

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <PostHogProvider
        apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
        options={{
          api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
          defaults: '2025-05-24',
          capture_exceptions: true,
          debug: import.meta.env.MODE === "development",
        }}
      >
        <ErrorBoundary>
          <AnalyticsErrorBoundary>
            <App />
          </AnalyticsErrorBoundary>
        </ErrorBoundary>
      </PostHogProvider>
    </React.StrictMode>,
  );
}).catch((error) => {
  console.error("Failed to initialize i18n:", error);
  // 即使i18n初始化失败，仍然渲染应用（使用默认语言）
  setupLanguageListener();
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <PostHogProvider
        apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
        options={{
          api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
          defaults: '2025-05-24',
          capture_exceptions: true,
          debug: import.meta.env.MODE === "development",
        }}
      >
        <ErrorBoundary>
          <AnalyticsErrorBoundary>
            <App />
          </AnalyticsErrorBoundary>
        </ErrorBoundary>
      </PostHogProvider>
    </React.StrictMode>,
  );
});
