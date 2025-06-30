import React from 'react';
import { Mail, MessageSquare, Linkedin, Users, ExternalLink } from 'lucide-react';

interface ContactFormProps {
  data: 'email' | 'form' | 'linkedin' | 'multiple';
  contactFormUrl: string;
  onChange: (data: 'email' | 'form' | 'linkedin' | 'multiple', contactFormUrl?: string) => void;
}

export default function ContactForm({ data, contactFormUrl, onChange }: ContactFormProps) {
  const options = [
    {
      id: 'email',
      label: 'Email Only',
      description: 'Simple email contact',
      icon: Mail
    },
    {
      id: 'form',
      label: 'Contact Form',
      description: 'Link to contact form',
      icon: MessageSquare
    },
    {
      id: 'linkedin',
      label: 'LinkedIn Message',
      description: 'Preferred contact via LinkedIn',
      icon: Linkedin
    },
    {
      id: 'multiple',
      label: 'Multiple Options',
      description: 'Show all available contact methods',
      icon: Users
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

      {(data === 'form' || data === 'multiple') && (
        <div className="mt-4">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
            <ExternalLink className="h-4 w-4" />
            <span>Contact Form URL</span>
          </label>
          <input
            type="url"
            value={contactFormUrl}
            onChange={(e) => onChange(data, e.target.value)}
            placeholder="https://your-contact-form.com"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}
    </div>
  );
}