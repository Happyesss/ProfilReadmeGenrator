export interface GitHubUser {
  login: string;
  name: string;
  bio: string;
  location: string;
  blog: string;
  email: string;
  company: string;
  public_repos: number;
  followers: number;
  following: number;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepository {
  name: string;
  description: string;
  html_url: string;
  homepage: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  created_at: string;
  updated_at: string;
  fork: boolean;
  archived: boolean;
}

export interface GitHubApiError {
  message: string;
  status: number;
}

export class GitHubApiClient {
  private apiKey: string;
  private baseUrl = 'https://api.github.com';

  constructor(apiKey?: string) {
    // Use provided API key or fall back to environment variable
    this.apiKey = apiKey || import.meta.env.VITE_GITHUB_API_KEY || '';
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-README-Generator',
      'X-Requested-With': 'XMLHttpRequest'
    };

    if (this.apiKey) {
      headers['Authorization'] = `token ${this.apiKey}`;
    }

    return headers;
  }

  private async makeRequest<T>(endpoint: string, signal?: AbortSignal): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: this.getHeaders(),
        signal,
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          status: response.status
        } as GitHubApiError;
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw error;
      }
      
      // Handle CORS errors
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw {
          message: 'Network error. Please check your internet connection and try again.',
          status: 0
        } as GitHubApiError;
      }
      
      throw error;
    }
  }

  async getUser(username: string, signal?: AbortSignal): Promise<GitHubUser> {
    return this.makeRequest<GitHubUser>(`/users/${encodeURIComponent(username)}`, signal);
  }

  async getUserRepositories(username: string, limit: number = 10, signal?: AbortSignal): Promise<GitHubRepository[]> {
    const repos = await this.makeRequest<GitHubRepository[]>(
      `/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=${limit}&type=owner`,
      signal
    );
    
    // Filter out forks and archived repos for better quality
    return repos.filter(repo => !repo.fork && !repo.archived);
  }

  async getPopularRepositories(username: string, limit: number = 5, signal?: AbortSignal): Promise<GitHubRepository[]> {
    const repos = await this.makeRequest<GitHubRepository[]>(
      `/users/${encodeURIComponent(username)}/repos?sort=stars&per_page=${limit}&type=owner`,
      signal
    );
    return repos.filter(repo => repo.stargazers_count > 0 && !repo.fork && !repo.archived);
  }

  async getUserLanguages(username: string, signal?: AbortSignal): Promise<{[key: string]: number}> {
    try {
      const repos = await this.getUserRepositories(username, 100, signal);
      const languages: {[key: string]: number} = {};
      
      for (const repo of repos) {
        if (repo.language) {
          languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
      }
      
      return languages;
    } catch (error) {
      console.warn('Could not fetch language data:', error);
      return {};
    }
  }

  async getRateLimitStatus(signal?: AbortSignal): Promise<{limit: number, remaining: number, reset: number}> {
    const response = await fetch(`${this.baseUrl}/rate_limit`, {
      headers: this.getHeaders(),
      signal,
      mode: 'cors',
      credentials: 'omit'
    });
    
    const data = await response.json();
    return {
      limit: data.rate.limit,
      remaining: data.rate.remaining,
      reset: data.rate.reset
    };
  }

  // Check if API key is available
  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  // Get current API key status
  getApiKeyStatus(): { hasKey: boolean; source: 'provided' | 'environment' | 'none' } {
    if (this.apiKey === import.meta.env.VITE_GITHUB_API_KEY) {
      return { hasKey: true, source: 'environment' };
    } else if (this.apiKey) {
      return { hasKey: true, source: 'provided' };
    } else {
      return { hasKey: false, source: 'none' };
    }
  }
}

// Utility functions
export function formatGitHubError(error: GitHubApiError): string {
  switch (error.status) {
    case 0:
      return 'Network error. Please check your internet connection and try again.';
    case 404:
      return 'GitHub user not found. Please check the username.';
    case 403:
      return 'API rate limit exceeded. The app is using a built-in API key, but you can provide your own for higher limits.';
    case 401:
      return 'Invalid GitHub API token. Please check your token or use the built-in one.';
    case 422:
      return 'Invalid request. Please check the username format.';
    default:
      return error.message || 'An unexpected error occurred while fetching GitHub data.';
  }
}

