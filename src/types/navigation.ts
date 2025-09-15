export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  badge?: string | number;
  children?: NavigationItem[];
  description?: string;
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
  current?: boolean;
}

export type NavigationSection = 'overview' | 'analysis' | 'coaching' | 'insights' | 'profile' | 'settings';