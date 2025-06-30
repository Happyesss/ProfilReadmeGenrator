export interface PersonalDetails {
  fullName: string;
  title: string;
  location: string;
  bio: string;
  website: string;
  githubUsername: string;
  email: string;
}

export interface TechStack {
  languages: string[];
  frameworks: string[];
  databases: string[];
  tools: string[];
  cloud: string[];
}

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  devto?: string;
  medium?: string;
  youtube?: string;
  instagram?: string;
  discord?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  liveDemo?: string;
  repository: string;
}

export interface MetricsConfig {
  showActivity: boolean;
  showLanguages: boolean;
  showHabits: boolean;
  showAchievements: boolean;
  showCalendar: boolean;
  showReactions: boolean;
  showStars: boolean;
  showFollowers: boolean;
  showRepositories: boolean;
  showDiscussions: boolean;
  showCodeTime: boolean;
  showLines: boolean;
  theme: 'light' | 'dark' | 'github' | 'github-dark' | 'terminal';
  template: 'classic' | 'repository' | 'terminal' | 'markdown';
  // Integrated snake animation settings
  snakeEnabled: boolean;
  snakeTheme: 'light' | 'dark' | 'auto';
  snakeSpeed: 'slow' | 'medium' | 'fast';
  snakeStyle: 'classic' | 'modern' | 'minimal';
}

export interface ProfileTemplate {
  template: 'exact' | 'modern' | 'classic' | 'minimal';
  darkMode: boolean;
  profileImage: string;
  useProfileImage: boolean;
  customBanner: string;
  useCustomBanner: boolean;
  colorScheme: 'blue' | 'purple' | 'green' | 'orange' | 'pink';
  showAnimations: boolean;
  showEmojis: boolean;
}

export interface FormData {
  personalDetails: PersonalDetails;
  headerStyle: 'animated' | 'banner' | 'simple';
  techStack: TechStack;
  githubTheme: 'default' | 'radical' | 'merko' | 'tokyonight' | 'dracula';
  layout: 'compact' | 'wide' | 'balanced';
  socialLinks: SocialLinks;
  projects: Project[];
  contactPreference: 'email' | 'form' | 'linkedin' | 'multiple';
  contactFormUrl: string;
  metricsConfig: MetricsConfig;
  profileTemplate: ProfileTemplate;
}