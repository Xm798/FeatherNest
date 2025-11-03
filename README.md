# FeatherNest

Automated Feather app repository generator that fetches releases from GitHub and generates app-repo.json for Feather.

## Features

- 🚀 Automatic GitHub Release parsing
- ⏰ Auto-update every 12 hours via GitHub Actions
- 📦 Multi-version support
- 🔧 Easy YAML configuration per app
- 🌿 Clean release branch for distribution
- ⚡ Powered by Bun for fast builds and execution

## Usage

Click "Add Source" in Feather app, and enter the source url: `https://raw.githubusercontent.com/Xm798/FeatherNest/release/app-repo.json`

## Quick Start

### 1. Install Dependencies

```bash
bun install
```

### 2. Add Apps

Use the built-in command to create new app configurations:

```bash
# Create a basic app configuration with essential fields only
bun run new-app "My App"

# Create a full app configuration with all optional fields and examples
bun run new-app "My App" --full
```

This will create a YAML file in the `apps/` directory with a template. Edit the generated file with your app details:

- Bundle identifier
- Developer name
- Icon URL
- Description and screenshots
- GitHub repository information (owner, repo name, asset pattern)

**Templates:**

- **Basic template**: Minimal configuration with essential fields
- **Full template** (`--full`): Includes all optional fields (category, beta, permissions, multiple screenshot formats)

### 3. Generate Repository

```bash
# Generate app-repo.json (Bun runs TypeScript directly, no build needed!)
bun run generate
```

The generated `app-repo.json` will be in the `output/` directory.

## Configuration Reference

### Repository Config (`repo-config.yaml`)

| Field | Type | Description |
|-------|------|-------------|
| name | string | Repository display name |
| identifier | string | Unique repository identifier |
| iconURL | string | Repository icon URL |
| website | string | Repository website URL |
| news | array | Optional news items |

### App Config (`apps/*.yaml`)

Create app configs using `bun run new-app "App Name"` (basic) or `bun run new-app "App Name" --full` (full).

**Basic Template Fields (Essential):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | ✅ | App display name |
| bundleIdentifier | string | ✅ | App bundle ID (e.g., com.example.app) |
| developerName | string | ✅ | Developer name |
| iconURL | string | ✅ | App icon URL |
| localizedDescription | string | ✅ | App description |
| subtitle | string | ✅ | Short subtitle |
| tintColor | string | ✅ | Hex color code (without #) |
| screenshotURLs | array | ✅ | Screenshot URLs |
| appPermissions | object | - | iOS app permissions (can be empty {}) |
| github.owner | string | ✅ | GitHub repo owner |
| github.repo | string | ✅ | GitHub repo name |
| github.assetPattern | string | ✅ | Asset filename pattern (e.g., "*.ipa") |
| github.maxVersions | number | ✅ | Max versions to include |

**Full Template Additional Fields (Optional):**

| Field | Type | Description |
|-------|------|-------------|
| description | string | Detailed app description |
| category | string | App category |
| beta | boolean | Beta status flag |
| screenshots | object | Device-specific screenshots (iPhone/iPad) |
| appPermissions.entitlements | array | iOS entitlements list |
| appPermissions.privacy | array | Privacy permissions with descriptions |
| permissions | array | Legacy permissions format |
| version | string | Version number (auto-populated from GitHub) |
| versionDate | string | Version release date (auto-populated) |
| downloadURL | string | Download URL (auto-populated) |
| size | number | App size in bytes (auto-populated) |

Use `bun run new-app "App Name" --full` to generate a template with examples of all optional fields.

## Development

### Local Development

```bash
# Install dependencies
bun install

# Run in development mode (same as generate)
bun run dev

# Generate repository
bun run generate
```

## Troubleshooting

### Rate limiting

- For frequent updates, add a GitHub token as `GITHUB_TOKEN` secret
- Token is automatically provided in GitHub Actions

## License

MIT

## Credits

Built for [Feather](https://github.com/khcrysalis/Feather) - On-device iOS application manager
