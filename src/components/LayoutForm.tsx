import React from 'react';
import { Layout, Columns, Grid } from 'lucide-react';

interface LayoutFormProps {
  data: 'compact' | 'wide' | 'balanced';
  onChange: (data: 'compact' | 'wide' | 'balanced') => void;
}

export default function LayoutForm({ data, onChange }: LayoutFormProps) {
  const options = [
    {
      id: 'compact',
      label: 'Compact',
      description: 'Single column layout, space efficient',
      icon: Layout
    },
    {
      id: 'wide',
      label: 'Wide',
      description: 'Multi-column layout, more visual space',
      icon: Columns
    },
    {
      id: 'balanced',
      label: 'Balanced',
      description: 'Mixed layout, best of both worlds',
      icon: Grid
    }
  ];

  return (
    <div className="space-y-4">
      {options.map(option => {
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
            <div className="flex items-center space-x-3">
              <Icon className={`h-5 w-5 ${data === option.id ? 'text-blue-400' : 'text-gray-400'}`} />
              <div>
                <h4 className="font-medium text-white">{option.label}</h4>
                <p className="text-sm text-gray-400">{option.description}</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}