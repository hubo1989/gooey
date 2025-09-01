# Gooey Project Context

## Overview
Gooey is a powerful desktop GUI application and toolkit for Claude Code, built with Tauri 2. It provides a visual interface for managing Claude Code sessions, creating custom agents, tracking usage, and more. The application bridges the gap between the command-line tool and a visual experience for AI-assisted development.

## Technologies
- **Frontend**: React 18 + TypeScript + Vite 6
- **Backend**: Rust with Tauri 2
- **UI Framework**: Tailwind CSS v4 + shadcn/ui
- **Database**: SQLite (via rusqlite)
- **Package Manager**: Bun

## Project Structure
```
gooey/
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

## Development Commands
- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run tauri dev` - Start development server with Tauri
- `bun run check` - Type checking
- `bunx tsc --noEmit` - TypeScript type checking
- `cd src-tauri && cargo test` - Run Rust tests
- `cd src-tauri && cargo fmt` - Format Rust code

## Internationalization (i18n)
- `npm run i18n:extract` - Extract translation strings
- `npm run i18n:sync` - Sync with Languine
- `npm run i18n:translate` - Translate strings
- `npm run i18n:all` - Run all i18n commands
- `npm run i18n:check` - Check i18n setup

## Testing
- `npm run test:i18n` - Run i18n tests
- `npm run test:i18n:components` - Run component i18n tests
- `npm run test:i18n:ui` - Run i18n tests with UI
- `npm run test:i18n:report` - Generate i18n test report
- `npm run test:i18n:all` - Run all i18n tests

## Build Commands
- `bun run tauri build` - Build for production
- `bun run tauri build --debug` - Debug build
- `bun run tauri build --target universal-apple-darwin` - Universal binary for macOS

## Coding Standards
### Frontend (React/TypeScript)
- Use TypeScript for all new code
- Follow functional components with hooks
- Use Tailwind CSS for styling
- Add JSDoc comments for exported functions and components

### Backend (Rust)
- Follow Rust standard conventions
- Use `cargo fmt` for formatting
- Use `cargo clippy` for linting
- Handle all `Result` types explicitly
- Add comprehensive documentation with `///` comments

### Security Requirements
- Validate all inputs from the frontend
- Use prepared statements for database operations
- Never log sensitive data (tokens, passwords, etc.)
- Use secure defaults for all configurations

## Contributing
- Fork the repository
- Create a new branch for features/fixes
- Follow PR guidelines with proper titles/descriptions
- Update documentation as needed
- Ensure all tests pass