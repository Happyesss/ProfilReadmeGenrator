import type { FormData } from '../types';
import { generateHeaderSection, generatePersonalInfoSection } from './headerGenerator';
import { generateTechStackSection } from './techStackIcons';
import { generateGitHubStatsSection } from './githubStatsGenerator';
import { generateAdvancedAnalyticsSection } from './advancedAnalyticsGenerator';
import { generateProjectsSection } from './projectsGenerator';
import { generateSocialLinksSection } from './socialLinksGenerator';
import { generateContactSection } from './contactGenerator';
import { generateFooterSection } from './footerGenerator';

export function generateReadme(data: FormData): string {
  const { 
    personalDetails, 
    headerStyle, 
    techStack, 
    githubTheme, 
    layout, 
    socialLinks, 
    projects, 
    contactPreference, 
    contactFormUrl, 
    metricsConfig 
  } = data;
  
  // Ensure we have a valid username: at least 3 characters, only letters/numbers/hyphens
  const username = personalDetails.githubUsername?.trim() || '';
  const hasValidUsername = username.length >= 3 && /^[a-zA-Z0-9\-]+$/.test(username);

  let readme = '';

  // Header Section
  readme += generateHeaderSection(
    headerStyle, 
    personalDetails.fullName, 
    personalDetails.title
  );

  // Personal Info Section
  readme += generatePersonalInfoSection(
    personalDetails.location,
    personalDetails.website,
    personalDetails.bio
  );

  // Tech Stack Section
  readme += generateTechStackSection(techStack);

  // GitHub Stats Section
  readme += generateGitHubStatsSection(
    username,
    githubTheme,
    layout,
    hasValidUsername
  );

  // Advanced Analytics Section
  readme += generateAdvancedAnalyticsSection(
    username,
    githubTheme,
    metricsConfig,
    hasValidUsername
  );

  // Featured Projects Section
  readme += generateProjectsSection(projects);

  // Social Links Section
  readme += generateSocialLinksSection(socialLinks);

  // Contact Section
  readme += generateContactSection(
    contactPreference,
    personalDetails.email,
    contactFormUrl,
    socialLinks
  );

  // Footer Section
  readme += generateFooterSection(username, personalDetails.fullName);

  return readme;
}