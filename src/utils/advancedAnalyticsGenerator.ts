import type { MetricsConfig } from '../types';

export function generateAdvancedAnalyticsSection(
  username: string,
  githubTheme: string,
  metricsConfig: MetricsConfig,
  hasValidUsername: boolean
): string {
  const hasAdvancedMetrics = metricsConfig.showActivity || metricsConfig.showLanguages || 
                            metricsConfig.showAchievements || metricsConfig.showStars || 
                            metricsConfig.showLines || metricsConfig.snakeEnabled;
  
  if (!hasValidUsername && hasAdvancedMetrics) {
    return `## 📊 Advanced GitHub Analytics

<div align="center">
  <p><i>⚠️ Please enter a valid GitHub username (minimum 3 characters, letters/numbers/hyphens only) to see advanced analytics</i></p>
</div>

`;
  }
  
  if (!hasValidUsername || !hasAdvancedMetrics) {
    return '';
  }

  // Sanitize username to prevent URL issues
  const sanitizedUsername = encodeURIComponent(username.trim());

  let section = `## 📊 Advanced GitHub Analytics\n\n`;

  // Snake Animation
  if (metricsConfig.snakeEnabled) {
    section += generateSnakeAnimationSection(sanitizedUsername);
  }

  // Activity Graph
  if (metricsConfig.showActivity) {
    section += generateActivityGraphSection(sanitizedUsername, githubTheme);
  }

  // Enhanced Language Stats
  if (metricsConfig.showLanguages) {
    section += generateLanguageStatsSection(sanitizedUsername, githubTheme);
  }

  // GitHub Trophies
  if (metricsConfig.showAchievements) {
    section += generateTrophiesSection(sanitizedUsername, githubTheme);
  }

  // Repository Stats
  if (metricsConfig.showStars) {
    section += generateRepositoryInsightsSection(sanitizedUsername, githubTheme);
  }

  // Detailed Metrics
  if (metricsConfig.showLines) {
    section += generateDetailedMetricsSection(sanitizedUsername, githubTheme);
  }

  // Snake Setup Instructions - Only if snake is enabled
  if (metricsConfig.snakeEnabled) {
    section += generateSnakeSetupInstructions(sanitizedUsername);
  }

  return section;
}

function generateSnakeAnimationSection(username: string): string {
  return `### 🐍 Contribution Snake Animation
<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/${username}/${username}/output/github-contribution-grid-snake-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/${username}/${username}/output/github-contribution-grid-snake.svg">
    <img alt="github contribution grid snake animation" src="https://raw.githubusercontent.com/${username}/${username}/output/github-contribution-grid-snake.svg">
  </picture>
</div>

`;
}

function generateActivityGraphSection(username: string, githubTheme: string): string {
  const activityTheme = githubTheme === 'radical' ? 'react-dark' : 
                       githubTheme === 'tokyonight' ? 'tokyo-night' : 
                       githubTheme === 'dracula' ? 'dracula' : 
                       githubTheme === 'merko' ? 'merko' : 'github-compact';
  
  return `### 📈 Contribution Activity
<div align="center">
  <img src="https://github-readme-activity-graph.vercel.app/graph?username=${username}&theme=${activityTheme}&hide_border=true&bg_color=0D1117&color=58A6FF&line=58A6FF&point=58A6FF" alt="GitHub Activity Graph" />
</div>

`;
}

function generateLanguageStatsSection(username: string, githubTheme: string): string {
  return `### 💻 Most Used Languages
<div align="center">
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&theme=${githubTheme}&hide_border=true&layout=compact&langs_count=10&card_width=500" alt="Top Languages" />
</div>

`;
}

function generateTrophiesSection(username: string, githubTheme: string): string {
  const trophyTheme = githubTheme === 'radical' ? 'radical' : 
                     githubTheme === 'tokyonight' ? 'tokyonight' : 
                     githubTheme === 'dracula' ? 'dracula' : 
                     githubTheme === 'merko' ? 'gruvbox' : 'flat';
  
  return `### 🏆 GitHub Trophies
<div align="center">
  <img src="https://github-profile-trophy.vercel.app/?username=${username}&theme=${trophyTheme}&no-frame=true&no-bg=true&margin-w=4&column=7" alt="GitHub Trophies" />
</div>

`;
}

function generateRepositoryInsightsSection(username: string, githubTheme: string): string {
  return `### ⭐ Repository Insights
<div align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=${githubTheme}&hide_border=true&count_private=true&include_all_commits=true&show=prs_merged,prs_merged_percentage" alt="Repository Insights" />
</div>

`;
}

function generateDetailedMetricsSection(username: string, githubTheme: string): string {
  return `### 📊 Detailed Code Metrics
<div align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=${githubTheme}&hide_border=true&count_private=true&include_all_commits=true&show=reviews,discussions_started,discussions_answered,prs_merged,prs_merged_percentage" alt="Detailed GitHub Stats" />
</div>

`;
}

function generateSnakeSetupInstructions(username: string): string {
  return `<details>
<summary>🔧 Snake Animation Setup Instructions</summary>

### Automated Snake Animation Setup

To enable the snake animation in your profile:

#### Step 1: Create the repository
1. Create a new **public** repository with the same name as your GitHub username (\`${username}\`)
2. If you already have a profile repository, you can use that

#### Step 2: Create the workflow file
Create a file at \`.github/workflows/snake.yml\` in your repository with this content:

\`\`\`yaml
name: Generate snake animation

on:
  # run automatically every 12 hours
  schedule:
    - cron: "0 */12 * * *" 
  
  # allows to manually run the job at any time
  workflow_dispatch:
  
  # run on every push on the master branch
  push:
    branches:
    - master

jobs:
  generate:
    permissions: 
      contents: write
    runs-on: ubuntu-latest
    timeout-minutes: 5
    
    steps:
      # generates a snake game from a github user contributions graph
      - name: generate github-contribution-grid-snake.svg
        uses: Platane/snk/svg-only@v3
        with:
          github_user_name: \${{ github.repository_owner }}
          outputs: |
            dist/github-contribution-grid-snake.svg
            dist/github-contribution-grid-snake-dark.svg?palette=github-dark
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
          
      # push the content to a branch
      - name: push github-contribution-grid-snake.svg to the output branch
        uses: crazy-max/ghaction-github-pages@v3.1.0
        with:
          target_branch: output
          build_dir: dist
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
\`\`\`

#### Step 3: Enable GitHub Actions
1. Go to your repository settings
2. Navigate to "Actions" → "General"  
3. Make sure "Allow all actions and reusable workflows" is selected
4. Save the settings

#### Step 4: Run the workflow
1. Go to the "Actions" tab in your repository
2. Click on "Generate snake animation" workflow
3. Click "Run workflow" to trigger it manually
4. Wait for it to complete (usually takes 1-2 minutes)

#### Step 5: Verify it's working
After the workflow completes successfully, the snake animation will be available and will automatically update every 12 hours with your latest contributions!

</details>

`;
}