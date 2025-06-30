export interface TechIconMapping {
  [key: string]: string;
}

export const languageIcons: TechIconMapping = {
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
  'C': 'c',
  'Scala': 'scala',
  'R': 'r',
  'Perl': 'perl',
  'Shell': 'bash'
};

export const frameworkIcons: TechIconMapping = {
  'React': 'react',
  'Vue.js': 'vuejs',
  'Angular': 'angularjs',
  'Next.js': 'nextjs',
  'Nuxt.js': 'nuxtjs',
  'Svelte': 'svelte',
  'Node.js': 'nodejs',
  'Express.js': 'express',
  'Django': 'django',
  'Flask': 'flask',
  'Spring Boot': 'spring',
  'Laravel': 'laravel',
  'Rails': 'rails',
  'Flutter': 'flutter',
  'React Native': 'react',
  'FastAPI': 'fastapi',
  'Tailwind CSS': 'tailwindcss',
  'Bootstrap': 'bootstrap',
  'Sass': 'sass',
  'Webpack': 'webpack',
  'Vite': 'vitejs'
};

export const databaseIcons: TechIconMapping = {
  'PostgreSQL': 'postgresql',
  'MySQL': 'mysql',
  'MongoDB': 'mongodb',
  'Redis': 'redis',
  'SQLite': 'sqlite',
  'Firebase': 'firebase',
  'Supabase': 'supabase',
  'MariaDB': 'mysql',
  'Oracle': 'oracle',
  'Cassandra': 'cassandra',
  'Neo4j': 'neo4j',
  'PlanetScale': 'mysql' // Use MySQL icon as fallback
};

export const toolIcons: TechIconMapping = {
  'Git': 'git',
  'Docker': 'docker',
  'Kubernetes': 'kubernetes',
  'VS Code': 'vscode',
  'IntelliJ': 'intellij',
  'Figma': 'figma',
  'Linux': 'linux',
  'Ubuntu': 'ubuntu',
  'Jenkins': 'jenkins',
  'GitHub Actions': 'github',
  'Postman': 'postman',
  'Vim': 'vim',
  'Nginx': 'nginx',
  'Apache': 'apache',
  'Windows': 'windows8', // Use windows8 icon
  'macOS': 'apple' // Use apple icon for macOS
};

export const cloudIcons: TechIconMapping = {
  'AWS': 'amazonwebservices',
  'Google Cloud': 'googlecloud',
  'Azure': 'azure',
  'Vercel': 'vercel',
  'Netlify': 'netlify',
  'Heroku': 'heroku',
  'DigitalOcean': 'digitalocean',
  'Cloudflare': 'cloudflare'
};

// Fallback icon mappings for technologies that don't have exact matches
const fallbackIcons: TechIconMapping = {
  'dajogo': 'django', // Assuming this is a typo for Django
  'planetscale': 'mysql', // PlanetScale is MySQL-compatible
  'rails': 'rails',
  'windows': 'windows8',
  'macos': 'apple'
};

export function getTechIcon(tech: string, category: 'languages' | 'frameworks' | 'databases' | 'tools' | 'cloud'): string {
  const iconMaps = {
    languages: languageIcons,
    frameworks: frameworkIcons,
    databases: databaseIcons,
    tools: toolIcons,
    cloud: cloudIcons
  };
  
  const iconMap = iconMaps[category];
  const normalizedTech = tech.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // First try exact match
  if (iconMap[tech]) {
    return iconMap[tech];
  }
  
  // Try fallback mappings
  if (fallbackIcons[normalizedTech]) {
    return fallbackIcons[normalizedTech];
  }
  
  // Try case-insensitive match
  const caseInsensitiveMatch = Object.keys(iconMap).find(
    key => key.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedTech
  );
  
  if (caseInsensitiveMatch) {
    return iconMap[caseInsensitiveMatch];
  }
  
  // Return normalized tech name as fallback
  return normalizedTech;
}

export function generateTechStackSection(techStack: any): string {
  let section = '';
  
  if (Object.values(techStack).some((arr: any) => arr.length > 0)) {
    section += `## 🚀 Tech Stack\n\n`;
    
    if (techStack.languages.length > 0) {
      section += `**Languages:**  \n<p align="left">\n`;
      techStack.languages.forEach((lang: string) => {
        const iconName = getTechIcon(lang, 'languages');
        section += `<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/${iconName}/${iconName}-original.svg" alt="${lang}" width="50" height="50"/> `;
      });
      section += `\n</p>\n\n`;
    }

    if (techStack.frameworks.length > 0) {
      section += `**Frameworks & Libraries:**  \n<p align="left">\n`;
      techStack.frameworks.forEach((framework: string) => {
        const iconName = getTechIcon(framework, 'frameworks');
        section += `<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/${iconName}/${iconName}-original.svg" alt="${framework}" width="50" height="50"/> `;
      });
      section += `\n</p>\n\n`;
    }

    if (techStack.databases.length > 0) {
      section += `**Databases:**  \n<p align="left">\n`;
      techStack.databases.forEach((db: string) => {
        const iconName = getTechIcon(db, 'databases');
        section += `<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/${iconName}/${iconName}-original.svg" alt="${db}" width="50" height="50"/> `;
      });
      section += `\n</p>\n\n`;
    }

    if (techStack.tools.length > 0) {
      section += `**Tools & Platforms:**  \n<p align="left">\n`;
      techStack.tools.forEach((tool: string) => {
        const iconName = getTechIcon(tool, 'tools');
        section += `<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/${iconName}/${iconName}-original.svg" alt="${tool}" width="50" height="50"/> `;
      });
      section += `\n</p>\n\n`;
    }

    if (techStack.cloud.length > 0) {
      section += `**Cloud & Hosting:**  \n<p align="left">\n`;
      techStack.cloud.forEach((cloud: string) => {
        const iconName = getTechIcon(cloud, 'cloud');
        section += `<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/${iconName}/${iconName}-original.svg" alt="${cloud}" width="50" height="50"/> `;
      });
      section += `\n</p>\n\n`;
    }
  }
  
  return section;
}