import type { FormData } from '../types';
import { generateModernTemplate } from './modernTemplateGenerator';
import { generateClassicTemplate } from './classicTemplateGenerator';
import { generateMinimalTemplate } from './minimalTemplateGenerator';
import { generateExactTemplate } from './exactTemplateGenerator';

export function generateTemplateReadme(data: FormData): string {
  const { profileTemplate } = data;

  switch (profileTemplate.template) {
    case 'exact':
      return generateExactTemplate(data);
    case 'modern':
      return generateModernTemplate(data);
    case 'classic':
      return generateClassicTemplate(data);
    case 'minimal':
      return generateMinimalTemplate(data);
    default:
      return generateExactTemplate(data);
  }
}