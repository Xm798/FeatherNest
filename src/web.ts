import { AppVersion, WebSourceConfig } from './types';

export class WebSourceClient {
  async fetchReleases(config: WebSourceConfig): Promise<AppVersion[]> {
    const response = await fetch(config.url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${config.url}: HTTP ${response.status}`);
    }

    const html = await response.text();
    const rawDownloadURL = this.extractMatch(html, config.downloadURLPattern);
    if (!rawDownloadURL) {
      throw new Error(`No download URL matched pattern ${config.downloadURLPattern} in ${config.url}`);
    }

    const downloadURL = new URL(rawDownloadURL, config.url).toString();

    const rawVersion =
      (config.versionPattern ? this.extractMatch(html, config.versionPattern) : null) ||
      this.extractVersionFromURL(downloadURL);
    if (!rawVersion) {
      throw new Error(`Could not determine version for ${downloadURL}`);
    }
    const version = rawVersion.replace(/^v/i, '');

    const { size, lastModified } = await this.fetchAssetMetadata(downloadURL);

    const parsedDate =
      lastModified ||
      (config.datePattern ? this.normalizeDate(this.extractMatch(html, config.datePattern)) : null) ||
      this.formatISO(new Date());

    return [
      {
        version,
        date: parsedDate,
        size,
        downloadURL,
      },
    ];
  }

  private extractMatch(content: string, pattern: string): string | null {
    const match = content.match(new RegExp(pattern));
    if (!match) {
      return null;
    }
    return match[1] ?? match[0];
  }

  private extractVersionFromURL(url: string): string | null {
    const match = url.match(/\/v?(\d+\.\d+(?:\.\d+)*)\//i) || url.match(/[-_]v?(\d+\.\d+(?:\.\d+)*)\.ipa$/i);
    return match ? match[1] : null;
  }

  private async fetchAssetMetadata(downloadURL: string): Promise<{ size: number; lastModified: string | null }> {
    const response = await fetch(downloadURL, { method: 'HEAD', redirect: 'follow' });
    if (!response.ok) {
      throw new Error(`Failed to inspect asset ${downloadURL}: HTTP ${response.status}`);
    }

    const contentLength = Number(response.headers.get('content-length') || 0);
    const lastModifiedHeader = response.headers.get('last-modified');

    return {
      size: Number.isFinite(contentLength) ? contentLength : 0,
      lastModified: this.normalizeDate(lastModifiedHeader),
    };
  }

  private normalizeDate(value: string | null): string | null {
    if (!value) {
      return null;
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return null;
    }
    return this.formatISO(date);
  }

  private formatISO(date: Date): string {
    return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
  }
}
