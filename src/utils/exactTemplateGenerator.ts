import type { FormData } from '../types';

export function generateExactTemplate(data: FormData): string {
  const { personalDetails, techStack, socialLinks, projects } = data;
  
  // Sanitize username
  const username = personalDetails.githubUsername?.trim() || '';
  const hasValidUsername = username.length >= 3 && /^[a-zA-Z0-9\-]+$/.test(username);
  const sanitizedUsername = hasValidUsername ? encodeURIComponent(username) : 'your-username';

  let readme = `<div align="center">

# 😊 Hey! Nice to see you.

</div>

---

## Welcome to my page!
I'm ${personalDetails.fullName || 'Your Name'}, ${personalDetails.title || 'Fullstack developer'} from ${personalDetails.location ? `🏠 ${personalDetails.location}` : '🏠 Your Location'}, currently living in ${personalDetails.location ? `🏠 ${personalDetails.location}` : '🏠 Your Current City'}.

${personalDetails.bio || 'Add your bio here to tell people about yourself and what you do.'}

## Things I code with
`;

  // Tech Stack Badges
  const allTech = [
    ...techStack.languages,
    ...techStack.frameworks,
    ...techStack.databases,
    ...techStack.tools,
    ...techStack.cloud
  ];

  if (allTech.length > 0) {
    allTech.forEach(tech => {
      const color = getTechColor(tech);
      readme += `<img alt="${tech}" src="https://img.shields.io/badge/-${encodeURIComponent(tech)}-${color}?style=flat-square&logo=${getTechLogo(tech)}&logoColor=white" />
`;
    });
  } else {
    // Default tech stack if none provided
    const defaultTech = [
      { name: 'React', color: '45b8d8', logo: 'react' },
      { name: 'Webpack', color: '8DD6F9', logo: 'webpack' },
      { name: 'Docker', color: '46a2f1', logo: 'docker' },
      { name: 'GitHub Actions', color: '2088FF', logo: 'github-actions' },
      { name: 'Google Cloud Platform', color: '4285F4', logo: 'google-cloud' },
      { name: 'TypeScript', color: '007ACC', logo: 'typescript' },
      { name: 'Insomnia', color: '5849BE', logo: 'insomnia' },
      { name: 'Apollo GraphQL', color: '311C87', logo: 'apollo-graphql' },
      { name: 'Heroku', color: '430098', logo: 'heroku' },
      { name: 'Redux', color: '764ABC', logo: 'redux' },
      { name: 'GraphQL', color: 'E10098', logo: 'graphql' },
      { name: 'Sass', color: 'CC6699', logo: 'sass' },
      { name: 'Styled Components', color: 'DB7093', logo: 'styled-components' },
      { name: 'Git', color: 'F05032', logo: 'git' },
      { name: 'NPM', color: 'CB3837', logo: 'npm' },
      { name: 'HTML5', color: 'E34F26', logo: 'html5' },
      { name: 'Brave Browser', color: 'FB542B', logo: 'brave' },
      { name: 'Rolling', color: 'FF6D01', logo: 'rollup.js' },
      { name: 'Prettier', color: 'F7B93E', logo: 'prettier' },
      { name: 'MongoDB', color: '13aa52', logo: 'mongodb' },
      { name: 'Node.js', color: '43853d', logo: 'node.js' }
    ];
    
    defaultTech.forEach(tech => {
      readme += `<img alt="${tech.name}" src="https://img.shields.io/badge/-${encodeURIComponent(tech.name)}-${tech.color}?style=flat-square&logo=${tech.logo}&logoColor=white" />
`;
    });
  }

  readme += `

## Open source projects
<table>
<tr>
<th>📁 Projects</th>
<th>⭐ Stars</th>
<th>🍴 Forks</th>
<th>🐛 Issues</th>
<th>📬 Pull requests</th>
</tr>
`;

  if (projects.length > 0) {
    // Show ALL projects instead of limiting to 3
    projects.forEach(project => {
      const repoPath = extractRepoPath(project.repository);
      readme += `<tr>
<td><a href="${project.repository}">${project.name}</a></td>
<td><img alt="Stars" src="https://img.shields.io/github/stars/${repoPath}?style=flat-square&labelColor=343b41"/></td>
<td><img alt="Forks" src="https://img.shields.io/github/forks/${repoPath}?style=flat-square&labelColor=343b41"/></td>
<td><img alt="Issues" src="https://img.shields.io/github/issues/${repoPath}?style=flat-square&labelColor=343b41"/></td>
<td><img alt="Pull Requests" src="https://img.shields.io/github/issues-pr/${repoPath}?style=flat-square&labelColor=343b41"/></td>
</tr>
`;
    });
  } else {
    // Default projects if none provided
    readme += `<tr>
<td><a href="https://github.com/${sanitizedUsername}/react-refresh-component">React AutoRefresh component</a></td>
<td><img alt="Stars" src="https://img.shields.io/badge/⭐-181-yellow.svg?style=flat-square&labelColor=343b41"/></td>
<td><img alt="Forks" src="https://img.shields.io/badge/🍴-45-blue.svg?style=flat-square&labelColor=343b41"/></td>
<td><img alt="Issues" src="https://img.shields.io/badge/🐛-3-green.svg?style=flat-square&labelColor=343b41"/></td>
<td><img alt="Pull Requests" src="https://img.shields.io/badge/📬-1-orange.svg?style=flat-square&labelColor=343b41"/></td>
</tr>
<tr>
<td><a href="https://github.com/${sanitizedUsername}/typescript-react-chrome-extension-starter">TypeScript & React Chrome Extension Starter</a></td>
<td><img alt="Stars" src="https://img.shields.io/badge/⭐-126-yellow.svg?style=flat-square&labelColor=343b41"/></td>
<td><img alt="Forks" src="https://img.shields.io/badge/🍴-26-blue.svg?style=flat-square&labelColor=343b41"/></td>
<td><img alt="Issues" src="https://img.shields.io/badge/🐛-5-green.svg?style=flat-square&labelColor=343b41"/></td>
<td><img alt="Pull Requests" src="https://img.shields.io/badge/📬-3-orange.svg?style=flat-square&labelColor=343b41"/></td>
</tr>
<tr>
<td><a href="https://github.com/${sanitizedUsername}/nodejs-express-typescript-graphql-starter">NodeJs Express TypeScript GraphQL Starter</a></td>
<td><img alt="Stars" src="https://img.shields.io/badge/⭐-89-yellow.svg?style=flat-square&labelColor=343b41"/></td>
<td><img alt="Forks" src="https://img.shields.io/badge/🍴-18-blue.svg?style=flat-square&labelColor=343b41"/></td>
<td><img alt="Issues" src="https://img.shields.io/badge/🐛-2-green.svg?style=flat-square&labelColor=343b41"/></td>
<td><img alt="Pull Requests" src="https://img.shields.io/badge/📬-1-orange.svg?style=flat-square&labelColor=343b41"/></td>
</tr>
`;
  }

  readme += `</table>

`;

  // GitHub Stats Section - Side by Side
  if (hasValidUsername) {
    readme += `## GitHub Stats

<div align="center">
<table>
<tr>
<td>

**${personalDetails.fullName || 'Your Name'}'s GitHub Stats**

<img src="https://github-readme-stats.vercel.app/api?username=${sanitizedUsername}&show_icons=true&theme=dark&hide_border=true&count_private=true&include_all_commits=true" alt="GitHub Stats" />

</td>
<td>

**Most Used Languages**

<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${sanitizedUsername}&theme=dark&hide_border=true&layout=compact&langs_count=8" alt="Top Languages" />

</td>
</tr>
</table>
</div>

`;
  } else {
    readme += `## GitHub Stats

<div align="center">
<table>
<tr>
<td>

**GitHub Stats**

<div style="background: #0d1117; padding: 20px; border-radius: 8px; color: white;">
⚠️ Please enter a valid GitHub username to see stats
</div>

</td>
<td>

**Most Used Languages**

<div style="background: #0d1117; padding: 20px; border-radius: 8px; color: white;">
⚠️ Please enter a valid GitHub username to see languages
</div>

</td>
</tr>
</table>
</div>

`;
  }

  readme += `## Where to find me
<p>
`;

  // Social links
  if (socialLinks.linkedin) {
    readme += `<a href="https://github.com/${sanitizedUsername}" target="_blank"><img alt="Github" src="https://img.shields.io/badge/GitHub-%2312100E.svg?&style=for-the-badge&logo=Github&logoColor=white" /></a>
`;
  } else {
    readme += `<a href="https://github.com/${sanitizedUsername}" target="_blank"><img alt="Github" src="https://img.shields.io/badge/GitHub-%2312100E.svg?&style=for-the-badge&logo=Github&logoColor=white" /></a>
`;
  }

  if (socialLinks.twitter) {
    readme += `<a href="https://twitter.com/${socialLinks.twitter}" target="_blank"><img alt="Twitter" src="https://img.shields.io/badge/twitter-%231DA1F2.svg?&style=for-the-badge&logo=twitter&logoColor=white" /></a>
`;
  } else {
    readme += `<a href="https://twitter.com/yourusername" target="_blank"><img alt="Twitter" src="https://img.shields.io/badge/twitter-%231DA1F2.svg?&style=for-the-badge&logo=twitter&logoColor=white" /></a>
`;
  }

  if (socialLinks.linkedin) {
    readme += `<a href="https://www.linkedin.com/in/${socialLinks.linkedin}" target="_blank"><img alt="LinkedIn" src="https://img.shields.io/badge/linkedin-%230077B5.svg?&style=for-the-badge&logo=linkedin&logoColor=white" /></a>
`;
  } else {
    readme += `<a href="https://www.linkedin.com/in/yourusername" target="_blank"><img alt="LinkedIn" src="https://img.shields.io/badge/linkedin-%230077B5.svg?&style=for-the-badge&logo=linkedin&logoColor=white" /></a>
`;
  }

  if (socialLinks.medium) {
    readme += `<a href="https://medium.com/${socialLinks.medium}" target="_blank"><img alt="Medium" src="https://img.shields.io/badge/medium-%2312100E.svg?&style=for-the-badge&logo=medium&logoColor=white" /></a>
`;
  } else {
    readme += `<a href="https://medium.com/@yourusername" target="_blank"><img alt="Medium" src="https://img.shields.io/badge/medium-%2312100E.svg?&style=for-the-badge&logo=medium&logoColor=white" /></a>
`;
  }

  readme += `</p>

---

<div align="center">

## 🤝 Let's Collaborate!

I'm always open to interesting conversations and collaboration opportunities.<br/>
Feel free to reach out if you want to work together on something amazing! 🚀

<br/>

**Made with ❤️ using [GitHub README Generator](https://github-readme-generator.vercel.app)**

![README build](https://github.com/${sanitizedUsername}/${sanitizedUsername}/workflows/README%20build/badge.svg) ![Stars](https://img.shields.io/github/stars/${sanitizedUsername}?style=flat-square&color=yellow) ![Forks](https://img.shields.io/github/followers/${sanitizedUsername}?style=flat-square&color=blue)

</div>`;

  return readme;
}

