# iflow.md

This file provides guidance to (iflow/code) when working with code in this repository.

# CLAUDE.md

This file provides guidance to iflow (iflow/code) when working with code in this repository.

## AI Guidance

* Ignore GEMINI.md and GEMINI-*.md files
* To save main context space, for code searches, inspections, troubleshooting or analysis, use code-searcher subagent where appropriate - giving the subagent full context background for the task(s) you assign it.
* After receiving tool results, carefully reflect on their quality and determine optimal next steps before proceeding. Use your thinking to plan and iterate based on this new information, and then take the best next action.
* For maximum efficiency, whenever you need to perform multiple independent operations, invoke all relevant tools simultaneously rather than sequentially.
* Before you finish, please verify your solution
* Do what has been asked; nothing more, nothing less.
* NEVER create files unless they're absolutely necessary for achieving your goal.
* ALWAYS prefer editing an existing file to creating a new one.
* NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
* When you update or modify core context files, also update markdown documentation and memory bank
* When asked to commit changes, exclude CLAUDE.md and CLAUDE-*.md referenced memory bank system files from any commits. Never delete these files.

## Memory Bank System

This project uses a structured memory bank system with specialized context files. Always check these files for relevant information before starting work:

### Core Context Files

* **CLAUDE-activeContext.md** - Current session state, goals, and progress (if exists)
* **CLAUDE-patterns.md** - Established code patterns and conventions (if exists)
* **CLAUDE-decisions.md** - Architecture decisions and rationale (if exists)
* **CLAUDE-troubleshooting.md** - Common issues and proven solutions (if exists)
* **CLAUDE-config-variables.md** - Configuration variables reference (if exists)
* **CLAUDE-temp.md** - Temporary scratch pad (only read when referenced)

**Important:** Always reference the active context file first to understand what's currently being worked on and maintain session continuity.

### Memory Bank System Backups

When asked to backup Memory Bank System files, you will copy the core context files above and @.claude settings directory to directory @/path/to/backup-directory. If files already exist in the backup directory, you will overwrite them.

## Project Overview

This file provides guidance to iflow (iflow/code) when working with code in this repository.

此文件为iflow (iflow/code) 提供在本代码库中工作的指导。

## Project Overview

Gooey is a desktop GUI application and toolkit for iflow built with Tauri 2. It provides a visual interface for managing iflow projects, sessions, custom agents, usage analytics, MCP servers, and checkpoint management.My forked is for the purpose of supporting multilingual display.

## 项目概述 (Project Overview)

Gooey是一个基于Tauri 2构建的桌面GUI应用程序和工具包，专为iflow设计。它提供了一个可视化界面，用于管理iflow项目、会话、自定义代理、使用分析、MCP服务器和检查点管理。我的这个副本是为了支持多语言展示。

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite 6
- **Backend**: Rust with Tauri 2
- **UI Framework**: Tailwind CSS v4 + shadcn/ui
- **Database**: SQLite (via rusqlite)
- **Package Manager**: Bun

## 技术栈 (Tech Stack)

- **前端 (Frontend)**: React 18 + TypeScript + Vite 6
- **后端 (Backend)**: Rust with Tauri 2
- **UI框架 (UI Framework)**: Tailwind CSS v4 + shadcn/ui
- **数据库 (Database)**: SQLite (通过rusqlite)
- **包管理器 (Package Manager)**: Bun

## Project Structure

```
gooy/
├── src/                   # React frontend
│   ├── components/        # UI components
│   ├── lib/               # API client & utilities
│   └── assets/            # Static assets
├── src-tauri/             # Rust backend
│   ├── src/
│   │   ├── commands/      # Tauri command handlers
│   │   ├── checkpoint/    # Timeline management
│   │   └── process/       # Process management
│   └── tests/             # Rust test suite
└── public/                # Public assets
```

## 项目结构 (Project Structure)

```
gooy/
├── src/                   # React前端
│   ├── components/        # UI组件
│   ├── lib/               # API客户端和工具
│   └── assets/            # 静态资源
├── src-tauri/             # Rust后端
│   ├── src/
│   │   ├── commands/      # Tauri命令处理器
│   │   ├── checkpoint/    # 时间线管理
│   │   └── process/       # 进程管理
│   └── tests/             # Rust测试套件
└── public/                # 公共资源
```

