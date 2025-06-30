import type { SocialLinks } from '../types';

export function generateContactSection(
  contactPreference: 'email' | 'form' | 'linkedin' | 'multiple',
  email: string,
  contactFormUrl: string,
  socialLinks: SocialLinks
): string {
  let section = `## 📫 Get In Touch\n\n`;
  
  if (contactPreference === 'email') {
    section += `📧 **Email:** [${email || 'your-email@example.com'}](mailto:${email || 'your-email@example.com'})\n\n`;
  } else if (contactPreference === 'form') {
    section += `📝 **Contact Form:** [Get in touch](${contactFormUrl || 'your-contact-form-url'})\n\n`;
  } else if (contactPreference === 'linkedin') {
    section += `💼 **LinkedIn:** [Connect with me](https://linkedin.com/in/${socialLinks.linkedin || 'your-profile'})\n\n`;
  } else {
    section += `- 📧 **Email:** [${email || 'your-email@example.com'}](mailto:${email || 'your-email@example.com'})
- 💼 **LinkedIn:** [Connect with me](https://linkedin.com/in/${socialLinks.linkedin || 'your-profile'})`;
    if (socialLinks.twitter) {
      section += `\n- 🐦 **Twitter:** [@${socialLinks.twitter}](https://twitter.com/${socialLinks.twitter})`;
    }
    if (contactFormUrl) {
      section += `\n- 📝 **Contact Form:** [Get in touch](${contactFormUrl})`;
    }
    section += `\n\n`;
  }
  
  return section;
}