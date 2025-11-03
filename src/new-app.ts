import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const appName = process.argv[2];

if (!appName) {
  console.error('❌ Error: App name is required');
  console.log('Usage: bun run new-app <app-name>');
  process.exit(1);
}

const fileName = `${appName.toLowerCase().replace(/\s+/g, '-')}.yaml`;
const filePath = join(process.cwd(), 'apps', fileName);

if (existsSync(filePath)) {
  console.error(`❌ Error: App configuration already exists at apps/${fileName}`);
  process.exit(1);
}

const template = `# App Basic Information
name: ${appName}
bundleIdentifier: 
developerName: 
iconURL: 
localizedDescription: 
subtitle: 
tintColor: 848ef9

# Screenshots
screenshotURLs:
  - https://example.com/screenshot1.png

# App Permissions (optional)
appPermissions: {}

# GitHub Release Configuration
github:
  owner: 
  repo: 
  assetPattern: "*.ipa"
  maxVersions: 5
`;

try {
  writeFileSync(filePath, template, 'utf-8');
  console.log(`✅ Created new app configuration: apps/${fileName}`);
  console.log('\nNext steps:');
  console.log('1. Edit apps/' + fileName + ' with your app details');
  console.log('2. Update GitHub owner, repo, and other fields');
  console.log('3. Run "bun run generate" to test');
  console.log('4. Commit and push to deploy');
} catch (error) {
  console.error('❌ Error creating app configuration:', error);
  process.exit(1);
}