## Development Commands

```bash
# Start development server with hot reload
bun run tauri dev

# Run frontend only (for UI development)
bun run dev

# Type checking
bunx tsc --noEmit

# Run Rust tests
cd src-tauri && cargo test

# Format Rust code
cd src-tauri && cargo fmt

# Check Rust code without building
cd src-tauri && cargo check

# Run both TypeScript and Rust checks
bun run check
```

## 开发命令 (Development Commands)

```bash
# 启动开发服务器（热重载）
bun run tauri dev

# 仅运行前端（用于UI开发）
bun run dev

# 类型检查
bunx tsc --noEmit

# 运行Rust测试
cd src-tauri && cargo test

# 格式化Rust代码
cd src-tauri && cargo fmt

# 检查Rust代码（不构建）
cd src-tauri && cargo check

# 同时运行TypeScript和Rust检查
bun run check
```

## Build Commands

```bash
# Production build
bun run tauri build

# Debug build (faster compilation)
bun run tauri build --debug

# Universal binary for macOS (Intel + Apple Silicon)
bun run tauri build --target universal-apple-darwin
```

## 构建命令 (Build Commands)

```bash
# 生产构建
bun run tauri build

# 调试构建（编译更快）
bun run tauri build --debug

# 通用二进制文件（macOS Intel + Apple Silicon）
bun run tauri build --target universal-apple-darwin
```

## Architecture Overview

The application follows a frontend-backend architecture where:

1. **Frontend (React/TypeScript)**: Handles UI rendering and user interactions
2. **Backend (Rust/Tauri)**: Provides system-level functionality, file operations, process management, and database access

Communication between frontend and backend happens through Tauri's invoke system, with Rust functions exposed as commands that can be called from the frontend.

## 架构概述 (Architecture Overview)

应用程序采用前后端架构：

1. **前端 (React/TypeScript)**: 处理UI渲染和用户交互
2. **后端 (Rust/Tauri)**: 提供系统级功能、文件操作、进程管理和数据库访问

前后端之间的通信通过Tauri的invoke系统实现，Rust函数作为命令暴露给前端调用。

### Key Backend Modules

