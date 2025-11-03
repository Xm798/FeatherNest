# FeatherNest

Automated Feather app repository generator that fetches releases from GitHub and generates app-repo.json for Feather.

## Features

- 🚀 Automatic GitHub Release parsing
- ⏰ Auto-update every 12 hours via GitHub Actions
- 📦 Multi-version support
- 🔧 Easy YAML configuration per app
- 🌿 Clean release branch for distribution
- ⚡ Powered by Bun for fast builds and execution

## Project Structure

```
FeatherNest/
├── apps/                    # App configuration files (YAML)
│   └── feather.yaml        # Example app config
├── src/                     # TypeScript source code
│   ├── types.ts            # Type definitions
│   ├── github.ts           # GitHub API client
│   ├── generator.ts        # Repository generator
│   └── index.ts            # Main entry point
├── .github/
│   └── workflows/
│       └── update-repo.yml # Auto-update workflow
├── repo-config.yaml        # Repository configuration
└── output/                 # Generated app-repo.json
```

## Prerequisites

- [Bun](https://bun.sh) - Fast JavaScript runtime and package manager
  ```bash
  # Install Bun (macOS/Linux)
  curl -fsSL https://bun.sh/install | bash

  # Or with Homebrew
  brew install oven-sh/bun/bun
  ```

## Quick Start

### 1. Install Dependencies

```bash
bun install
```

### 2. Configure Repository

Edit `repo-config.yaml` to set your repository information:

```yaml
name: Your Repository Name
identifier: com.example.repo
iconURL: https://...
website: https://...
```

### 3. Add Apps

Create YAML files in the `apps/` directory. Example (`apps/myapp.yaml`):

```yaml
# App Basic Information
name: MyApp
bundleIdentifier: com.example.myapp
developerName: Developer Name
iconURL: https://...
localizedDescription: App description
subtitle: Short subtitle
tintColor: 848ef9

# Screenshots
screenshotURLs:
  - https://...

# App Permissions (optional)
appPermissions: {}

# GitHub Release Configuration
github:
  owner: username
  repo: repository-name
  assetPattern: "*.ipa"  # Pattern to match IPA files
  maxVersions: 5         # Number of versions to include
```

### 4. Generate Repository

```bash
# Generate app-repo.json (Bun runs TypeScript directly, no build needed!)
bun run generate
```

The generated `app-repo.json` will be in the `output/` directory.

## GitHub Actions Auto-Update

The workflow automatically:

1. Runs every 12 hours
2. Fetches latest releases from configured GitHub repos
3. Generates updated app-repo.json
4. Deploys to the `release` branch

### Setup

1. Push your code to GitHub
2. The workflow will automatically run on schedule
3. Access your repository at:
   ```
   https://raw.githubusercontent.com/YOUR_USERNAME/FeatherNest/release/app-repo.json
   ```

### Manual Trigger

Go to Actions → Update App Repository → Run workflow

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

| Field | Type | Description |
|-------|------|-------------|
| name | string | App display name |
| bundleIdentifier | string | App bundle ID |
| developerName | string | Developer name |
| iconURL | string | App icon URL |
| localizedDescription | string | App description |
| subtitle | string | Short subtitle |
| tintColor | string | Hex color code (without #) |
| screenshotURLs | array | Screenshot URLs |
| appPermissions | object | iOS app permissions |
| github.owner | string | GitHub repo owner |
| github.repo | string | GitHub repo name |
| github.assetPattern | string | Asset filename pattern |
| github.maxVersions | number | Max versions to include |

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

### Adding New Apps

1. Create a new YAML file in `apps/` directory
2. Configure the app details and GitHub release information
3. Run `bun run generate` to test
4. Commit and push - GitHub Actions will auto-update

## How It Works

1. **Configuration Loading**: Reads repository config and all app configs from YAML files
2. **GitHub API**: Fetches release information for each app using Octokit
3. **Asset Matching**: Finds IPA files using the configured pattern
4. **Version Parsing**: Extracts version, date, size, and download URL
5. **JSON Generation**: Creates app-repo.json with all apps and versions
6. **Deployment**: GitHub Actions pushes to release branch

## Troubleshooting

### No releases found

- Check GitHub repo owner/name is correct
- Verify releases exist and are not drafts/prereleases
- Ensure IPA files match the assetPattern

### Rate limiting

- For frequent updates, add a GitHub token as `GITHUB_TOKEN` secret
- Token is automatically provided in GitHub Actions

### Build errors

```bash
# Clean install
rm -rf node_modules bun.lockb
bun install
```

### Bun not installed

If you get "command not found: bun", install it:
```bash
curl -fsSL https://bun.sh/install | bash
```

## License

MIT

## Credits

Built for [Feather](https://github.com/khcrysalis/Feather) - On-device iOS application manager
