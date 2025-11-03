# CLAUDE.md

This file provides guidance to Claude Code when working with the FeatherNest project.

## Project Overview

FeatherNest is an automated Feather app repository generator that:
- Fetches iOS app releases from GitHub repositories
- Parses release information (version, date, size, download URLs)
- Generates app-repo.json compatible with Feather iOS app manager
- Automatically updates every 12 hours via GitHub Actions
- Deploys to a clean `release` branch for distribution

## Technology Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **Package Manager**: bun (NOT npm/yarn/pnpm)
- **CI/CD**: GitHub Actions
- **APIs**: GitHub REST API via Octokit

## Project Structure

```
FeatherNest/
├── apps/                    # App configuration files (YAML)
│   └── *.yaml              # Each app has its own config
├── templates/               # App config templates
│   ├── basic.yaml          # Basic template with essential fields
│   └── full.yaml           # Full template with all optional fields
├── src/                     # TypeScript source code
│   ├── types.ts            # Type definitions
│   ├── github.ts           # GitHub API client
│   ├── generator.ts        # Core repository generator
│   ├── new-app.ts          # App config generator CLI
│   └── index.ts            # Entry point
├── .github/workflows/
│   └── update-repo.yml     # Auto-update workflow
├── repo-config.yaml        # Repository-level config
└── output/                 # Generated files (gitignored)
```

## Development Guidelines

### Package Manager

**ALWAYS use bun, NEVER use npm/yarn/pnpm:**

```bash
# Correct
bun install
bun run build
bun run generate

# Wrong
npm install
yarn install
pnpm install
```

### Key Files

1. **repo-config.yaml**: Repository metadata (name, identifier, icon, website, news)
2. **apps/*.yaml**: Individual app configurations with GitHub release info
3. **src/generator.ts**: Core logic for fetching releases and building app-repo.json
4. **src/github.ts**: GitHub API client using Octokit

### Configuration Format

**App Config (apps/*.yaml):**
```yaml
name: App Name
bundleIdentifier: com.example.app
developerName: Developer
iconURL: https://...
localizedDescription: Description
subtitle: Short subtitle
tintColor: 848ef9
screenshotURLs: [...]
appPermissions: {}

github:
  owner: github-username
  repo: repository-name
  assetPattern: "*.ipa"     # Pattern to match release assets
  maxVersions: 5            # Number of versions to include
```

**Generated Format (app-repo.json):**
- Each app must have: `versions[]` array + flattened latest version fields
- Each version: `version`, `date`, `size`, `downloadURL`
- Latest version fields duplicated at app level: `version`, `versionDate`, `size`, `downloadURL`

### Common Tasks

**Add a new app:**
1. Run `bun run new-app "App Name"` (basic) or `bun run new-app "App Name" --full` (full template)
2. Edit the generated `apps/app-name.yaml` with app info and GitHub config
3. Run `bun run generate` to test
4. Commit and push - GitHub Actions will auto-update

**Modify repository info:**
1. Edit `repo-config.yaml`
2. Run `bun run generate` to test
3. Commit and push

**Test locally:**
```bash
bun install
bun run build
bun run generate
# Check output/app-repo.json
```

**Manual workflow trigger:**
- Go to GitHub Actions → Update App Repository → Run workflow

### Type Definitions

Key types in `src/types.ts`:
- `AppConfig`: YAML configuration structure
- `App`: Final app structure in app-repo.json
- `AppVersion`: Individual version info
- `GitHubConfig`: GitHub release parsing config
- `RepoConfig`: Repository-level config

### GitHub API

**Rate limits:**
- Authenticated: 5000 requests/hour
- Unauthenticated: 60 requests/hour
- GitHub Actions automatically provides `GITHUB_TOKEN`

**Release parsing logic:**
- Filters out draft and prerelease releases
- Matches assets using regex pattern (e.g., `*.ipa` → `.*\.ipa`)
- Normalizes version tags (removes `v` prefix)
- Extracts size from asset metadata

### Error Handling

- If an app fails to fetch releases, log warning and skip it
- Other apps should still process successfully
- Workflow should fail only if no apps are processed

### Git Workflow

**Branches:**
- `main`: Source code, configs, workflows
- `release`: Only contains `app-repo.json` (orphan branch, clean history)

**Deployment:**
- GitHub Actions force-pushes to `release` branch
- Only commits if app-repo.json actually changed
- Clean history (each commit is a fresh snapshot)

### Important Notes

- **NEVER commit** generated files to main branch (output/ is gitignored)
- **NEVER modify** external/ reference files unless updating format spec
- **ALWAYS validate** YAML syntax when editing configs
- **ALWAYS test** locally before pushing config changes
- The `downloadURL` field is critical - it must be the direct download link for .ipa files

### Testing Checklist

Before committing config changes:
1. [ ] YAML syntax is valid
2. [ ] GitHub repo exists and has releases
3. [ ] Release contains .ipa files matching assetPattern
4. [ ] `bun run generate` succeeds
5. [ ] output/app-repo.json has correct structure
6. [ ] All required fields are present

### Deployment URL

After GitHub Actions runs:
```
https://raw.githubusercontent.com/OWNER/REPO/release/app-repo.json
```

This URL is what users add to Feather app.

## Memory Bank

- This project follows Feather's app repository JSON schema
- Each app's versions are auto-populated from GitHub Releases
- The workflow ensures release branch stays clean with only JSON output
- Bun is used for faster install/build times compared to npm

## Troubleshooting

**No releases found:**
- Check GitHub owner/repo in YAML config
- Verify releases exist (not drafts/prereleases)
- Check assetPattern matches actual filenames

**TypeScript errors:**
- Run `bun run build` to check compilation
- Ensure all dependencies installed with `bun install`

**Workflow failures:**
- Check GitHub Actions logs
- Verify GITHUB_TOKEN has write permissions
- Ensure release branch exists (auto-created on first run)

**Rate limiting:**
- GitHub Actions provides authenticated token automatically
- For local development, set GITHUB_TOKEN env var
