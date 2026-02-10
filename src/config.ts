/** M3U player app configuration. */

export type IptvConfig = {
  playlists: Array<{
    name: string;
    url: string;
    epgUrl?: string;
    autoRefreshMinutes?: number;
  }>;
  defaultDevice?: string;
  appId?: string;
};

export const DEFAULT_CONFIG: IptvConfig = {
  playlists: [],
};
