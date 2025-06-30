import React, { useState, useRef, useCallback } from 'react';
import { Download, Github, Key, AlertCircle, CheckCircle, Loader, User, MapPin, Link, Building, Mail, Shield, Code, Star, XCircle, Zap } from 'lucide-react';
import { GitHubApiClient, formatGitHubError, extractTechStackFromRepos, generateProjectsFromRepos } from '../utils/githubApi';
import type { GitHubApiError } from '../utils/githubApi';

interface GitHubUser {
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
}

interface GitHubImportFormProps {
  onImport: (userData: any) => void;
  currentUsername?: string;
}

interface RequestAttempt {
  username: string;
  attempts: number;
  lastAttempt: number;
  failed: boolean;
  errorMessage?: string;
}

export default function GitHubImportForm({ onImport, currentUsername }: GitHubImportFormProps) {
  const [apiKey, setApiKey] = useState('');
  const [username, setUsername] = useState(currentUsername || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userData, setUserData] = useState<GitHubUser | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [importOptions, setImportOptions] = useState({
    personalInfo: true,
    techStack: true,
    projects: true
  });
  const [previewData, setPreviewData] = useState<any>(null);

  // Reset success if username, import options, or preview data changes
  React.useEffect(() => {
    setSuccess('');
  }, [username, importOptions.personalInfo, importOptions.techStack, importOptions.projects, JSON.stringify(previewData)]);
  
  // Request tracking with strict limits
  const requestAttemptsRef = useRef<Map<string, RequestAttempt>>(new Map());
  const isRequestInProgressRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastRequestTimeRef = useRef<number>(0);

  const MAX_ATTEMPTS = 2;
  const MIN_REQUEST_INTERVAL = 2000; // 2 seconds between requests
  const COOLDOWN_PERIOD = 60000; // 1 minute cooldown after max attempts

  const getRequestAttempt = useCallback((username: string): RequestAttempt => {
    const existing = requestAttemptsRef.current.get(username.toLowerCase());
    if (existing) {
      return existing;
    }
    
    const newAttempt: RequestAttempt = {
      username: username.toLowerCase(),
      attempts: 0,
      lastAttempt: 0,
      failed: false
    };
    
    requestAttemptsRef.current.set(username.toLowerCase(), newAttempt);
    return newAttempt;
  }, []);

  const canMakeRequest = useCallback((username: string): { allowed: boolean; reason?: string } => {
    const now = Date.now();
    const normalizedUsername = username.toLowerCase().trim();
    
    // Check minimum interval between requests
    if (now - lastRequestTimeRef.current < MIN_REQUEST_INTERVAL) {
      return {
        allowed: false,
        reason: 'Please wait a moment before making another request.'
      };
    }
    
    // Check if request is already in progress
    if (isRequestInProgressRef.current) {
      return {
        allowed: false,
        reason: 'Request already in progress.'
      };
    }
    
    const attempt = getRequestAttempt(normalizedUsername);
    
    // If user failed after max attempts, check cooldown
    if (attempt.failed && attempt.attempts >= MAX_ATTEMPTS) {
      const timeSinceLastAttempt = now - attempt.lastAttempt;
      if (timeSinceLastAttempt < COOLDOWN_PERIOD) {
        const remainingTime = Math.ceil((COOLDOWN_PERIOD - timeSinceLastAttempt) / 1000);
        return {
          allowed: false,
          reason: `User "${username}" not found. Maximum ${MAX_ATTEMPTS} attempts reached. Please wait ${remainingTime} seconds before trying again.`
        };
      } else {
        // Reset after cooldown
        attempt.attempts = 0;
        attempt.failed = false;
        attempt.errorMessage = undefined;
      }
    }
    
    // Check if max attempts reached
    if (attempt.attempts >= MAX_ATTEMPTS && !attempt.failed) {
      attempt.failed = true;
      return {
        allowed: false,
        reason: `Maximum ${MAX_ATTEMPTS} attempts reached for username "${username}". User not found.`
      };
    }
    
    return { allowed: true };
  }, [getRequestAttempt]);

  const recordAttempt = useCallback((username: string, success: boolean, errorMessage?: string) => {
    const normalizedUsername = username.toLowerCase().trim();
    const attempt = getRequestAttempt(normalizedUsername);
    attempt.attempts += 1;
    attempt.lastAttempt = Date.now();
    
    if (!success) {
      attempt.failed = attempt.attempts >= MAX_ATTEMPTS;
      attempt.errorMessage = errorMessage;
    } else {
      // Reset on success
      attempt.attempts = 0;
      attempt.failed = false;
      attempt.errorMessage = undefined;
    }
    
    requestAttemptsRef.current.set(normalizedUsername, attempt);
  }, [getRequestAttempt]);

  const fetchGitHubUser = useCallback(async () => {
    const usernameToFetch = username.trim();
    
    if (!usernameToFetch) {
      setError('Please enter a GitHub username');
      return;
    }

    if (usernameToFetch.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    // Check if request is allowed
    const requestCheck = canMakeRequest(usernameToFetch);
    if (!requestCheck.allowed) {
      setError(requestCheck.reason || 'Request not allowed');
      return;
    }

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    isRequestInProgressRef.current = true;
    lastRequestTimeRef.current = Date.now();

    setLoading(true);
    setError('');
    setSuccess('');
    setUserData(null);
    setPreviewData(null);

    try {
      const client = new GitHubApiClient(apiKey.trim() || undefined);
      const user = await client.getUser(usernameToFetch, abortControllerRef.current.signal);
      
      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }
      
      // Record successful attempt
      recordAttempt(usernameToFetch, true);
      
      setUserData(user);

      // Fetch additional data for preview
      try {
        const repos = await client.getUserRepositories(user.login, 50, abortControllerRef.current.signal);
        
        // Check if request was aborted
        if (abortControllerRef.current?.signal.aborted) {
          return;
        }
        
        // Generate tech stack preview
        const techStack = extractTechStackFromRepos(repos);
        const previewImportData = {
          techStack: {
            languages: techStack.languages.slice(0, 15),
            frameworks: techStack.frameworks.slice(0, 15),
            databases: [],
            tools: [],
            cloud: []
          },
          projects: generateProjectsFromRepos(repos, 8)
        };

        setPreviewData(previewImportData);
      } catch (repoError) {
        // Don't show repo errors as they're not critical
        console.warn('Could not fetch repository data for preview:', repoError);
      }

      setSuccess('GitHub user data fetched successfully!');
    } catch (err) {
      // Don't show error if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }
      
      const errorMessage = err && typeof err === 'object' && 'status' in err 
        ? formatGitHubError(err as GitHubApiError)
        : 'Failed to fetch GitHub user data';
      
      // Record failed attempt
      recordAttempt(usernameToFetch, false, errorMessage);
      
      // Check if this was the last allowed attempt
      const attempt = getRequestAttempt(usernameToFetch);
      if (attempt.attempts >= MAX_ATTEMPTS) {
        setError(`User "${usernameToFetch}" not found after ${MAX_ATTEMPTS} attempts. Please check the username and try again later.`);
      } else {
        setError(`${errorMessage} (Attempt ${attempt.attempts}/${MAX_ATTEMPTS})`);
      }
    } finally {
      isRequestInProgressRef.current = false;
      setLoading(false);
    }
  }, [username, apiKey, canMakeRequest, recordAttempt, getRequestAttempt]);

  const importUserData = async () => {
    if (!userData) return;

    setLoading(true);
    setError('');

    try {
      const importData: any = {};

      // Import personal information
      if (importOptions.personalInfo) {
        importData.personalDetails = {
          fullName: userData.name || userData.login,
          githubUsername: userData.login,
          bio: userData.bio || '',
          location: userData.location || '',
          website: userData.blog || '',
          email: userData.email || '',
          title: userData.company ? `Developer at ${userData.company}` : 'Software Developer'
        };
      }

      // Import tech stack from preview data
      if (importOptions.techStack && previewData?.techStack) {
        importData.techStack = previewData.techStack;
      }

      // Import projects from preview data
      if (importOptions.projects && previewData?.projects) {
        importData.projects = previewData.projects;
      }

      onImport(importData);
      setSuccess(`Successfully imported ${Object.keys(importData).length} sections from GitHub!`);
      
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'status' in err 
        ? formatGitHubError(err as GitHubApiError)
        : 'Failed to import GitHub data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      fetchGitHubUser();
    }
  };

  const resetAttempts = () => {
    const normalizedUsername = username.trim().toLowerCase();
    requestAttemptsRef.current.delete(normalizedUsername);
    setError('');
    setSuccess('');
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Get current attempt status
  const currentAttempt = username.trim() ? getRequestAttempt(username.trim()) : null;
  const hasReachedMaxAttempts = Boolean(currentAttempt && currentAttempt.attempts >= MAX_ATTEMPTS && currentAttempt.failed);

  return (
    <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Github className="h-5 w-5 text-green-400" />
        <h4 className="text-lg font-medium text-white">Import from GitHub</h4>
        <div className="flex items-center space-x-1 px-2 py-1 bg-green-500/20 rounded-full">
          <Shield className="h-3 w-3 text-green-400" />
          <span className="text-xs text-green-400">Secured</span>
        </div>
      </div>

      <p className="text-sm text-gray-300 mb-4">
        Import your GitHub profile information, tech stack, and featured projects automatically.
      </p>

      {/* Attempt Status */}
      {currentAttempt && currentAttempt.attempts > 0 && (
        <div className={`mb-4 p-3 rounded flex items-start space-x-2 ${
          hasReachedMaxAttempts 
            ? 'bg-red-500/10 border border-red-500/20' 
            : 'bg-yellow-500/10 border border-yellow-500/20'
        }`}>
          {hasReachedMaxAttempts ? (
            <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
          )}
          <div>
            <p className={`text-sm font-medium ${hasReachedMaxAttempts ? 'text-red-400' : 'text-yellow-400'}`}>
              {hasReachedMaxAttempts ? 'Maximum Attempts Reached' : 'Attempt Status'}
            </p>
            <p className={`text-sm ${hasReachedMaxAttempts ? 'text-red-300' : 'text-yellow-300'}`}>
              {hasReachedMaxAttempts 
                ? `User "${username.trim()}" not found after ${MAX_ATTEMPTS} attempts. Please verify the username is correct.`
                : `Attempt ${currentAttempt.attempts}/${MAX_ATTEMPTS} for username "${username.trim()}"`
              }
            </p>
            {hasReachedMaxAttempts && (
              <button
                onClick={resetAttempts}
                className="mt-2 text-xs text-blue-400 hover:text-blue-300 underline"
              >
                Reset and try different username
              </button>
            )}
          </div>
        </div>
      )}

      {/* Import Features */}
      <div className="mb-4 bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
        <h5 className="text-purple-400 font-medium mb-3 flex items-center space-x-2">
          <Zap className="h-4 w-4" />
          <span>🚀 Import Features</span>
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="flex items-start space-x-2">
            <User className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-blue-400 font-medium">Personal Info</p>
              <p className="text-gray-300 text-xs">Name, bio, location, company, website, email</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Code className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-green-400 font-medium">Tech Stack Analysis</p>
              <p className="text-gray-300 text-xs">Languages & frameworks from your repositories</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Star className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-yellow-400 font-medium">Featured Projects</p>
              <p className="text-gray-300 text-xs">Top starred repositories with descriptions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Import Options */}
      <div className="mb-4">
        <h5 className="text-white font-medium mb-2">What to Import</h5>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={importOptions.personalInfo}
              onChange={(e) => setImportOptions({...importOptions, personalInfo: e.target.checked})}
              className="rounded border-gray-600 bg-gray-800 text-green-500 focus:ring-green-500"
            />
            <span className="text-sm text-gray-300">Personal Information (name, bio, location, etc.)</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={importOptions.techStack}
              onChange={(e) => setImportOptions({...importOptions, techStack: e.target.checked})}
              className="rounded border-gray-600 bg-gray-800 text-green-500 focus:ring-green-500"
            />
            <span className="text-sm text-gray-300">
              Tech Stack (from your repositories)
              {previewData?.techStack && (
                <span className="text-green-400 ml-1">
                  - {previewData.techStack.languages.length + previewData.techStack.frameworks.length} detected
                </span>
              )}
            </span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={importOptions.projects}
              onChange={(e) => setImportOptions({...importOptions, projects: e.target.checked})}
              className="rounded border-gray-600 bg-gray-800 text-green-500 focus:ring-green-500"
            />
            <span className="text-sm text-gray-300">
              Featured Projects (top starred repositories)
              {previewData?.projects && (
                <span className="text-green-400 ml-1">
                  - {previewData.projects.length} found
                </span>
              )}
            </span>
          </label>
        </div>
      </div>

      {/* Optional API Key Input */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
            <Key className="h-4 w-4" />
            <span>GitHub API Token (Optional)</span>
          </label>
          <button
            onClick={() => setShowApiKey(!showApiKey)}
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            {showApiKey ? 'Hide' : 'Show'}
          </button>
        </div>
        
        {showApiKey && (
          <div className="space-y-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
            <div className="bg-blue-500/10 border border-blue-500/20 rounded p-2">
              <p className="text-xs text-blue-300">
                <strong>Optional:</strong> For higher rate limits and private repository access.
                <br />
                <strong>Create token:</strong> GitHub → Settings → Developer settings → Personal access tokens
                <br />
                <strong>Required scopes:</strong> <code>read:user</code>, <code>repo</code> (optional)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Username Input */}
      <div className="mb-4">
        <label htmlFor="github-username" className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
          <User className="h-4 w-4" />
          <span>GitHub Username</span>
        </label>
        <div className="flex space-x-2">
          <input
            id="github-username"
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              // Clear previous errors when username changes
              if (error && !loading) {
                setError('');
              }
            }}
            onKeyPress={handleKeyPress}
            placeholder="Enter GitHub username"
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={fetchGitHubUser}
            disabled={loading || !username.trim() || username.trim().length < 3 || hasReachedMaxAttempts}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
          >
            {loading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span>{loading ? 'Fetching...' : 'Fetch'}</span>
          </button>
        </div>
        {currentAttempt && currentAttempt.attempts > 0 && !hasReachedMaxAttempts && (
          <p className="text-xs text-yellow-400 mt-1">
            {MAX_ATTEMPTS - currentAttempt.attempts} attempts remaining
          </p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded flex items-start space-x-2">
          <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-red-400 text-sm font-medium">Error</p>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded flex items-start space-x-2">
          <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-green-400 text-sm font-medium">Success</p>
            <p className="text-green-300 text-sm">{success}</p>
          </div>
        </div>
      )}

      {/* User Data Preview */}
      {userData && (
        <div className="mb-4 p-4 bg-gray-800/50 border border-gray-600 rounded">
          <h5 className="text-white font-medium mb-3 flex items-center space-x-2">
            <Github className="h-4 w-4" />
            <span>GitHub Profile Data</span>
          </h5>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <User className="h-3 w-3 text-gray-400" />
              <span className="text-gray-400">Name:</span>
              <span className="text-white">{userData.name || userData.login}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Github className="h-3 w-3 text-gray-400" />
              <span className="text-gray-400">Username:</span>
              <span className="text-white">{userData.login}</span>
            </div>
            
            {userData.location && (
              <div className="flex items-center space-x-2">
                <MapPin className="h-3 w-3 text-gray-400" />
                <span className="text-gray-400">Location:</span>
                <span className="text-white">{userData.location}</span>
              </div>
            )}
            
            {userData.company && (
              <div className="flex items-center space-x-2">
                <Building className="h-3 w-3 text-gray-400" />
                <span className="text-gray-400">Company:</span>
                <span className="text-white">{userData.company}</span>
              </div>
            )}
            
            {userData.blog && (
              <div className="flex items-center space-x-2">
                <Link className="h-3 w-3 text-gray-400" />
                <span className="text-gray-400">Website:</span>
                <span className="text-white">{userData.blog}</span>
              </div>
            )}
            
            {userData.email && (
              <div className="flex items-center space-x-2">
                <Mail className="h-3 w-3 text-gray-400" />
                <span className="text-gray-400">Email:</span>
                <span className="text-white">{userData.email}</span>
              </div>
            )}
          </div>
          
          {userData.bio && (
            <div className="mt-3 pt-3 border-t border-gray-600">
              <p className="text-gray-400 text-xs mb-1">Bio:</p>
              <p className="text-white text-sm">{userData.bio}</p>
            </div>
          )}

          {/* Tech Stack Preview */}
          {previewData?.techStack && (
            <div className="mt-3 pt-3 border-t border-gray-600">
              <p className="text-gray-400 text-xs mb-2">Detected Tech Stack:</p>
              <div className="space-y-2">
                {previewData.techStack.languages.length > 0 && (
                  <div>
                    <span className="text-blue-400 text-xs font-medium">Languages ({previewData.techStack.languages.length}): </span>
                    <span className="text-white text-xs">{previewData.techStack.languages.slice(0, 8).join(', ')}</span>
                    {previewData.techStack.languages.length > 8 && (
                      <span className="text-gray-400 text-xs"> +{previewData.techStack.languages.length - 8} more</span>
                    )}
                  </div>
                )}
                {previewData.techStack.frameworks.length > 0 && (
                  <div>
                    <span className="text-green-400 text-xs font-medium">Frameworks ({previewData.techStack.frameworks.length}): </span>
                    <span className="text-white text-xs">{previewData.techStack.frameworks.slice(0, 6).join(', ')}</span>
                    {previewData.techStack.frameworks.length > 6 && (
                      <span className="text-gray-400 text-xs"> +{previewData.techStack.frameworks.length - 6} more</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Projects Preview */}
          {previewData?.projects && previewData.projects.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-600">
              <p className="text-gray-400 text-xs mb-2">Featured Projects ({previewData.projects.length}):</p>
              <div className="space-y-1">
                {previewData.projects.slice(0, 4).map((project: any, index: number) => (
                  <div key={index} className="text-xs">
                    <span className="text-purple-400 font-medium">{project.name}</span>
                    {project.description && (
                      <span className="text-gray-300 ml-2">- {project.description.slice(0, 60)}...</span>
                    )}
                  </div>
                ))}
                {previewData.projects.length > 4 && (
                  <div className="text-xs text-gray-400">
                    +{previewData.projects.length - 4} more projects
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="mt-3 pt-3 border-t border-gray-600 flex justify-between text-xs text-gray-400">
            <span>{userData.public_repos} repositories</span>
            <span>{userData.followers} followers</span>
            <span>{userData.following} following</span>
          </div>
          
          <button
            onClick={importUserData}
            disabled={loading}
            className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
          >
            {loading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : success ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span>{loading ? 'Importing...' : success ? 'Imported!' : 'Import Selected Data'}</span>
          </button>
        </div>
      )}
    </div>
  );
}