import React from 'react';
import { BarChart3, Activity, Award, Star, Code, Gamepad2, Zap, Brush, Palette, AlertTriangle, CheckCircle } from 'lucide-react';
import type { MetricsConfig } from '../types';

interface MetricsFormProps {
  data: MetricsConfig;
  onChange: (data: MetricsConfig) => void;
}

export default function MetricsForm({ data, onChange }: MetricsFormProps) {
  const handleToggle = (field: keyof MetricsConfig, value: any) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  // Check if any advanced metrics are enabled
  const hasAdvancedMetrics = data.showActivity || data.showLanguages || data.showAchievements || 
                            data.showStars || data.showLines || data.snakeEnabled;

  const metricOptions = [
    { key: 'showActivity', label: 'Contribution Activity Graph', description: 'Beautiful activity graph showing your coding patterns', icon: Activity },
    { key: 'showLanguages', label: 'Enhanced Language Stats', description: 'Top 10 programming languages with detailed breakdown', icon: Code },
    { key: 'showAchievements', label: 'GitHub Trophies', description: 'Achievement trophies and badges showcase', icon: Award },
    { key: 'showStars', label: 'Repository Insights', description: 'Enhanced repository statistics and insights', icon: Star },
    { key: 'showLines', label: 'Detailed Code Metrics', description: 'Comprehensive stats including reviews and discussions', icon: Code }
  ];

  const themes = [
    { id: 'default', name: 'Default', description: 'GitHub default theme' },
    { id: 'radical', name: 'Radical', description: 'Pink and yellow gradient' },
    { id: 'merko', name: 'Merko', description: 'Green nature theme' },
    { id: 'tokyonight', name: 'Tokyo Night', description: 'Dark purple theme' },
    { id: 'dracula', name: 'Dracula', description: 'Dark vampire theme' }
  ];

  const snakeThemeOptions = [
    { id: 'auto', name: 'Auto (GitHub Theme)', description: 'Matches your selected GitHub theme' },
    { id: 'dark', name: 'Dark Mode', description: 'Always use dark theme' },
    { id: 'light', name: 'Light Mode', description: 'Always use light theme' }
  ];

  const speedOptions = [
    { id: 'slow', name: 'Slow & Steady', description: 'Relaxed animation, easy to follow' },
    { id: 'medium', name: 'Medium Pace', description: 'Balanced speed, recommended' },
    { id: 'fast', name: 'Lightning Fast', description: 'Quick animation, energetic feel' }
  ];

  const styleOptions = [
    { id: 'classic', name: 'Classic Snake', description: 'Traditional pixelated look' },
    { id: 'modern', name: 'Modern Design', description: 'Smooth gradients and shadows' },
    { id: 'minimal', name: 'Minimal Clean', description: 'Simple, clean aesthetic' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-gray-300 mb-4">
        <BarChart3 className="h-5 w-5" />
        <span className="font-medium">Advanced GitHub Analytics & Snake Animation</span>
      </div>

      {/* Master Toggle for Advanced Analytics */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-blue-400 font-medium mb-1">📊 Advanced Analytics Section</h4>
            <p className="text-sm text-gray-300">
              Show advanced GitHub analytics in your README. Toggle individual metrics below.
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2">
              {hasAdvancedMetrics ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-gray-400" />
              )}
              <div>
                <div className="text-sm text-gray-400 mb-1">
                  {hasAdvancedMetrics ? 'Enabled' : 'Disabled'}
                </div>
                <div className="text-xs text-gray-500">
                  {hasAdvancedMetrics ? 'Analytics will appear in README' : 'No advanced analytics'}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {hasAdvancedMetrics && (
          <div className="bg-green-500/10 border border-green-500/20 rounded p-2 mt-2">
            <p className="text-xs text-green-400">
              ✅ Advanced Analytics section will be included in your README
            </p>
          </div>
        )}
      </div>

      {/* Snake Animation Section */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Gamepad2 className="h-5 w-5 text-purple-400" />
            <h4 className="text-lg font-medium text-white">🐍 Snake Animation (CORB Fixed)</h4>
          </div>
          <button
            onClick={() => handleToggle('snakeEnabled', !data.snakeEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              data.snakeEnabled ? 'bg-purple-500' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                data.snakeEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div className="bg-green-500/10 border border-green-500/20 rounded p-3 mb-4">
          <h5 className="text-green-400 font-medium mb-2">🔧 Fixed Issues:</h5>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• <strong>CORB Error:</strong> Fixed Cross-Origin Read Blocking with proper GitHub Actions workflow</li>
            <li>• <strong>Reliable Loading:</strong> Uses GitHub's raw content delivery system</li>
            <li>• <strong>Auto-Updates:</strong> Refreshes every 12 hours automatically</li>
            <li>• <strong>Theme Support:</strong> Light/dark mode compatibility</li>
          </ul>
        </div>
        
        <p className="text-sm text-gray-300 mb-4">
          Fully automated snake that eats your GitHub contributions. Uses the reliable Platane/snk action with complete setup instructions included.
        </p>

        {data.snakeEnabled && (
          <div className="space-y-4">
            {/* Snake Theme */}
            <div>
              <h5 className="flex items-center space-x-2 text-white font-medium mb-2">
                <Palette className="h-4 w-4" />
                <span>Snake Color Theme</span>
              </h5>
              <div className="grid grid-cols-1 gap-2">
                {snakeThemeOptions.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => handleToggle('snakeTheme', theme.id)}
                    className={`w-full p-2 rounded border transition-all text-left text-sm ${
                      data.snakeTheme === theme.id
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-white">{theme.name}</span>
                        <p className="text-xs text-gray-400">{theme.description}</p>
                      </div>
                      {data.snakeTheme === theme.id && (
                        <div className="w-3 h-3 bg-purple-500 rounded-full" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Snake Speed */}
            <div>
              <h5 className="flex items-center space-x-2 text-white font-medium mb-2">
                <Zap className="h-4 w-4" />
                <span>Animation Speed</span>
              </h5>
              <div className="grid grid-cols-3 gap-2">
                {speedOptions.map(speed => (
                  <button
                    key={speed.id}
                    onClick={() => handleToggle('snakeSpeed', speed.id)}
                    className={`p-2 rounded border transition-all text-center text-sm ${
                      data.snakeSpeed === speed.id
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                    }`}
                  >
                    <div className="font-medium text-white">{speed.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Snake Style */}
            <div>
              <h5 className="flex items-center space-x-2 text-white font-medium mb-2">
                <Brush className="h-4 w-4" />
                <span>Visual Style</span>
              </h5>
              <div className="grid grid-cols-3 gap-2">
                {styleOptions.map(style => (
                  <button
                    key={style.id}
                    onClick={() => handleToggle('snakeStyle', style.id)}
                    className={`p-2 rounded border transition-all text-center text-sm ${
                      data.snakeStyle === style.id
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                    }`}
                  >
                    <div className="font-medium text-white">{style.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Analytics Selection */}
      <div>
        <h4 className="text-lg font-medium text-white mb-3">Select Analytics to Display</h4>
        <div className="grid grid-cols-1 gap-3">
          {metricOptions.map(option => {
            const Icon = option.icon;
            const isEnabled = data[option.key as keyof MetricsConfig] as boolean;
            return (
              <button
                key={option.key}
                onClick={() => handleToggle(option.key as keyof MetricsConfig, !isEnabled)}
                className={`w-full p-3 rounded-lg border transition-all text-left ${
                  isEnabled
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`h-4 w-4 ${isEnabled ? 'text-blue-400' : 'text-gray-400'}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-white">{option.label}</h5>
                      <div className={`w-4 h-4 rounded-full ${isEnabled ? 'bg-blue-500' : 'bg-gray-600'}`} />
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{option.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Theme Selection */}
      <div>
        <h4 className="flex items-center space-x-2 text-lg font-medium text-white mb-3">
          <Palette className="h-5 w-5" />
          <span>Analytics Theme</span>
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {themes.map(theme => (
            <button
              key={theme.id}
              onClick={() => handleToggle('theme', theme.id)}
              className={`w-full p-3 rounded-lg border transition-all text-left ${
                data.theme === theme.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-white">{theme.name}</h5>
                  <p className="text-sm text-gray-400">{theme.description}</p>
                </div>
                {data.theme === theme.id && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Status Summary */}
      <div className="bg-gray-800/30 border border-gray-600 rounded-lg p-4">
        <h5 className="text-white font-medium mb-2">📋 Current Configuration</h5>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Advanced Analytics:</span>
            <span className={hasAdvancedMetrics ? 'text-green-400' : 'text-gray-500'}>
              {hasAdvancedMetrics ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Snake Animation:</span>
            <span className={data.snakeEnabled ? 'text-green-400' : 'text-gray-500'}>
              {data.snakeEnabled ? 'Enabled (CORB Fixed)' : 'Disabled'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Active Metrics:</span>
            <span className="text-blue-400">
              {metricOptions.filter(option => data[option.key as keyof MetricsConfig]).length} of {metricOptions.length}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <h5 className="text-blue-400 font-medium mb-2">🚀 Complete Automation</h5>
        <p className="text-sm text-gray-300">
          The generated README includes complete setup instructions for the snake animation using GitHub Actions. 
          Once set up, everything updates automatically - no manual work required!
        </p>
      </div>
    </div>
  );
}