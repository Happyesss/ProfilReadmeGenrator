import type { SocialLinks } from '../types';

export function generateSocialLinksSection(socialLinks: SocialLinks): string {
  if (Object.keys(socialLinks).length === 0) return '';
  
  let section = `## 🌐 Connect With Me\n\n<div align="center">\n\n`;
  
  if (socialLinks.linkedin) {
    section += `[![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/${socialLinks.linkedin}) `;
  }
  if (socialLinks.twitter) {
    section += `[![Twitter](https://img.shields.io/badge/Twitter-%231DA1F2.svg?style=for-the-badge&logo=Twitter&logoColor=white)](https://twitter.com/${socialLinks.twitter}) `;
  }
  if (socialLinks.devto) {
    section += `[![Dev.to](https://img.shields.io/badge/dev.to-0A0A0A?style=for-the-badge&logo=dev.to&logoColor=white)](https://dev.to/${socialLinks.devto}) `;
  }
  if (socialLinks.medium) {
    section += `[![Medium](https://img.shields.io/badge/Medium-12100E?style=for-the-badge&logo=medium&logoColor=white)](https://medium.com/${socialLinks.medium}) `;
  }
  if (socialLinks.youtube) {
    section += `[![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?style=for-the-badge&logo=YouTube&logoColor=white)](https://youtube.com/@${socialLinks.youtube}) `;
  }
  if (socialLinks.instagram) {
    section += `[![Instagram](https://img.shields.io/badge/Instagram-%23E4405F.svg?style=for-the-badge&logo=Instagram&logoColor=white)](https://instagram.com/${socialLinks.instagram}) `;
  }
  if (socialLinks.discord) {
    section += `[![Discord](https://img.shields.io/badge/Discord-%237289DA.svg?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com/users/${socialLinks.discord}) `;
  }
  
  section += `\n\n</div>\n\n`;
  
  return section;
}