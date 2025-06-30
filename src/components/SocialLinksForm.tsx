import React from 'react';
import { Linkedin, Twitter, Globe, Youtube, Instagram, MessageCircle } from 'lucide-react';
import type { SocialLinks } from '../types';

interface SocialLinksFormProps {
  data: SocialLinks;
  onChange: (data: SocialLinks) => void;
}

export default function SocialLinksForm({ data, onChange }: SocialLinksFormProps) {
  const platforms = [
    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'your-username' },
    { key: 'twitter', label: 'Twitter/X', icon: Twitter, placeholder: 'your-handle' },
    { key: 'devto', label: 'Dev.to', icon: Globe, placeholder: 'your-username' },
    { key: 'medium', label: 'Medium', icon: Globe, placeholder: '@your-username' },
    { key: 'youtube', label: 'YouTube', icon: Youtube, placeholder: 'channel-name' },
    { key: 'instagram', label: 'Instagram', icon: Instagram, placeholder: 'your-username' },
    { key: 'discord', label: 'Discord', icon: MessageCircle, placeholder: 'username#1234' }
  ];

  const handleChange = (platform: keyof SocialLinks, value: string) => {
    onChange({
      ...data,
      [platform]: value || undefined
    });
  };

  return (
    <div className="space-y-4">
      {platforms.map(platform => {
        const Icon = platform.icon;
        return (
          <div key={platform.key}>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
              <Icon className="h-4 w-4" />
              <span>{platform.label}</span>
            </label>
            <input
              type="text"
              value={data[platform.key as keyof SocialLinks] || ''}
              onChange={(e) => handleChange(platform.key as keyof SocialLinks, e.target.value)}
              placeholder={platform.placeholder}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        );
      })}
    </div>
  );
}