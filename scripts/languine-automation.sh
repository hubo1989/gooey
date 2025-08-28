#!/bin/bash

# Languine 自动化翻译工作流
set -e

echo "🚀 Starting Languine automation workflow..."

# 1. 提取新的翻译字符串
echo "📦 Extracting new translation strings..."
bun run scripts/extract-translations.js

# 2. 推送翻译到 Languine 平台
echo "📤 Pushing translations to Languine..."
npx @languine/cli push

# 3. 检查是否有新的翻译可拉取
echo "📥 Checking for new translations..."
npx @languine/cli pull --dry-run

# 4. 如果有更新，拉取并创建 PR
echo "🔄 Pulling translations and creating PR..."
npx @languine/cli sync

echo "✅ Languine automation completed successfully!"