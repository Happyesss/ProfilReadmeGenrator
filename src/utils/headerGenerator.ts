export function generateHeaderSection(
  headerStyle: 'animated' | 'banner' | 'simple',
  fullName: string,
  title: string
): string {
  if (headerStyle === 'animated' && fullName) {
    return `<!-- Animated Header -->
[![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=30&duration=3000&pause=1000&color=36BCF7&center=true&vCenter=true&width=1000&lines=Hi+there!+👋+I'm+${fullName.replace(/\s+/g, '+')};${title.replace(/\s+/g, '+')};Welcome+to+my+GitHub+profile!)](https://git.io/typing-svg)

`;
  } else if (headerStyle === 'banner' && fullName) {
    return `<!-- Custom Banner -->
<div align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=50&duration=3000&pause=1000&color=36BCF7&center=true&vCenter=true&width=1000&height=100&lines=${fullName.replace(/\s+/g, '+')};${title.replace(/\s+/g, '+')}" alt="Header"/>
</div>

`;
  } else {
    return `# Hi there! 👋 I'm ${fullName || 'Your Name'}

### ${title || 'Your Professional Title'}

`;
  }
}

export function generatePersonalInfoSection(
  location: string,
  website: string,
  bio: string
): string {
  if (!location && !website && !bio) return '';
  
  let section = `## 🌟 About Me\n\n`;
  
  if (bio) {
    section += `${bio}\n\n`;
  }
  if (location) {
    section += `📍 **Location:** ${location}  \n`;
  }
  if (website) {
    section += `🌐 **Website:** [${website}](${website})  \n`;
  }
  section += '\n';
  
  return section;
}