import React from 'react';
import { User, MapPin, Globe, Github, Mail, AlertTriangle, CheckCircle } from 'lucide-react';
import type { PersonalDetails } from '../types';
import GitHubImportForm from './GitHubImportForm';

interface PersonalDetailsFormProps {
  data: PersonalDetails;
  onChange: (data: PersonalDetails) => void;
  onAdvancedImport?: (data: any) => void;
}

export default function PersonalDetailsForm({ data, onChange, onAdvancedImport }: PersonalDetailsFormProps) {
  const handleGitHubImport = (importedData: any) => {
    if (importedData.personalDetails) {
      onChange({
        ...data,
        ...importedData.personalDetails
      });
    }
    
    // Pass the full imported data to parent for other sections
    if (onAdvancedImport && importedData.techStack) {
      onAdvancedImport(importedData);
    }
  };

  const handleChange = (field: keyof PersonalDetails, value: string) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  // Validate GitHub username
  const isValidUsername = data.githubUsername && data.githubUsername.trim().length >= 3;
  const hasSpecialChars = data.githubUsername && /[^a-zA-Z0-9\-]/.test(data.githubUsername);

  return (
    <div className="space-y-6">
      {/* GitHub Import Section */}
      <GitHubImportForm 
        onImport={handleGitHubImport}
        currentUsername={data.githubUsername}
      />

      {/* Manual Form Fields */}
      <div className="bg-gray-800/30 border border-gray-600 rounded-lg p-4">
        <h5 className="text-white font-medium mb-4 flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span>Manual Entry</span>
        </h5>

        <div className="space-y-4">
          <div>
            <label htmlFor="fullName" className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
              <User className="h-4 w-4" />
              <span>Full Name</span>
            </label>
            <input
              id="fullName"
              type="text"
              value={data.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="githubUsername" className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
              <Github className="h-4 w-4" />
              <span>GitHub Username</span>
              <span className="text-red-400">*</span>
            </label>
            <input
              id="githubUsername"
              type="text"
              value={data.githubUsername}
              onChange={(e) => handleChange('githubUsername', e.target.value)}
              placeholder="johndoe"
              className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent ${
                data.githubUsername ? 
                  (isValidUsername && !hasSpecialChars ? 'border-green-500 focus:ring-green-500' : 'border-red-500 focus:ring-red-500') 
                  : 'border-gray-600 focus:ring-blue-500'
              }`}
            />
            
            {/* Username Validation Feedback */}
            <div className="mt-2 space-y-1">
              {data.githubUsername && (
                <div className="flex items-center space-x-2 text-xs">
                  {isValidUsername && !hasSpecialChars ? (
                    <>
                      <CheckCircle className="h-3 w-3 text-green-400" />
                      <span className="text-green-400">Valid GitHub username</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-3 w-3 text-red-400" />
                      <span className="text-red-400">
                        {data.githubUsername.trim().length < 3 
                          ? 'Username must be at least 3 characters' 
                          : hasSpecialChars 
                          ? 'Username can only contain letters, numbers, and hyphens'
                          : 'Invalid username'
                        }
                      </span>
                    </>
                  )}
                </div>
              )}
              <p className="text-xs text-gray-400">
                This will be used for all GitHub stats and metrics. Required for analytics to work.
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              Professional Title/Role
            </label>
            <input
              id="title"
              type="text"
              value={data.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Full Stack Developer | Software Engineer"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="email" className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
              <Mail className="h-4 w-4" />
              <span>Email Address</span>
            </label>
            <input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="john@example.com"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="location" className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
              <MapPin className="h-4 w-4" />
              <span>Location</span>
            </label>
            <input
              id="location"
              type="text"
              value={data.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="San Francisco, CA"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">
              Bio (2-3 sentences)
            </label>
            <textarea
              id="bio"
              value={data.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="Passionate software developer with 5+ years of experience building scalable web applications. I love exploring new technologies and contributing to open source projects."
              rows={3}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label htmlFor="website" className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
              <Globe className="h-4 w-4" />
              <span>Portfolio/Blog Website (optional)</span>
            </label>
            <input
              id="website"
              type="url"
              value={data.website}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="https://johndoe.dev"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
}