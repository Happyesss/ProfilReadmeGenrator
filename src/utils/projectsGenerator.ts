import type { Project } from '../types';

export function generateProjectsSection(projects: Project[]): string {
  if (projects.length === 0) return '';
  
  let section = `## 🎯 Featured Projects\n\n`;
  
  projects.forEach(project => {
    section += `### [${project.name}](${project.repository})
${project.description}

**Tech Stack:** ${project.techStack.join(' • ')}`;
    if (project.liveDemo) {
      section += `  
**Live Demo:** [View Project](${project.liveDemo})`;
    }
    section += `\n\n`;
  });
  
  return section;
}