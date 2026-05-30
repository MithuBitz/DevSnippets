# Dev Snippets

A cross-platform mobile app for saving, organizing, and revisiting code snippets locally on your device. Built with **Expo SDK 55** and **Expo Router**, Dev Snippets keeps your snippets in a local SQLite database with optional JSON backup and restore.

## Features

| Area | Description |
|------|-------------|
| **Snippet library** | Create snippets with title, language, code, and comma-separated tags |
| **Home** | Browse all snippets (newest first), open details, and toggle light/dark theme |
| **Favorites** | Filter and view snippets marked as favorites |
| **Snippet details** | View full code, toggle favorite, delete with confirmation |
| **Languages** | Built-in picker (JavaScript, TypeScript, Python, SQL, Bash, C++, Java, HTML/CSS) |
| **Preferences** | Default language stored with AsyncStorage |
| **Backup & restore** | Export SQLite data to `devsnippet_backup.json` via the File System API |
| **Navigation** | Tab bar with custom styling and liquid glass effect on supported devices |

> **Planned / in progress:** AI code explanation (SecureStore for API keys), full import flow via document picker.

## Tech stack

- [Expo](https://docs.expo.dev/) ~55 · [Expo Router](https://docs.expo.dev/router/introduction/) ~55
- [React Native](https://reactnative.dev/) 0.83 · [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/) 5.9
- [expo-sqlite](https://docs.expo.dev/versions/v55.0.0/sdk/sqlite/) — local snippet storage (WAL mode)
- [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/) — user preferences
- [expo-secure-store](https://docs.expo.dev/versions/v55.0.0/sdk/securestore/) — reserved for sensitive settings
- [expo-file-system](https://docs.expo.dev/versions/v55.0.0/sdk/filesystem/) — JSON backup files

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [npm](https://www.npmjs.com/) or [Bun](https://bun.sh/)
- For device testing: [Expo Go](https://expo.dev/go) on iOS/Android, or Xcode / Android Studio for native builds

## Getting started

### 1. Clone and install

```bash
git clone <repository-url>
cd dev-snippet
npm install
```

If you use Bun:

```bash
bun install
```

### 2. Start the development server

```bash
npm start
```

Then press `i` for iOS simulator, `a` for Android emulator, or scan the QR code with Expo Go.

### Platform-specific shortcuts

```bash
npm run android   # Expo start — Android
npm run ios       # Expo start — iOS
npm run web       # Expo start — web
```

### 3. Lint

```bash
npm run lint
```

## Project structure

```
dev-snippet/
├── app.json                 # Expo app config (scheme: devsnippet)
├── assets/                  # Icons, splash, favicon
├── src/
│   ├── app/                 # Expo Router file-based routes
│   │   ├── _layout.tsx      # Root stack (tabs, create modal, snippet detail)
│   │   ├── create.tsx       # New snippet form
│   │   ├── snippet/[id].tsx # Snippet detail screen
│   │   └── (tabs)/          # Bottom tab navigator
│   │       ├── index.tsx    # Home — snippet list & theme toggle
│   │       ├── favorites.tsx
│   │       ├── files.tsx    # Export / import backup
│   │       └── settings.tsx # Default language & preferences
│   ├── contexts/
│   │   └── theme-context.tsx
│   ├── services/
│   │   └── storage.ts       # AsyncStorage, backup, restore helpers
│   ├── utils/
│   │   └── database.ts      # SQLite init & schema
│   └── types.ts             # Snippet type definition
├── package.json
└── tsconfig.json            # Path alias: @/* → src/*
```

## Data model

Snippets are stored in SQLite (`dev-snippet.db`):

| Field | Type | Notes |
|-------|------|--------|
| `id` | TEXT | Primary key |
| `title` | TEXT | Required |
| `language` | TEXT | Required |
| `code` | TEXT | Required |
| `tags` | TEXT | Comma-separated |
| `folderId` | TEXT | Nullable (folders reserved) |
| `isFavorite` | INTEGER | `0` or `1` |
| `createdAt` | TEXT | ISO timestamp |

Backups are written to the app document directory as `devsnippet_backup.json`.

## Configuration

| Setting | Location |
|---------|----------|
| App name, icons, plugins | `app.json` |
| Deep link scheme | `devsnippet` |
| Typed routes & React Compiler | Enabled in `app.json` experiments |
| TypeScript paths | `@/*` → `./src/*` in `tsconfig.json` |

## Development notes

- **Expo SDK 55:** Use the [versioned Expo docs](https://docs.expo.dev/versions/v55.0.0/) when adding or changing native APIs.
- **Agents / AI tools:** See `AGENTS.md` for project-specific guidance for coding assistants.
- **Native projects:** `ios/` and `android/` are gitignored; run `npx expo prebuild` when you need custom native code.

## Scripts reference

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run android` | Start with Android |
| `npm run ios` | Start with iOS |
| `npm run web` | Start web build |
| `npm run lint` | Run ESLint (expo config) |

## License

Private project (`"private": true` in `package.json`). Add a license file if you plan to open-source or distribute the app.
