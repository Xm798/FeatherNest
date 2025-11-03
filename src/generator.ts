import * as fs from 'fs/promises';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { GitHubClient } from './github';
import { App, AppConfig, AppRepository, RepoConfig } from './types';

export class RepoGenerator {
  private githubClient: GitHubClient;

  constructor(githubToken?: string) {
    this.githubClient = new GitHubClient(githubToken);
  }

  async generate(appsDir: string, repoConfigPath: string, outputPath: string): Promise<void> {
    console.log('Loading repository configuration...');
    const repoConfig = await this.loadRepoConfig(repoConfigPath);

    console.log('Loading app configurations...');
    const appConfigs = await this.loadAppConfigs(appsDir);

    console.log(`Found ${appConfigs.length} app(s), fetching releases...`);
    const apps: App[] = [];

    for (const appConfig of appConfigs) {
      console.log(`  Processing ${appConfig.name}...`);
      try {
        const versions = await this.githubClient.fetchReleases(appConfig.github);

        if (versions.length === 0) {
          console.warn(`    Warning: No valid releases found for ${appConfig.name}`);
          continue;
        }

        const latestVersion = versions[0];
        const app: App = {
          name: appConfig.name,
          bundleIdentifier: appConfig.bundleIdentifier,
          developerName: appConfig.developerName,
          iconURL: appConfig.iconURL,
          localizedDescription: appConfig.localizedDescription,
          subtitle: appConfig.subtitle,
          tintColor: appConfig.tintColor,
          versions: versions,
          appPermissions: appConfig.appPermissions || {},
          screenshotURLs: appConfig.screenshotURLs,
          version: latestVersion.version,
          versionDate: latestVersion.date,
          size: latestVersion.size,
          downloadURL: latestVersion.downloadURL,
        };

        apps.push(app);
        console.log(`    ✓ Added ${versions.length} version(s), latest: ${latestVersion.version}`);
      } catch (error) {
        console.error(`    ✗ Failed to process ${appConfig.name}:`, error);
      }
    }

    const repository: AppRepository = {
      name: repoConfig.name,
      identifier: repoConfig.identifier,
      iconURL: repoConfig.iconURL,
      website: repoConfig.website,
      apps: apps,
      news: repoConfig.news || [],
    };

    console.log(`Writing output to ${outputPath}...`);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(repository, null, 2), 'utf-8');
    console.log('✓ Repository generated successfully!');
  }

  private async loadRepoConfig(configPath: string): Promise<RepoConfig> {
    const content = await fs.readFile(configPath, 'utf-8');
    return yaml.load(content) as RepoConfig;
  }

  private async loadAppConfigs(appsDir: string): Promise<AppConfig[]> {
    const files = await fs.readdir(appsDir);
    const yamlFiles = files.filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));

    const configs: AppConfig[] = [];
    for (const file of yamlFiles) {
      const filePath = path.join(appsDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const config = yaml.load(content) as AppConfig;
      configs.push(config);
    }

    return configs;
  }
}
