import React, { useState } from 'react';
import { Palette, Image, Upload, X, Eye, Moon, Sun } from 'lucide-react';

interface ProfileTemplateFormProps {
  data: {
    template: 'exact' | 'modern' | 'classic' | 'minimal';
    darkMode: boolean;
    profileImage: string;
    useProfileImage: boolean;
    customBanner: string;
    useCustomBanner: boolean;
    colorScheme: 'blue' | 'purple' | 'green' | 'orange' | 'pink';
    showAnimations: boolean;
    showEmojis: boolean;
  };
  onChange: (data: any) => void;
}

export default function ProfileTemplateForm({ data, onChange }: ProfileTemplateFormProps) {
  const [imagePreview, setImagePreview] = useState<string>('');

  const templates = [
    {
      id: 'exact',
      name: 'Default Template',
      description: 'If not decided how to organize, go with this template',
      preview: 'Note: Components in this template will only be edited through the markdown, not with form'
    },
    {
      id: 'modern',
      name: 'Modern Profile',
      description: 'Beautiful animated profile with stats cards and visual elements',
      preview: 'Like the template you showed - with profile image, stats, and animations'
    },
    {
      id: 'classic',
      name: 'Classic GitHub',
      description: 'Traditional GitHub README style with enhanced visuals',
      preview: 'Clean and professional with organized sections'
    },
    {
      id: 'minimal',
      name: 'Minimal Clean',
      description: 'Simple, elegant design focused on content',
      preview: 'Minimalist approach with subtle styling'
    }
  ];

  const colorSchemes = [
    { id: 'blue', name: 'Ocean Blue', colors: ['#0066cc', '#4da6ff', '#b3d9ff'] },
    { id: 'purple', name: 'Royal Purple', colors: ['#6b46c1', '#a78bfa', '#ddd6fe'] },
    { id: 'green', name: 'Forest Green', colors: ['#059669', '#34d399', '#a7f3d0'] },
    { id: 'orange', name: 'Sunset Orange', colors: ['#ea580c', '#fb923c', '#fed7aa'] },
    { id: 'pink', name: 'Rose Pink', colors: ['#e11d48', '#fb7185', '#fecaca'] }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        onChange({
          ...data,
          profileImage: result,
          useProfileImage: true
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <div>
        <h4 className="text-lg font-medium text-white mb-4 flex items-center space-x-2">
          <Palette className="h-5 w-5" />
          <span>Choose Profile Template</span>
        </h4>
        <div className="space-y-3">
          {templates.map(template => (
            <button
              key={template.id}
              onClick={() => onChange({ ...data, template: template.id })}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                data.template === template.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-4 h-4 rounded-full mt-1 ${
                  data.template === template.id ? 'bg-blue-500' : 'bg-gray-600'
                }`} />
                <div className="flex-1">
                  <h5 className="font-medium text-white">{template.name}</h5>
                  <p className="text-sm text-gray-400 mt-1">{template.description}</p>
                  <p className="text-xs text-gray-500 mt-2">{template.preview}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Show additional options only for non-exact templates */}
      {data.template !== 'exact' && (
        <>
          {/* Dark Mode Toggle */}
          <div className="bg-gray-800/30 border border-gray-600 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {data.darkMode ? <Moon className="h-5 w-5 text-blue-400" /> : <Sun className="h-5 w-5 text-yellow-400" />}
                <div>
                  <h5 className="text-white font-medium">Dark Mode</h5>
                  <p className="text-sm text-gray-400">Toggle between light and dark themes</p>
                </div>
              </div>
              <button
                onClick={() => onChange({ ...data, darkMode: !data.darkMode })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  data.darkMode ? 'bg-blue-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    data.darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Color Scheme */}
          <div>
            <h5 className="text-white font-medium mb-3">Color Scheme</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {colorSchemes.map(scheme => (
                <button
                  key={scheme.id}
                  onClick={() => onChange({ ...data, colorScheme: scheme.id })}
                  className={`p-3 rounded-lg border transition-all ${
                    data.colorScheme === scheme.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      {scheme.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className="text-white font-medium">{scheme.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Profile Image Upload */}
          <div className="bg-gray-800/30 border border-gray-600 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Image className="h-5 w-5 text-purple-400" />
                <h5 className="text-white font-medium">Profile Image</h5>
              </div>
              <button
                onClick={() => onChange({ ...data, useProfileImage: !data.useProfileImage })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  data.useProfileImage ? 'bg-purple-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    data.useProfileImage ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {data.useProfileImage && (
              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer transition-all">
                    <Upload className="h-4 w-4" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {(imagePreview || data.profileImage) && (
                    <button
                      onClick={() => {
                        setImagePreview('');
                        onChange({ ...data, profileImage: '', useProfileImage: false });
                      }}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {(imagePreview || data.profileImage) && (
                  <div className="flex items-center space-x-3">
                    <img
                      src={imagePreview || data.profileImage}
                      alt="Profile preview"
                      className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
                    />
                    <div className="text-sm text-gray-300">
                      <p>✅ Image uploaded successfully</p>
                      <p className="text-xs text-gray-400">This will appear in your profile header</p>
                    </div>
                  </div>
                )}

                <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3">
                  <p className="text-xs text-blue-300">
                    <strong>Tip:</strong> Use a square image (400x400px or larger) for best results. 
                    The image will be automatically cropped to a circle.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Visual Options */}
          <div className="space-y-4">
            <h5 className="text-white font-medium">Visual Enhancements</h5>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-gray-800/30 border border-gray-600 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">🎭</div>
                  <div>
                    <span className="text-white font-medium">Animations</span>
                    <p className="text-sm text-gray-400">Add subtle animations and transitions</p>
                  </div>
                </div>
                <button
                  onClick={() => onChange({ ...data, showAnimations: !data.showAnimations })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    data.showAnimations ? 'bg-blue-500' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      data.showAnimations ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>

              <label className="flex items-center justify-between p-3 bg-gray-800/30 border border-gray-600 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">😊</div>
                  <div>
                    <span className="text-white font-medium">Emojis</span>
                    <p className="text-sm text-gray-400">Include emojis in section headers and content</p>
                  </div>
                </div>
                <button
                  onClick={() => onChange({ ...data, showEmojis: !data.showEmojis })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    data.showEmojis ? 'bg-blue-500' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      data.showEmojis ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
            </div>
          </div>
        </>
      )}

      {/* Template Preview */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4">
        <h5 className="text-blue-400 font-medium mb-2 flex items-center space-x-2">
          <Eye className="h-4 w-4" />
          <span>Template Preview</span>
        </h5>
        <div className="text-sm text-gray-300 space-y-1">
          <p><strong>Template:</strong> {templates.find(t => t.id === data.template)?.name}</p>
          {data.template !== 'exact' && (
            <>
              <p><strong>Theme:</strong> {data.darkMode ? 'Dark Mode' : 'Light Mode'}</p>
              <p><strong>Color:</strong> {colorSchemes.find(c => c.id === data.colorScheme)?.name}</p>
              <p><strong>Profile Image:</strong> {data.useProfileImage ? 'Enabled' : 'Disabled'}</p>
              <p><strong>Animations:</strong> {data.showAnimations ? 'Enabled' : 'Disabled'}</p>
              <p><strong>Emojis:</strong> {data.showEmojis ? 'Enabled' : 'Disabled'}</p>
            </>
          )}
          {data.template === 'exact' && (
            <p className="text-blue-400"><strong>Note:</strong> If not decided how to organize, go with this template. Components will only be edited through the markdown, not with the form.</p>
          )}
        </div>
      </div>
    </div>
  );
}