function getTechColor(tech: string): string {
  const colorMap: { [key: string]: string } = {
    // Languages
    'JavaScript': 'F7DF1E',
    'TypeScript': '007ACC',
    'Python': '3776AB',
    'Java': 'ED8B00',
    'C++': '00599C',
    'C#': '239120',
    'Go': '00ADD8',
    'Rust': '000000',
    'PHP': '777BB4',
    'Ruby': 'CC342D',
    'Swift': 'FA7343',
    'Kotlin': '0095D5',
    'Dart': '0175C2',
    'HTML': 'E34F26',
    'CSS': '1572B6',
    
    // Frameworks
    'React': '45b8d8',
    'Vue.js': '4FC08D',
    'Angular': 'DD0031',
    'Next.js': '000000',
    'Nuxt.js': '00C58E',
    'Svelte': 'FF3E00',
    'Node.js': '43853d',
    'Express.js': '000000',
    'Django': '092E20',
    'Flask': '000000',
    'Spring Boot': '6DB33F',
    'Laravel': 'FF2D20',
    'Rails': 'CC0000',
    'Flutter': '02569B',
    'React Native': '45b8d8',
    'Tailwind CSS': '38B2AC',
    'Bootstrap': '7952B3',
    'Sass': 'CC6699',
    'Webpack': '8DD6F9',
    'Vite': '646CFF',
    
    // Databases
    'PostgreSQL': '316192',
    'MySQL': '00000F',
    'MongoDB': '13aa52',
    'Redis': 'DC382D',
    'SQLite': '07405E',
    'Firebase': 'FFCA28',
    'Supabase': '3ECF8E',
    
    // Tools
    'Git': 'F05032',
    'Docker': '46a2f1',
    'Kubernetes': '326CE5',
    'VS Code': '007ACC',
    'IntelliJ': '000000',
    'Figma': 'F24E1E',
    'Linux': 'FCC624',
    'Ubuntu': 'E95420',
    'Jenkins': 'D24939',
    'GitHub Actions': '2088FF',
    'Postman': 'FF6C37',
    'Nginx': '009639',
    'Apache': 'D22128',
    'Windows': '0078D4',
    'macOS': '000000',
    
    // Cloud
    'AWS': 'FF9900',
    'Google Cloud': '4285F4',
    'Azure': '0078D4',
    'Vercel': '000000',
    'Netlify': '00C7B7',
    'Heroku': '430098',
    'DigitalOcean': '0080FF',
    'Cloudflare': 'F38020'
  };
  
  return colorMap[tech] || '666666';
}

