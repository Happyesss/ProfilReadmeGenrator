import React from 'react';
import { BarChart3 } from 'lucide-react';

interface GitHubStatsFormProps {
  data: 'default' | 'radical' | 'merko' | 'tokyonight' | 'dracula';
  onChange: (data: 'default' | 'radical' | 'merko' | 'tokyonight' | 'dracula') => void;
}

export default function GitHubStatsForm({ data, onChange }: GitHubStatsFormProps) {
  const themes = [
    { id: 'default', name: 'Default', colors: ['#0366d6', '#28a745'] },
    { id: 'radical', name: 'Radical', colors: ['#fe428e', '#f8d847'] },
    { id: 'merko', name: 'Merko', colors: ['#abd200', '#68d391'] },
    { id: 'tokyonight', name: 'Tokyo Night', colors: ['#70a5fd', '#bf91f3'] },
    { id: 'dracula', name: 'Dracula', colors: ['#ff6bcb', '#8be9fd'] }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-gray-300 mb-4">
        <BarChart3 className="h-5 w-5" />
        <span className="font-medium">Choose your GitHub stats theme</span>
      </div>
      
      {themes.map(theme => (
        <button
          key={theme.id}
          onClick={() => onChange(theme.id as any)}
          className={`w-full p-4 rounded-lg border-2 transition-all ${
            data === theme.id
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                {theme.colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="font-medium text-white">{theme.name}</span>
            </div>
            {data === theme.id && (
              <div className="w-4 h-4 bg-blue-500 rounded-full" />
            )}
          </div>
        </button>
      ))}
    </div>
  );
}