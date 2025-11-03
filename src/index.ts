import { RepoGenerator } from './generator';
import * as path from 'path';

async function main() {
  const githubToken = process.env.GITHUB_TOKEN;
  const appsDir = path.join(__dirname, '../apps');
  const repoConfigPath = path.join(__dirname, '../repo-config.yaml');
  const outputPath = path.join(__dirname, '../output/app-repo.json');

  const generator = new RepoGenerator(githubToken);

  try {
    await generator.generate(appsDir, repoConfigPath, outputPath);
  } catch (error) {
    console.error('Error generating repository:', error);
    process.exit(1);
  }
}

main();
