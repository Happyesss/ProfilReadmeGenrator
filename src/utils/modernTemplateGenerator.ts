import type { FormData } from '../types';

export function generateModernTemplate(data: FormData): string {
  const { personalDetails, profileTemplate, techStack, socialLinks, projects, metricsConfig } = data;
  const { darkMode, useProfileImage, profileImage, useCustomBanner, customBanner, colorScheme, showEmojis, showAnimations } = profileTemplate;
  
  // Sanitize username
  const username = personalDetails.githubUsername?.trim() || '';
  const hasValidUsername = username.length >= 3 && /^[a-zA-Z0-9\-]+$/.test(username);
  const sanitizedUsername = hasValidUsername ? encodeURIComponent(username) : 'your-username';

  // Color scheme mapping
  const colorSchemes = {
    blue: { primary: '#0066cc', secondary: '#4da6ff', accent: '#b3d9ff' },
    purple: { primary: '#6b46c1', secondary: '#a78bfa', accent: '#ddd6fe' },
    green: { primary: '#059669', secondary: '#34d399', accent: '#a7f3d0' },
    orange: { primary: '#ea580c', secondary: '#fb923c', accent: '#fed7aa' },
    pink: { primary: '#e11d48', secondary: '#fb7185', accent: '#fecaca' }
  };

  const colors = colorSchemes[colorScheme];
  const emoji = showEmojis;

  let readme = '';

  // Custom Banner
  if (useCustomBanner && customBanner) {
    readme += `<div align="center">
  <img src="${customBanner}" alt="Profile Banner" width="100%" />
</div>

`;
  }

  // Profile Header with Image
  readme += `<div align="center">

`;

  if (useProfileImage && profileImage) {
    readme += `<img src="${profileImage}" alt="Profile Picture" width="200" height="200" style="border-radius: 50%; border: 4px solid ${colors.primary};" />

`;
  }

  // Animated Greeting
  if (showAnimations) {
    readme += `<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=32&duration=2800&pause=2000&color=${colors.primary.replace('#', '')}&center=true&vCenter=true&width=600&lines=Hi+there!+${emoji ? '👋' : ''}+I'm+${personalDetails.fullName.replace(/\s+/g, '+') || 'Your+Name'};${personalDetails.title.replace(/\s+/g, '+') || 'Software+Developer'};Welcome+to+my+GitHub+profile!+${emoji ? '🚀' : ''}" alt="Typing SVG" />

`;
  } else {
    readme += `# Hi there! ${emoji ? '👋' : ''} I'm ${personalDetails.fullName || 'Your Name'}

### ${personalDetails.title || 'Software Developer'}

`;
  }

  readme += `</div>

`;

  // About Me Section with Visual Elements
  if (personalDetails.bio || personalDetails.location || personalDetails.website) {
    readme += `## ${emoji ? '🌟' : ''} About Me

<div align="center">

`;

    if (personalDetails.bio) {
      readme += `*${personalDetails.bio}*

`;
    }

    readme += `<table>
<tr>
`;

    if (personalDetails.location) {
      readme += `<td><img src="https://img.shields.io/badge/📍%20Location-${encodeURIComponent(personalDetails.location)}-${colors.primary.replace('#', '')}" alt="Location" /></td>
`;
    }

    if (personalDetails.website) {
      readme += `<td><img src="https://img.shields.io/badge/🌐%20Website-Visit-${colors.secondary.replace('#', '')}" alt="Website" /></td>
`;
    }

    if (hasValidUsername) {
      readme += `<td><img src="https://img.shields.io/badge/💼%20GitHub-${sanitizedUsername}-${colors.accent.replace('#', '')}" alt="GitHub" /></td>
`;
    }

    readme += `</tr>
</table>

</div>

`;
  }

  // Tech Stack with Visual Icons
  if (Object.values(techStack).some((arr: any) => arr.length > 0)) {
    readme += `## ${emoji ? '🚀' : ''} Tech Stack

<div align="center">

`;

    if (techStack.languages.length > 0) {
      readme += `### ${emoji ? '💻' : ''} Languages
<p>
`;
      techStack.languages.forEach((lang: string) => {
        readme += `<img src="https://img.shields.io/badge/${encodeURIComponent(lang)}-${colors.primary.replace('#', '')}" alt="${lang}" style="margin: 2px;" />
`;
      });
      readme += `</p>

`;
    }

    if (techStack.frameworks.length > 0) {
      readme += `### ${emoji ? '⚡' : ''} Frameworks & Libraries
<p>
`;
      techStack.frameworks.forEach((framework: string) => {
        readme += `<img src="https://img.shields.io/badge/${encodeURIComponent(framework)}-${colors.secondary.replace('#', '')}" alt="${framework}" style="margin: 2px;" />
`;
      });
      readme += `</p>

`;
    }

    if (techStack.databases.length > 0) {
      readme += `### ${emoji ? '🗄️' : ''} Databases
<p>
`;
      techStack.databases.forEach((db: string) => {
        readme += `<img src="https://img.shields.io/badge/${encodeURIComponent(db)}-${colors.accent.replace('#', '')}" alt="${db}" style="margin: 2px;" />
`;
      });
      readme += `</p>

`;
    }

    readme += `</div>

`;
  }

  // GitHub Stats Section
  if (hasValidUsername) {
    readme += `## ${emoji ? '📊' : ''} GitHub Analytics

<div align="center">

<table>
<tr>
<td>

<img src="https://github-readme-stats.vercel.app/api?username=${sanitizedUsername}&show_icons=true&theme=${darkMode ? 'dark' : 'light'}&hide_border=true&count_private=true&include_all_commits=true&title_color=${colors.primary.replace('#', '')}&icon_color=${colors.secondary.replace('#', '')}&text_color=${darkMode ? 'ffffff' : '000000'}&bg_color=${darkMode ? '0d1117' : 'ffffff'}" alt="GitHub Stats" />

</td>
<td>

<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${sanitizedUsername}&theme=${darkMode ? 'dark' : 'light'}&hide_border=true&layout=compact&title_color=${colors.primary.replace('#', '')}&text_color=${darkMode ? 'ffffff' : '000000'}&bg_color=${darkMode ? '0d1117' : 'ffffff'}" alt="Top Languages" />

</td>
</tr>
</table>

<img src="https://github-readme-streak-stats.herokuapp.com/?user=${sanitizedUsername}&theme=${darkMode ? 'dark' : 'light'}&hide_border=true&stroke=${colors.primary.replace('#', '')}&ring=${colors.secondary.replace('#', '')}&fire=${colors.accent.replace('#', '')}&currStreakLabel=${colors.primary.replace('#', '')}" alt="GitHub Streak" />

</div>

`;

    // Advanced Analytics if enabled
    if (metricsConfig.showActivity || metricsConfig.showAchievements) {
      readme += `### ${emoji ? '📈' : ''} Advanced Analytics

<div align="center">

`;

      if (metricsConfig.showActivity) {
        readme += `<img src="https://github-readme-activity-graph.vercel.app/graph?username=${sanitizedUsername}&theme=${darkMode ? 'github-compact' : 'github'}&hide_border=true&bg_color=${darkMode ? '0d1117' : 'ffffff'}&color=${colors.primary.replace('#', '')}&line=${colors.secondary.replace('#', '')}&point=${colors.accent.replace('#', '')}" alt="Activity Graph" />

`;
      }

      if (metricsConfig.showAchievements) {
        readme += `<img src="https://github-profile-trophy.vercel.app/?username=${sanitizedUsername}&theme=${darkMode ? 'darkhub' : 'flat'}&no-frame=true&no-bg=true&margin-w=4&column=7" alt="GitHub Trophies" />

`;
      }

      readme += `</div>

`;
    }

    // Snake Animation if enabled
    if (metricsConfig.snakeEnabled) {
      readme += `### ${emoji ? '🐍' : ''} Contribution Snake

<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/${sanitizedUsername}/${sanitizedUsername}/output/github-contribution-grid-snake-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/${sanitizedUsername}/${sanitizedUsername}/output/github-contribution-grid-snake.svg">
  <img alt="github contribution grid snake animation" src="https://raw.githubusercontent.com/${sanitizedUsername}/${sanitizedUsername}/output/github-contribution-grid-snake.svg">
</picture>

</div>

`;
    }
  }

  // Featured Projects
  if (projects.length > 0) {
    readme += `## ${emoji ? '🎯' : ''} Featured Projects

<div align="center">

`;

    projects.forEach((project) => {
      readme += `### ${emoji ? '🚀' : ''} [${project.name}](${project.repository})

<div style="border: 2px solid ${colors.primary}; border-radius: 10px; padding: 20px; margin: 10px; background: ${darkMode ? '#161b22' : '#f6f8fa'};">

**${project.description}**

**Tech Stack:** ${project.techStack.map(tech => `\`${tech}\``).join(' • ')}

<div>
<a href="${project.repository}">
  <img src="https://img.shields.io/badge/Code-${colors.primary.replace('#', '')}" alt="Code" />
</a>
${project.liveDemo ? `<a href="${project.liveDemo}">
  <img src="https://img.shields.io/badge/Live%20Demo-${colors.secondary.replace('#', '')}" alt="Live Demo" />
</a>` : ''}
</div>

</div>

`;
    });

    readme += `</div>

`;
  }

  // Social Links
  if (Object.keys(socialLinks).length > 0) {
    readme += `## ${emoji ? '🌐' : ''} Connect With Me

<div align="center">

`;

    if (socialLinks.linkedin) {
      readme += `<a href="https://linkedin.com/in/${socialLinks.linkedin}">
  <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
</a>
`;
    }

    if (socialLinks.twitter) {
      readme += `<a href="https://twitter.com/${socialLinks.twitter}">
  <img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" alt="Twitter" />
</a>
`;
    }

    if (socialLinks.devto) {
      readme += `<a href="https://dev.to/${socialLinks.devto}">
  <img src="https://img.shields.io/badge/dev.to-0A0A0A?style=for-the-badge&logo=dev.to&logoColor=white" alt="Dev.to" />
</a>
`;
    }

    if (socialLinks.medium) {
      readme += `<a href="https://medium.com/${socialLinks.medium}">
  <img src="https://img.shields.io/badge/Medium-12100E?style=for-the-badge&logo=medium&logoColor=white" alt="Medium" />
</a>
`;
    }

    readme += `

</div>

`;
  }

  // Contact Section
  readme += `## ${emoji ? '📫' : ''} Get In Touch

<div align="center">

`;

  if (personalDetails.email) {
    readme += `<a href="mailto:${personalDetails.email}">
  <img src="https://img.shields.io/badge/Email-${colors.primary.replace('#', '')}" alt="Email" />
</a>
`;
  }

  if (personalDetails.website) {
    readme += `<a href="${personalDetails.website}">
  <img src="https://img.shields.io/badge/Website-${colors.secondary.replace('#', '')}" alt="Website" />
</a>
`;
  }

  readme += `

</div>

`;

  // Footer with Profile Views
  readme += `---

<div align="center">

`;

  if (hasValidUsername) {
    readme += `<img src="https://komarev.com/ghpvc/?username=${sanitizedUsername}&color=${colorScheme}&style=flat-square&label=Profile+Views" alt="Profile views" />

`;
  }

  readme += `${emoji ? '⭐️' : ''} **Thanks for visiting!** ${emoji ? '⭐️' : ''}

*"${personalDetails.bio || 'Code is poetry written in logic.'}"*

</div>`;

  return readme;
}