import React from 'react';
import { Zap, Image, Type } from 'lucide-react';

interface HeaderStyleFormProps {
  data: 'animated' | 'banner' | 'simple';
  onChange: (data: 'animated' | 'banner' | 'simple') => void;
}

export default function HeaderStyleForm({ data, onChange }: HeaderStyleFormProps) {
  const options = [
    {
      id: 'animated',
      label: 'Animated Text Banner',
      description: 'Dynamic typing animation with your name',
      icon: Zap,
      preview: 'Animated typing effect with colorful text'
    },
    {
      id: 'banner',
      label: 'Custom Image Banner',
      description: 'Professional banner with name and title',
      icon: Image,
      preview: 'Beautiful gradient banner with your info'
    },
    {
      id: 'simple',
      label: 'Simple Elegant Text',
      description: 'Clean text with emoji decorations',
      icon: Type,
      preview: 'Minimalist design with subtle styling'
    }
  ];

  return (
    <div className="space-y-4">
      {options.map((option) => {
        const Icon = option.icon;
        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id as any)}
            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
              data === option.id
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
            }`}
          >
            <div className="flex items-start space-x-3">
              <Icon className={`h-5 w-5 mt-1 ${data === option.id ? 'text-blue-400' : 'text-gray-400'}`} />
              <div className="flex-1">
                <h4 className="font-medium text-white">{option.label}</h4>
                <p className="text-sm text-gray-400 mt-1">{option.description}</p>
                <p className="text-xs text-gray-500 mt-2">{option.preview}</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}