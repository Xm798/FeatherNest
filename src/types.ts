export interface AppVersion {
  version: string;
  date: string;
  size: number;
  downloadURL: string;
}

export interface App {
  name: string;
  bundleIdentifier: string;
  developerName: string;
  iconURL: string;
  localizedDescription: string;
  subtitle: string;
  tintColor: string;
  versions: AppVersion[];
  appPermissions: Record<string, any>;
  screenshotURLs: string[];
  version: string;
  versionDate: string;
  size: number;
  downloadURL: string;
}

export interface NewsItem {
  title: string;
  identifier: string;
  caption: string;
  tintColor: string;
  imageURL: string;
  date: string;
  url: string;
  notify: boolean;
}

export interface AppRepository {
  name: string;
  identifier: string;
  iconURL: string;
  website: string;
  apps: App[];
  news: NewsItem[];
}

export interface GitHubConfig {
  owner: string;
  repo: string;
  assetPattern?: string;
  maxVersions?: number;
}

export interface AppConfig {
  name: string;
  bundleIdentifier: string;
  developerName: string;
  iconURL: string;
  localizedDescription: string;
  subtitle: string;
  tintColor: string;
  screenshotURLs: string[];
  appPermissions?: Record<string, any>;
  github: GitHubConfig;
}

export interface RepoConfig {
  name: string;
  identifier: string;
  iconURL: string;
  website: string;
  news?: NewsItem[];
}
