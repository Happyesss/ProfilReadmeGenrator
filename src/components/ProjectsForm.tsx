import React, { useState } from 'react';
import { Plus, Trash2, ExternalLink, Github } from 'lucide-react';
import type { Project } from '../types';

interface ProjectsFormProps {
  data: Project[];
  onChange: (data: Project[]) => void;
}

export default function ProjectsForm({ data, onChange }: ProjectsFormProps) {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      techStack: [],
      repository: ''
    };
    onChange([...data, newProject]);
    setExpandedProject(newProject.id);
  };

  const removeProject = (id: string) => {
    onChange(data.filter(p => p.id !== id));
    if (expandedProject === id) {
      setExpandedProject(null);
    }
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    onChange(data.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const addTechToProject = (projectId: string, tech: string) => {
    const project = data.find(p => p.id === projectId);
    if (project && tech && !project.techStack.includes(tech)) {
      updateProject(projectId, 'techStack', [...project.techStack, tech]);
    }
  };

  const removeTechFromProject = (projectId: string, tech: string) => {
    const project = data.find(p => p.id === projectId);
    if (project) {
      updateProject(projectId, 'techStack', project.techStack.filter(t => t !== tech));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium text-white">Featured Projects</h4>
        <button
          onClick={addProject}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add Project</span>
        </button>
      </div>

      {data.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>No projects added yet. Click "Add Project" to get started.</p>
        </div>
      )}

      {data.map(project => (
        <div key={project.id} className="bg-gray-800/50 rounded-lg border border-gray-600">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                  placeholder="Project Name"
                  className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none font-medium"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {expandedProject === project.id ? 'Collapse' : 'Expand'}
                </button>
                <button
                  onClick={() => removeProject(project.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {expandedProject === project.id && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <input
                    type="text"
                    value={project.description}
                    onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                    placeholder="Brief project description"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
                    <Github className="h-4 w-4" />
                    <span>Repository URL</span>
                  </label>
                  <input
                    type="url"
                    value={project.repository}
                    onChange={(e) => updateProject(project.id, 'repository', e.target.value)}
                    placeholder="https://github.com/username/project"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
                    <ExternalLink className="h-4 w-4" />
                    <span>Live Demo URL (optional)</span>
                  </label>
                  <input
                    type="url"
                    value={project.liveDemo || ''}
                    onChange={(e) => updateProject(project.id, 'liveDemo', e.target.value || undefined)}
                    placeholder="https://project-demo.com"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tech Stack</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {project.techStack.map(tech => (
                      <span
                        key={tech}
                        className="flex items-center space-x-1 px-2 py-1 bg-blue-600 text-white text-xs rounded"
                      >
                        <span>{tech}</span>
                        <button
                          onClick={() => removeTechFromProject(project.id, tech)}
                          className="hover:text-red-300"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add technology and press Enter"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addTechToProject(project.id, e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}