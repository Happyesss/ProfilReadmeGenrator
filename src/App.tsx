import { useState } from 'react';
import { Github, Sparkles, Copy, Check, Download } from 'lucide-react';
import PersonalDetailsForm from './components/PersonalDetailsForm';
import TechStackForm from './components/TechStackForm';
import GitHubStatsForm from './components/GitHubStatsForm';
import LayoutForm from './components/LayoutForm';
import SocialLinksForm from './components/SocialLinksForm';
import ProjectsForm from './components/ProjectsForm';
import ContactForm from './components/ContactForm';
import MetricsForm from './components/MetricsForm';
import ProfileTemplateForm from './components/ProfileTemplateForm';
import ReadmePreview from './components/ReadmePreview';
import { generateReadme } from './utils/readmeGenerator';
import { generateTemplateReadme } from './utils/templateReadmeGenerator';
import type { FormData } from './types';

function App() {
  const [formData, setFormData] = useState<FormData>({
    personalDetails: {
      fullName: '',
      title: '',
      location: '',
      bio: '',
      website: '',
      githubUsername: '',
      email: ''
    },
    headerStyle: 'animated',
    techStack: {
      languages: [],
      frameworks: [],
      databases: [],
      tools: [],
      cloud: []
    },
    githubTheme: 'radical',
    layout: 'balanced',
    socialLinks: {},
    projects: [],
    contactPreference: 'multiple',
    contactFormUrl: '',
    metricsConfig: {
      showActivity: true,
      showLanguages: true,
      showHabits: false,
      showAchievements: true,
      showCalendar: true,
      showReactions: false,
      showStars: true,
      showFollowers: true,
      showRepositories: true,
      showDiscussions: false,
      showCodeTime: false,
      showLines: true,
      theme: 'github-dark',
      template: 'classic',
      snakeEnabled: true,
      snakeTheme: 'auto',
      snakeSpeed: 'medium',
      snakeStyle: 'modern'
    },
    profileTemplate: {
      template: 'exact',
      darkMode: true,
      profileImage: '',
      useProfileImage: false,
      customBanner: '',
      useCustomBanner: false,
      colorScheme: 'blue',
      showAnimations: true,
      showEmojis: true
    }
  });

  const [activeSection, setActiveSection] = useState(0);
  const [copied, setCopied] = useState(false);
  const [useTemplateMode, setUseTemplateMode] = useState(true);

  const sections = [
    'Personal Details',
    'Profile Template',
    'Tech Stack',
    'GitHub Stats',
    'Advanced Metrics',
    'Layout',
    'Social Links',
    'Projects',
    'Contact'
  ];

  const updateFormData = (section: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const handleAdvancedImport = (importedData: any) => {
    setFormData(prev => ({
      ...prev,
      ...importedData
    }));
  };

  // Generate README based on mode
  const generatedReadme = useTemplateMode 
    ? generateTemplateReadme(formData)
    : generateReadme(formData);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedReadme);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadReadme = () => {
    const blob = new Blob([generatedReadme], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderCurrentSection = () => {
    switch (activeSection) {
      case 0:
        return (
          <PersonalDetailsForm
            data={formData.personalDetails}
            onChange={(data) => updateFormData('personalDetails', data)}
            onAdvancedImport={handleAdvancedImport}
          />
        );
      case 1:
        return (
          <ProfileTemplateForm
            data={formData.profileTemplate}
            onChange={(data) => updateFormData('profileTemplate', data)}
          />
        );
      case 2:
        return (
          <TechStackForm
            data={formData.techStack}
            onChange={(data) => updateFormData('techStack', data)}
          />
        );
      case 3:
        return (
          <GitHubStatsForm
            data={formData.githubTheme}
            onChange={(data) => updateFormData('githubTheme', data)}
          />
        );
      case 4:
        return (
          <MetricsForm
            data={formData.metricsConfig}
            onChange={(data) => updateFormData('metricsConfig', data)}
          />
        );
      case 5:
        return (
          <LayoutForm
            data={formData.layout}
            onChange={(data) => updateFormData('layout', data)}
          />
        );
      case 6:
        return (
          <SocialLinksForm
            data={formData.socialLinks}
            onChange={(data) => updateFormData('socialLinks', data)}
          />
        );
      case 7:
        return (
          <ProjectsForm
            data={formData.projects}
            onChange={(data) => updateFormData('projects', data)}
          />
        );
      case 8:
        return (
          <ContactForm
            data={formData.contactPreference}
            contactFormUrl={formData.contactFormUrl}
            onChange={(preference, url) => {
              updateFormData('contactPreference', preference);
              updateFormData('contactFormUrl', url || '');
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Github className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-white">README Generator</h1>
                <p className="text-sm lg:text-base text-gray-300">Create stunning GitHub profiles with beautiful templates</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Template Mode Toggle */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">Template Mode</span>
                <button
                  onClick={() => setUseTemplateMode(!useTemplateMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    useTemplateMode ? 'bg-blue-500' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      useTemplateMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 lg:h-5 lg:w-5 text-yellow-400" />
                <span className="text-sm lg:text-base text-gray-300">
                  {useTemplateMode ? 'Beautiful Templates' : 'Classic Mode'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-white/10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
                <h2 className="text-base lg:text-lg font-semibold text-white">Setup Progress</h2>
                <span className="text-sm text-gray-300">
                  {activeSection + 1} of {sections.length}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((activeSection + 1) / sections.length) * 100}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-2">
                {sections.map((section, index) => (
                  <button
                    key={section}
                    onClick={() => setActiveSection(index)}
                    className={`px-2 py-1 text-xs rounded-full transition-all text-center ${
                      index === activeSection
                        ? 'bg-blue-500 text-white'
                        : index < activeSection
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <span className="hidden sm:inline">{section}</span>
                    <span className="sm:hidden">{section.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Current Form Section */}
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-white/10">
              <h3 className="text-lg lg:text-xl font-semibold text-white mb-4 lg:mb-6">
                {sections[activeSection]}
              </h3>
              {renderCurrentSection()}
              
              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between mt-6 lg:mt-8 space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
                  disabled={activeSection === 0}
                  className="w-full sm:w-auto px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                <button
                  onClick={() => setActiveSection(Math.min(sections.length - 1, activeSection + 1))}
                  disabled={activeSection === sections.length - 1}
                  className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-white/10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 space-y-3 sm:space-y-0">
                <h3 className="text-base lg:text-lg font-semibold text-white">Generated README</h3>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all w-full sm:w-auto"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={downloadReadme}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all w-full sm:w-auto"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                {useTemplateMode 
                  ? formData.profileTemplate.template === 'exact' 
                    ? 'Default template - if not decided how to organize, go with this template. Components will only be edited through the markdown.'
                    : 'Beautiful template-based README with modern design and visual elements.'
                  : 'Classic GitHub README with comprehensive sections and analytics.'
                }
              </p>
            </div>

            {/* Preview */}
            <ReadmePreview markdown={generatedReadme} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;