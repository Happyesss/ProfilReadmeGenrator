export function generateFooterSection(username: string, fullName: string): string {
  // Only generate profile views if we have a valid username (3+ characters, valid format)
  const hasValidUsername = username && username.trim().length >= 3 && /^[a-zA-Z0-9\-]+$/.test(username.trim());
  const validUsername = hasValidUsername ? encodeURIComponent(username.trim()) : null;
  const displayName = fullName || 'Your Name';
  
  let footer = `---\n\n`;
  
  if (hasValidUsername && validUsername) {
    footer += `<div align="center">
  <img src="https://komarev.com/ghpvc/?username=${validUsername}&color=blueviolet&style=flat-square&label=Profile+Views" alt="Profile views" />
</div>

`;
  }
  
  footer += `<div align="center">`;
  
  if (hasValidUsername && validUsername) {
    footer += `\n  ⭐️ From <a href="https://github.com/${validUsername}">${displayName}</a>`;
  } else {
    footer += `\n  ⭐️ From ${displayName}`;
  }
  
  footer += `\n</div>`;
  
  return footer;
}