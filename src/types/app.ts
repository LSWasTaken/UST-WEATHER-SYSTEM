// App-level types
export type TabId = 'current' | 'hourly' | 'details' | 'maps' | 'monthly' | 'trends' | 'news';

export interface Banner {
  message: string;
  type: 'info' | 'warning' | 'danger';
}

export interface LocationTab {
  id: string;
  name: string;
  temperature: number;
  icon: 'home' | 'cloud';
  hasAlert?: boolean;
}

export const APP_NAME = 'UST Weather';
