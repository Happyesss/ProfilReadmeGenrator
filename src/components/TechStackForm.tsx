import React, { useState } from 'react';
import { Code, Database, Cloud, PenTool as Tool, Plus } from 'lucide-react';
import type { TechStack } from '../types';

interface TechStackFormProps {
  data: TechStack;
  onChange: (data: TechStack) => void;
}

export default function TechStackForm({ data, onChange }: TechStackFormProps) {
  const [customInputs, setCustomInputs] = useState<{[key: string]: string}>({
    languages: '',
    frameworks: '',
    databases: '',
    tools: '',
    cloud: ''
  });

  const techOptions = {
    languages: [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Dart', 'HTML', 'CSS'
    ],
    frameworks: [
      'React', 'Vue.js', 'Angular', 'Next.js', 'Nuxt.js', 'Svelte', 'Node.js', 'Express.js', 'Django', 'Flask', 'Spring Boot', 'Laravel', 'Rails', 'Flutter', 'React Native'
    ],
    databases: [
      'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Firebase', 'Supabase', 'PlanetScale', 'DynamoDB', 'Cassandra', 'Neo4j'
    ],
    tools: [
      'Git', 'Docker', 'Kubernetes', 'Jenkins', 'GitHub Actions', 'VS Code', 'IntelliJ', 'Figma', 'Postman', 'Linux', 'macOS', 'Windows'
    ],
    cloud: [
      'AWS', 'Google Cloud', 'Azure', 'Vercel', 'Netlify', 'Heroku', 'DigitalOcean', 'Cloudflare'
    ]
  };

  const icons = {
    languages: Code,
    frameworks: Code,
    databases: Database,
    tools: Tool,
    cloud: Cloud
  };

  const handleToggle = (category: keyof TechStack, item: string) => {
    const current = data[category];
    const updated = current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item];
    
    onChange({
      ...data,
      [category]: updated
    });
  };

  const handleCustomAdd = (category: keyof TechStack) => {
    const customItem = customInputs[category].trim();
    if (customItem && !data[category].includes(customItem)) {
      onChange({
        ...data,
        [category]: [...data[category], customItem]
      });
      setCustomInputs({
        ...customInputs,
        [category]: ''
      });
    }
  };

  const handleCustomInputChange = (category: keyof TechStack, value: string) => {
    setCustomInputs({
      ...customInputs,
      [category]: value
    });
  };

  const handleCustomKeyPress = (category: keyof TechStack, e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCustomAdd(category);
    }
  };

  return (
    <div className="space-y-6">
      {Object.entries(techOptions).map(([category, items]) => {
        const Icon = icons[category as keyof typeof icons];
        return (
          <div key={category}>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-3 capitalize">
              <Icon className="h-4 w-4" />
              <span>{category}</span>
            </label>
            
            {/* Predefined Options */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
              {items.map(item => {
                const isSelected = data[category as keyof TechStack].includes(item);
                return (
                  <button
                    key={item}
                    onClick={() => handleToggle(category as keyof TechStack, item)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>

            {/* Custom Items */}
            {data[category as keyof TechStack].filter(item => !items.includes(item)).length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-gray-400 mb-2">Custom items:</p>
                <div className="flex flex-wrap gap-2">
                  {data[category as keyof TechStack]
                    .filter(item => !items.includes(item))
                    .map(item => (
                      <span
                        key={item}
                        className="flex items-center space-x-1 px-2 py-1 bg-purple-600 text-white text-xs rounded"
                      >
                        <span>{item}</span>
                        <button
                          onClick={() => handleToggle(category as keyof TechStack, item)}
                          className="hover:text-red-300"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* Add Custom Item */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={customInputs[category]}
                onChange={(e) => handleCustomInputChange(category as keyof TechStack, e.target.value)}
                onKeyPress={(e) => handleCustomKeyPress(category as keyof TechStack, e)}
                placeholder={`Add custom ${category.slice(0, -1)}...`}
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                onClick={() => handleCustomAdd(category as keyof TechStack)}
                disabled={!customInputs[category].trim()}
                className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}