import { writeFileSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

const args = process.argv.slice(2);
const fullMode = args.includes('--full');
const appName = args.find(arg => !arg.startsWith('--'));

if (!appName) {
  console.error('❌ Error: App name is required');
  console.log('Usage: bun run new-app <app-name> [--full]');
  console.log('\nOptions:');
  console.log('  --full    Generate template with all optional fields');
  process.exit(1);
}

const fileName = `${appName.toLowerCase().replace(/\s+/g, '-')}.yaml`;
const filePath = join(process.cwd(), 'apps', fileName);

if (existsSync(filePath)) {
  console.error(`❌ Error: App configuration already exists at apps/${fileName}`);
  process.exit(1);
}

// Load template from templates directory
const templateName = fullMode ? 'full.yaml' : 'basic.yaml';
const templatePath = join(process.cwd(), 'templates', templateName);

if (!existsSync(templatePath)) {
  console.error(`❌ Error: Template not found at templates/${templateName}`);
  process.exit(1);
}

try {
  const template = readFileSync(templatePath, 'utf-8').replace(/{APP_NAME}/g, appName);

  writeFileSync(filePath, template, 'utf-8');

  const mode = fullMode ? 'full' : 'basic';
  console.log(`✅ Created new app configuration (${mode} template): apps/${fileName}`);
  console.log('\nNext steps:');
  console.log('1. Edit apps/' + fileName + ' with your app details');
  console.log('2. Update GitHub owner, repo, and other fields');
  console.log('3. Run "bun run generate" to test');
  console.log('4. Commit and push to deploy');
} catch (error) {
  console.error('❌ Error creating app configuration:', error);
  process.exit(1);
}
