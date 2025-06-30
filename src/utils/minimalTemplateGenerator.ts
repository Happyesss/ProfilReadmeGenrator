import type { FormData } from '../types';

export function generateMinimalTemplate(data: FormData): string {
  const { personalDetails, profileTemplate, techStack, socialLinks, projects } = data;
  const { useProfileImage, profileImage, showEmojis } = profileTemplate;
  
  // Sanitize username
  const username = personalDetails.githubUsername?.trim() || '';
  const hasValidUsername = username.length >= 3 && /^[a-zA-Z0-9\-]+$/.test(username);
  const sanitizedUsername = hasValidUsername ? encodeURIComponent(username) : 'your-username';
  const emoji = showEmojis;

  let readme = '';

  // Simple header
  if (useProfileImage && profileImage) {
    readme += `<img src="${profileImage}" alt="Profile" width="100" height="100" style="border-radius: 50%;" align="right" />

`;
  }

  readme += `# ${personalDetails.fullName || 'Your Name'}

${personalDetails.title || 'Software Developer'}

`;

  if (personalDetails.bio) {
    readme += `${personalDetails.bio}

`;
  }

  // Contact info in one line
  const contactInfo = [];
  if (personalDetails.location) contactInfo.push(`${emoji ? '📍' : ''}${personalDetails.location}`);
  if (personalDetails.website) contactInfo.push(`[Website](${personalDetails.website})`);
  if (personalDetails.email) contactInfo.push(`[Email](mailto:${personalDetails.email})`);
  
  if (contactInfo.length > 0) {
    readme += `${contactInfo.join(' • ')}

`;
  }

  // Compact tech stack
  const allTech = [
    ...techStack.languages,
    ...techStack.frameworks,
    ...techStack.databases,
    ...techStack.tools,
    ...techStack.cloud
  ];

  if (allTech.length > 0) {
    readme += `**Tech:** ${allTech.slice(0, 10).join(' • ')}${allTech.length > 10 ? ' • ...' : ''}

`;
  }

  // Simple GitHub stats
  if (hasValidUsername) {
    readme += `![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${sanitizedUsername}&show_icons=true&hide_border=true&count_private=true)

`;
  }

  // Projects as simple list
  if (projects.length > 0) {
    readme += `**Projects:**
`;
    projects.slice(0, 5).forEach(project => {
      readme += `- [${project.name}](${project.repository}) - ${project.description}\n`;
    });
    readme += '\n';
  }

  // Social links in one line
  const socialList = [];
  if (socialLinks.linkedin) socialList.push(`[LinkedIn](https://linkedin.com/in/${socialLinks.linkedin})`);
  if (socialLinks.twitter) socialList.push(`[Twitter](https://twitter.com/${socialLinks.twitter})`);
  if (socialLinks.devto) socialList.push(`[Dev.to](https://dev.to/${socialLinks.devto})`);
  if (socialLinks.medium) socialList.push(`[Medium](https://medium.com/${socialLinks.medium})`);

  if (socialList.length > 0) {
    readme += `**Connect:** ${socialList.join(' • ')}

`;
  }

  // Simple footer
  if (hasValidUsername) {
    readme += `![Profile Views](https://komarev.com/ghpvc/?username=${sanitizedUsername}&color=blue&style=flat)`;
  }

  return readme;
}