export function extractTechStackFromRepos(repos: GitHubRepository[]): {
  languages: string[];
  frameworks: string[];
  topics: string[];
} {
  const languages = new Set<string>();
  const frameworks = new Set<string>();
  const topics = new Set<string>();

  repos.forEach(repo => {
    // Add primary language
    if (repo.language) {
      languages.add(repo.language);
    }

    // Extract frameworks and tools from topics
    repo.topics?.forEach(topic => {
      topics.add(topic);
      
      // Enhanced framework detection patterns
      const frameworkPatterns = [
        // Frontend frameworks
        { pattern: /^(react|reactjs)$/i, name: 'React' },
        { pattern: /^(vue|vuejs|vue-js)$/i, name: 'Vue.js' },
        { pattern: /^(angular|angularjs)$/i, name: 'Angular' },
        { pattern: /^(svelte|sveltejs)$/i, name: 'Svelte' },
        { pattern: /^(nextjs|next-js|next)$/i, name: 'Next.js' },
        { pattern: /^(nuxtjs|nuxt-js|nuxt)$/i, name: 'Nuxt.js' },
        
        // Backend frameworks
        { pattern: /^(nodejs|node-js|node)$/i, name: 'Node.js' },
        { pattern: /^(express|expressjs|express-js)$/i, name: 'Express.js' },
        { pattern: /^(django)$/i, name: 'Django' },
        { pattern: /^(flask)$/i, name: 'Flask' },
        { pattern: /^(fastapi|fast-api)$/i, name: 'FastAPI' },
        { pattern: /^(spring|spring-boot|springboot)$/i, name: 'Spring Boot' },
        { pattern: /^(laravel)$/i, name: 'Laravel' },
        { pattern: /^(rails|ruby-on-rails|rubyonrails)$/i, name: 'Rails' },
        
        // Mobile frameworks
        { pattern: /^(flutter)$/i, name: 'Flutter' },
        { pattern: /^(react-native|reactnative)$/i, name: 'React Native' },
        
        // Other frameworks
        { pattern: /^(typescript|ts)$/i, name: 'TypeScript' },
        { pattern: /^(javascript|js)$/i, name: 'JavaScript' },
        { pattern: /^(tailwindcss|tailwind)$/i, name: 'Tailwind CSS' },
        { pattern: /^(bootstrap)$/i, name: 'Bootstrap' },
        { pattern: /^(sass|scss)$/i, name: 'Sass' },
        { pattern: /^(webpack)$/i, name: 'Webpack' },
        { pattern: /^(vite|vitejs)$/i, name: 'Vite' }
      ];
      
      for (const { pattern, name } of frameworkPatterns) {
        if (pattern.test(topic)) {
          frameworks.add(name);
          break;
        }
      }
    });
  });

  return {
    languages: Array.from(languages).slice(0, 15), // Limit to top 15 languages
    frameworks: Array.from(frameworks).slice(0, 15), // Limit to top 15 frameworks
    topics: Array.from(topics).slice(0, 20) // Keep more topics for reference
  };
}

export function generateProjectsFromRepos(repos: GitHubRepository[], limit: number = 5) {
  return repos
    .filter(repo => 
      repo.description && 
      repo.description.trim().length > 10 && // Ensure meaningful description
      !repo.fork && 
      !repo.archived
    )
    .sort((a, b) => {
      // Sort by stars first, then by recent activity
      if (b.stargazers_count !== a.stargazers_count) {
        return b.stargazers_count - a.stargazers_count;
      }
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    })
    .slice(0, limit)
    .map(repo => ({
      id: repo.name,
      name: repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // Format name
      description: repo.description,
      repository: repo.html_url,
      liveDemo: repo.homepage || undefined,
      techStack: [
        repo.language,
        ...repo.topics.slice(0, 4) // Include top 4 topics as tech stack
      ].filter(Boolean)
    }));
}