function getTechLogo(tech: string): string {
  const logoMap: { [key: string]: string } = {
    // Languages
    'JavaScript': 'javascript',
    'TypeScript': 'typescript',
    'Python': 'python',
    'Java': 'java',
    'C++': 'cplusplus',
    'C#': 'csharp',
    'Go': 'go',
    'Rust': 'rust',
    'PHP': 'php',
    'Ruby': 'ruby',
    'Swift': 'swift',
    'Kotlin': 'kotlin',
    'Dart': 'dart',
    'HTML': 'html5',
    'CSS': 'css3',
    
    // Frameworks
    'React': 'react',
    'Vue.js': 'vue.js',
    'Angular': 'angular',
    'Next.js': 'next.js',
    'Nuxt.js': 'nuxt.js',
    'Svelte': 'svelte',
    'Node.js': 'node.js',
    'Express.js': 'express',
    'Django': 'django',
    'Flask': 'flask',
    'Spring Boot': 'spring',
    'Laravel': 'laravel',
    'Rails': 'rubyonrails',
    'Flutter': 'flutter',
    'React Native': 'react',
    'Tailwind CSS': 'tailwindcss',
    'Bootstrap': 'bootstrap',
    'Sass': 'sass',
    'Webpack': 'webpack',
    'Vite': 'vite',
    
    // Databases
    'PostgreSQL': 'postgresql',
    'MySQL': 'mysql',
    'MongoDB': 'mongodb',
    'Redis': 'redis',
    'SQLite': 'sqlite',
    'Firebase': 'firebase',
    'Supabase': 'supabase',
    
    // Tools
    'Git': 'git',
    'Docker': 'docker',
    'Kubernetes': 'kubernetes',
    'VS Code': 'visualstudiocode',
    'IntelliJ': 'intellijidea',
    'Figma': 'figma',
    'Linux': 'linux',
    'Ubuntu': 'ubuntu',
    'Jenkins': 'jenkins',
    'GitHub Actions': 'github-actions',
    'Postman': 'postman',
    'Nginx': 'nginx',
    'Apache': 'apache',
    'Windows': 'windows',
    'macOS': 'apple',
    
    // Cloud
    'AWS': 'amazon-aws',
    'Google Cloud': 'google-cloud',
    'Azure': 'microsoft-azure',
    'Vercel': 'vercel',
    'Netlify': 'netlify',
    'Heroku': 'heroku',
    'DigitalOcean': 'digitalocean',
    'Cloudflare': 'cloudflare'
  };
  
  return logoMap[tech] || tech.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function extractRepoPath(url: string): string {
  try {
    const match = url.match(/github\.com\/([^\/]+\/[^\/]+)/);
    return match ? match[1] : 'user/repo';
  } catch {
    return 'user/repo';
  }
}