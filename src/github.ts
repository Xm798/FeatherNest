import { Octokit } from '@octokit/rest';
import { AppVersion, GitHubConfig } from './types';

export class GitHubClient {
  private octokit: Octokit;

  constructor(token?: string) {
    this.octokit = new Octokit({
      auth: token,
    });
  }

  async fetchReleases(config: GitHubConfig): Promise<AppVersion[]> {
    const { owner, repo, assetPattern = '*.ipa', maxVersions = 5 } = config;

    try {
      const { data: releases } = await this.octokit.repos.listReleases({
        owner,
        repo,
        per_page: maxVersions,
      });

      const versions: AppVersion[] = [];

      for (const release of releases) {
        if (release.draft || release.prerelease) {
          continue;
        }

        const asset = this.findAsset(release.assets, assetPattern);
        if (!asset) {
          console.warn(`No matching asset found for release ${release.tag_name}`);
          continue;
        }

        versions.push({
          version: this.normalizeVersion(release.tag_name),
          date: release.published_at || release.created_at,
          size: asset.size,
          downloadURL: asset.browser_download_url,
        });

        if (versions.length >= maxVersions) {
          break;
        }
      }

      return versions;
    } catch (error) {
      throw new Error(`Failed to fetch releases for ${owner}/${repo}: ${error}`);
    }
  }

  private findAsset(assets: any[], pattern: string): any | null {
    const regex = new RegExp(pattern.replace('*', '.*'));
    return assets.find(asset => regex.test(asset.name)) || null;
  }

  private normalizeVersion(tag: string): string {
    return tag.replace(/^v/, '');
  }
}
