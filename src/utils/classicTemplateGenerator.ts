import type { FormData } from '../types';

export function generateClassicTemplate(data: FormData): string {
  const { personalDetails, profileTemplate, techStack, socialLinks, projects } = data;
  const { darkMode, useProfileImage, profileImage, showEmojis } = profileTemplate;
  
  // Sanitize username
  const username = personalDetails.githubUsername?.trim() || '';
  const hasValidUsername = username.length >= 3 && /^[a-zA-Z0-9\-]+$/.test(username);
  const sanitizedUsername = hasValidUsername ? encodeURIComponent(username) : 'your-username';
  const emoji = showEmojis;

  let readme = '';

  // Header
  if (useProfileImage && profileImage) {
    readme += `<div align="center">
  <img src="${profileImage}" alt="Profile Picture" width="150" height="150" style="border-radius: 50%;" />
</div>

`;
  }

  readme += `# ${personalDetails.fullName || 'Your Name'} ${emoji ? '👋' : ''}

## ${personalDetails.title || 'Software Developer'}

`;

  // About section
  if (personalDetails.bio) {
    readme += `### ${emoji ? '👨‍💻' : ''} About Me

${personalDetails.bio}

`;
  }

  // Quick info
  if (personalDetails.location || personalDetails.website || personalDetails.email) {
    readme += `### ${emoji ? '📍' : ''} Quick Info

`;
    if (personalDetails.location) {
      readme += `- ${emoji ? '🌍' : ''} **Location:** ${personalDetails.location}\n`;
    }
    if (personalDetails.website) {
      readme += `- ${emoji ? '🌐' : ''} **Website:** [${personalDetails.website}](${personalDetails.website})\n`;
    }
    if (personalDetails.email) {
      readme += `- ${emoji ? '📧' : ''} **Email:** [${personalDetails.email}](mailto:${personalDetails.email})\n`;
    }
    readme += '\n';
  }

  // Tech Stack
  if (Object.values(techStack).some((arr: any) => arr.length > 0)) {
    readme += `## ${emoji ? '🛠️' : ''} Tech Stack

`;

    if (techStack.languages.length > 0) {
      readme += `### ${emoji ? '💻' : ''} Languages
${techStack.languages.map((lang: string) => `- ${lang}`).join('\n')}

`;
    }

    if (techStack.frameworks.length > 0) {
      readme += `### ${emoji ? '⚡' : ''} Frameworks & Libraries
${techStack.frameworks.map((framework: string) => `- ${framework}`).join('\n')}

`;
    }

    if (techStack.databases.length > 0) {
      readme += `### ${emoji ? '🗄️' : ''} Databases
${techStack.databases.map((db: string) => `- ${db}`).join('\n')}

`;
    }

    if (techStack.tools.length > 0) {
      readme += `### ${emoji ? '🔧' : ''} Tools & Platforms
${techStack.tools.map((tool: string) => `- ${tool}`).join('\n')}

`;
    }

    if (techStack.cloud.length > 0) {
      readme += `### ${emoji ? '☁️' : ''} Cloud & Hosting
${techStack.cloud.map((cloud: string) => `- ${cloud}`).join('\n')}

`;
    }
  }

  // GitHub Stats
  if (hasValidUsername) {
    readme += `## ${emoji ? '📊' : ''} GitHub Stats

<div align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=${sanitizedUsername}&show_icons=true&theme=${darkMode ? 'dark' : 'default'}&hide_border=true&count_private=true" alt="GitHub Stats" />
</div>

<div align="center">
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=${sanitizedUsername}&theme=${darkMode ? 'dark' : 'default'}&hide_border=true" alt="GitHub Streak" />
</div>

<div align="center">
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${sanitizedUsername}&theme=${darkMode ? 'dark' : 'default'}&hide_border=true&layout=compact" alt="Top Languages" />
</div>

`;
  }

  // Projects
  if (projects.length > 0) {
    readme += `## ${emoji ? '🚀' : ''} Featured Projects

`;

    projects.forEach(project => {
      readme += `### [${project.name}](${project.repository})
${project.description}

**Tech Stack:** ${project.techStack.join(' • ')}`;
      if (project.liveDemo) {
        readme += `  
**Live Demo:** [View Project](${project.liveDemo})`;
      }
      readme += '\n\n';
    });
  }

  // Social Links
  if (Object.keys(socialLinks).length > 0) {
    readme += `## ${emoji ? '🌐' : ''} Connect With Me

`;

    if (socialLinks.linkedin) {
      readme += `- [LinkedIn](https://linkedin.com/in/${socialLinks.linkedin})\n`;
    }
    if (socialLinks.twitter) {
      readme += `- [Twitter](https://twitter.com/${socialLinks.twitter})\n`;
    }
    if (socialLinks.devto) {
      readme += `- [Dev.to](https://dev.to/${socialLinks.devto})\n`;
    }
    if (socialLinks.medium) {
      readme += `- [Medium](https://medium.com/${socialLinks.medium})\n`;
    }

    readme += '\n';
  }

  // Footer
  readme += `---

<div align="center">
`;

  if (hasValidUsername) {
    readme += `  <img src="https://komarev.com/ghpvc/?username=${sanitizedUsername}&color=blueviolet&style=flat-square&label=Profile+Views" alt="Profile views" />
`;
  }

  readme += `  
  ${emoji ? '⭐️' : ''} From [${personalDetails.fullName || 'Your Name'}](${hasValidUsername ? `https://github.com/${sanitizedUsername}` : '#'})
</div>`;

  return readme;
}