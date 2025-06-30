export function generateGitHubStatsSection(
  username: string,
  githubTheme: string,
  layout: 'compact' | 'wide' | 'balanced',
  hasValidUsername: boolean
): string {
  let section = `## 📈 GitHub Stats\n\n`;
  
  if (!hasValidUsername) {
    section += `<div align="center">
  <p><i>⚠️ Please enter a valid GitHub username (minimum 3 characters, letters/numbers/hyphens only) to see GitHub stats</i></p>
</div>

`;
    return section;
  }

  // Sanitize username to prevent URL issues
  const sanitizedUsername = encodeURIComponent(username.trim());

  if (layout === 'compact') {
    section += `<div align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=${sanitizedUsername}&show_icons=true&theme=${githubTheme}&hide_border=true&count_private=true&include_all_commits=true" alt="GitHub Stats" />
</div>

<div align="center">
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=${sanitizedUsername}&theme=${githubTheme}&hide_border=true" alt="GitHub Streak" />
</div>

<div align="center">
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${sanitizedUsername}&theme=${githubTheme}&hide_border=true&layout=compact&langs_count=8" alt="Top Languages" />
</div>

`;
  } else if (layout === 'wide') {
    section += `<div align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=${sanitizedUsername}&show_icons=true&theme=${githubTheme}&hide_border=true&count_private=true&include_all_commits=true" alt="GitHub Stats" width="48%" />
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=${sanitizedUsername}&theme=${githubTheme}&hide_border=true" alt="GitHub Streak" width="48%" />
</div>

<div align="center">
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${sanitizedUsername}&theme=${githubTheme}&hide_border=true&layout=compact&langs_count=8" alt="Top Languages" width="40%" />
</div>

`;
  } else {
    section += `<div align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=${sanitizedUsername}&show_icons=true&theme=${githubTheme}&hide_border=true&count_private=true&include_all_commits=true" alt="GitHub Stats" height="180em" />
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${sanitizedUsername}&theme=${githubTheme}&hide_border=true&layout=compact&langs_count=8" alt="Top Languages" height="180em" />
</div>

<div align="center">
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=${sanitizedUsername}&theme=${githubTheme}&hide_border=true" alt="GitHub Streak" />
</div>

`;
  }
  
  return section;
}