- **commands/**: Contains all Tauri command handlers organized by feature:

  - `agents.rs`: Custom agent management and execution
  - `claude.rs`: iflow session and project management
  - `mcp.rs`: Model Context Protocol server management
  - `usage.rs`: Usage analytics and statistics
  - `storage.rs`: Database operations and management
- `proxy.rs`: Proxy configuration management
- `slash_commands.rs`: Custom slash command management
- **checkpoint/**: Checkpoint and timeline management for session versioning
- **process/**: Process registry for managing running iflow and agent sessions
- **claude_binary.rs**: iflow binary detection and management

### 关键后端模块 (Key Backend Modules)

- **commands/**: 包含按功能组织的所有Tauri命令处理器：

  - `agents.rs`: 自定义代理管理和执行
  - `claude.rs`: iflow会话和项目管理
  - `mcp.rs`: 模型上下文协议服务器管理
  - `usage.rs`: 使用分析和统计
  - `storage.rs`: 数据库操作和管理
  - `proxy.rs`: 代理配置管理
  - `slash_commands.rs`: 自定义斜杠命令管理
- **checkpoint/**: 检查点和时间线管理，用于会话版本控制
- **process/**: 进程注册表，用于管理运行的iflow和代理会话
- **claude_binary.rs**: iflow二进制检测和管理

### Key Frontend Components

- **Agent Management**: Components for creating, editing, and running custom agents
- **Project Browser**: UI for browsing iflow projects and sessions
- **Checkpoint Timeline**: Visual timeline for session versioning and restoration
- **Usage Dashboard**: Analytics dashboard for tracking iflow usage
- **MCP Manager**: Interface for managing Model Context Protocol servers
- **Settings**: Application configuration and preferences

### 关键前端组件 (Key Frontend Components)

- **代理管理 (Agent Management)**: 用于创建、编辑和运行自定义代理的组件
- **项目浏览器 (Project Browser)**: 用于浏览iflow项目和会话的UI
- **检查点时间线 (Checkpoint Timeline)**: 用于会话版本控制和恢复的可视化时间线
- **使用仪表板 (Usage Dashboard)**: 用于跟踪iflow使用情况的分析仪表板
- **MCP管理器 (MCP Manager)**: 用于管理模型上下文协议服务器的界面
- **设置 (Settings)**: 应用程序配置和首选项

## Database Schema

The application uses SQLite for data persistence with multiple tables:

- Agent configurations and runs
- Session history and checkpoints
- Usage statistics
- MCP server configurations
- Application settings
- Slash command definitions

## 数据库架构 (Database Schema)

应用程序使用SQLite进行数据持久化，包含多个表：

- 代理配置和运行记录
- 会话历史和检查点
- 使用统计
- MCP服务器配置
- 应用程序设置
- 斜杠命令定义

## Key Features

1. **Project & Session Management**: Visual browsing of iflow projects and sessions
2. **CC Agents**: Custom AI agents with background execution capabilities
3. **Usage Analytics**: Cost tracking and token usage visualization
4. **MCP Server Management**: Model Context Protocol server configuration
5. **Timeline & Checkpoints**: Session versioning with branching timeline
6. **CLAUDE.md Management**: Built-in editor for project configuration files

## 关键功能 (Key Features)

1. **项目和会话管理 (Project & Session Management)**: 可视化浏览iflow项目和会话
2. **CC代理 (CC Agents)**: 具有后台执行能力的自定义AI代理
3. **使用分析 (Usage Analytics)**: 成本跟踪和令牌使用可视化
4. **MCP服务器管理 (MCP Server Management)**: 模型上下文协议服务器配置
5. **时间线和检查点 (Timeline & Checkpoints)**: 具有分支时间线的会话版本控制
6. **CLAUDE.md管理 (CLAUDE.md Management)**: 项目配置文件的内置编辑器

## Security Model

- Process isolation for agents
- Permission control per agent
- Local data storage only
- No telemetry or data collection

## 安全模型 (Security Model)

- 代理的进程隔离
- 每个代理的权限控制
- 仅本地数据存储
- 无遥测或数据收集

## 阶段目标：实现翻译功能

仅翻译中文，其他语言通过languine的同步功能进行处理

## AI Guidance

* Ignore GEMINI.md and GEMINI-*.md files
* To save main context space, for code searches, inspections, troubleshooting or analysis, use code-searcher subagent where appropriate - giving the subagent full context background for the task(s) you assign it.
* After receiving tool results, carefully reflect on their quality and determine optimal next steps before proceeding. Use your thinking to plan and iterate based on this new information, and then take the best next action.
* For maximum efficiency, whenever you need to perform multiple independent operations, invoke all relevant tools simultaneously rather than sequentially.
* Before you finish, please verify your solution
* Do what has been asked; nothing more, nothing less.
* NEVER create files unless they're absolutely necessary for achieving your goal.
* ALWAYS prefer editing an existing file to creating a new one.
* NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
* When you update or modify core context files, also update markdown documentation and memory bank
* When asked to commit changes, exclude CLAUDE.md and CLAUDE-*.md referenced memory bank system files from any commits. Never delete these files.

## Memory Bank System

This project uses a structured memory bank system with specialized context files. Always check these files for relevant information before starting work:

### Core Context Files

* **CLAUDE-activeContext.md** - Current session state, goals, and progress (if exists)
* **CLAUDE-patterns.md** - Established code patterns and conventions (if exists)
* **CLAUDE-decisions.md** - Architecture decisions and rationale (if exists)
* **CLAUDE-troubleshooting.md** - Common issues and proven solutions (if exists)
* **CLAUDE-config-variables.md** - Configuration variables reference (if exists)
* **CLAUDE-temp.md** - Temporary scratch pad (only read when referenced)

**Important:** Always reference the active context file first to understand what's currently being worked on and maintain session continuity.

### Memory Bank System Backups

When asked to backup Memory Bank System files, you will copy the core context files above and @.claude settings directory to directory @/path/to/backup-directory. If files already exist in the backup directory, you will overwrite them.

## Project Overview

This file provides guidance to iflow (iflow/code) when working with code in this repository.

此文件为iflow (iflow/code) 提供在本代码库中工作的指导。

## Project Overview

Gooey is a desktop GUI application and toolkit for iflow built with Tauri 2. It provides a visual interface for managing iflow projects, sessions, custom agents, usage analytics, MCP servers, and checkpoint management.My forked is for the purpose of supporting multilingual display.

## 项目概述 (Project Overview)

Gooey是一个基于Tauri 2构建的桌面GUI应用程序和工具包，专为iflow设计。它提供了一个可视化界面，用于管理iflow项目、会话、自定义代理、使用分析、MCP服务器和检查点管理。我的这个副本是为了支持多语言展示。

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite 6
- **Backend**: Rust with Tauri 2
- **UI Framework**: Tailwind CSS v4 + shadcn/ui
- **Database**: SQLite (via rusqlite)
- **Package Manager**: Bun

## 技术栈 (Tech Stack)

- **前端 (Frontend)**: React 18 + TypeScript + Vite 6
- **后端 (Backend)**: Rust with Tauri 2
- **UI框架 (UI Framework)**: Tailwind CSS v4 + shadcn/ui
- **数据库 (Database)**: SQLite (通过rusqlite)
- **包管理器 (Package Manager)**: Bun

## Project Structure

```
gooy/
├── src/                   # React frontend
│   ├── components/        # UI components
│   ├── lib/               # API client & utilities
│   └── assets/            # Static assets
├── src-tauri/             # Rust backend
│   ├── src/
│   │   ├── commands/      # Tauri command handlers
│   │   ├── checkpoint/    # Timeline management
│   │   └── process/       # Process management
│   └── tests/             # Rust test suite
└── public/                # Public assets
```

## 项目结构 (Project Structure)

```
gooy/
├── src/                   # React前端
│   ├── components/        # UI组件
│   ├── lib/               # API客户端和工具
│   └── assets/            # 静态资源
├── src-tauri/             # Rust后端
│   ├── src/
│   │   ├── commands/      # Tauri命令处理器
│   │   ├── checkpoint/    # 时间线管理
│   │   └── process/       # 进程管理
│   └── tests/             # Rust测试套件
└── public/                # 公共资源
```

## Development Commands

```bash
# Start development server with hot reload
bun run tauri dev

# Run frontend only (for UI development)
bun run dev

# Type checking
bunx tsc --noEmit

# Run Rust tests
cd src-tauri && cargo test

# Format Rust code
cd src-tauri && cargo fmt

# Check Rust code without building
cd src-tauri && cargo check

# Run both TypeScript and Rust checks
bun run check
```

## 开发命令 (Development Commands)

```bash
# 启动开发服务器（热重载）
bun run tauri dev

# 仅运行前端（用于UI开发）
bun run dev

# 类型检查
bunx tsc --noEmit

# 运行Rust测试
cd src-tauri && cargo test

# 格式化Rust代码
cd src-tauri && cargo fmt

# 检查Rust代码（不构建）
cd src-tauri && cargo check

# 同时运行TypeScript和Rust检查
bun run check
```

## Build Commands

```bash
# Production build
bun run tauri build

# Debug build (faster compilation)
bun run tauri build --debug

# Universal binary for macOS (Intel + Apple Silicon)
bun run tauri build --target universal-apple-darwin
```

## 构建命令 (Build Commands)

```bash
# 生产构建
bun run tauri build

# 调试构建（编译更快）
bun run tauri build --debug

# 通用二进制文件（macOS Intel + Apple Silicon）
bun run tauri build --target universal-apple-darwin
```

## Architecture Overview

The application follows a frontend-backend architecture where:

1. **Frontend (React/TypeScript)**: Handles UI rendering and user interactions
2. **Backend (Rust/Tauri)**: Provides system-level functionality, file operations, process management, and database access

Communication between frontend and backend happens through Tauri's invoke system, with Rust functions exposed as commands that can be called from the frontend.

## 架构概述 (Architecture Overview)

应用程序采用前后端架构：

1. **前端 (React/TypeScript)**: 处理UI渲染和用户交互
2. **后端 (Rust/Tauri)**: 提供系统级功能、文件操作、进程管理和数据库访问

前后端之间的通信通过Tauri的invoke系统实现，Rust函数作为命令暴露给前端调用。

### Key Backend Modules

- **commands/**: Contains all Tauri command handlers organized by feature:

  - `agents.rs`: Custom agent management and execution
  - `claude.rs`: iflow session and project management
  - `mcp.rs`: Model Context Protocol server management
  - `usage.rs`: Usage analytics and statistics
  - `storage.rs`: Database operations and management
- `proxy.rs`: Proxy configuration management
- `slash_commands.rs`: Custom slash command management
- **checkpoint/**: Checkpoint and timeline management for session versioning
- **process/**: Process registry for managing running iflow and agent sessions
- **claude_binary.rs**: iflow binary detection and management

### 关键后端模块 (Key Backend Modules)

- **commands/**: 包含按功能组织的所有Tauri命令处理器：

  - `agents.rs`: 自定义代理管理和执行
  - `claude.rs`: iflow会话和项目管理
  - `mcp.rs`: 模型上下文协议服务器管理
  - `usage.rs`: 使用分析和统计
  - `storage.rs`: 数据库操作和管理
  - `proxy.rs`: 代理配置管理
  - `slash_commands.rs`: 自定义斜杠命令管理
- **checkpoint/**: 检查点和时间线管理，用于会话版本控制
- **process/**: 进程注册表，用于管理运行的iflow和代理会话
- **claude_binary.rs**: iflow二进制检测和管理

### Key Frontend Components

- **Agent Management**: Components for creating, editing, and running custom agents
- **Project Browser**: UI for browsing iflow projects and sessions
- **Checkpoint Timeline**: Visual timeline for session versioning and restoration
- **Usage Dashboard**: Analytics dashboard for tracking iflow usage
- **MCP Manager**: Interface for managing Model Context Protocol servers
- **Settings**: Application configuration and preferences

### 关键前端组件 (Key Frontend Components)

- **代理管理 (Agent Management)**: 用于创建、编辑和运行自定义代理的组件
- **项目浏览器 (Project Browser)**: 用于浏览iflow项目和会话的UI
- **检查点时间线 (Checkpoint Timeline)**: 用于会话版本控制和恢复的可视化时间线
- **使用仪表板 (Usage Dashboard)**: 用于跟踪iflow使用情况的分析仪表板
- **MCP管理器 (MCP Manager)**: 用于管理模型上下文协议服务器的界面
- **设置 (Settings)**: 应用程序配置和首选项

## Database Schema

The application uses SQLite for data persistence with multiple tables:

- Agent configurations and runs
- Session history and checkpoints
- Usage statistics
- MCP server configurations
- Application settings
- Slash command definitions

## 数据库架构 (Database Schema)

应用程序使用SQLite进行数据持久化，包含多个表：

- 代理配置和运行记录
- 会话历史和检查点
- 使用统计
- MCP服务器配置
- 应用程序设置
- 斜杠命令定义

## Key Features

1. **Project & Session Management**: Visual browsing of iflow projects and sessions
2. **CC Agents**: Custom AI agents with background execution capabilities
3. **Usage Analytics**: Cost tracking and token usage visualization
4. **MCP Server Management**: Model Context Protocol server configuration
5. **Timeline & Checkpoints**: Session versioning with branching timeline
6. **CLAUDE.md Management**: Built-in editor for project configuration files

## 关键功能 (Key Features)

1. **项目和会话管理 (Project & Session Management)**: 可视化浏览iflow项目和会话
2. **CC代理 (CC Agents)**: 具有后台执行能力的自定义AI代理
3. **使用分析 (Usage Analytics)**: 成本跟踪和令牌使用可视化
4. **MCP服务器管理 (MCP Server Management)**: 模型上下文协议服务器配置
5. **时间线和检查点 (Timeline & Checkpoints)**: 具有分支时间线的会话版本控制
6. **CLAUDE.md管理 (CLAUDE.md Management)**: 项目配置文件的内置编辑器

## Security Model

- Process isolation for agents
- Permission control per agent
- Local data storage only
- No telemetry or data collection

## 安全模型 (Security Model)

- 代理的进程隔离
- 每个代理的权限控制
- 仅本地数据存储
- 无遥测或数据收集

## 阶段目标：实现翻译功能

仅翻译中文，其他语言通过languine的同步功能进行处理
