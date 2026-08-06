/**
 * Replaces `{{TOKEN}}` placeholders in a raw template string.
 *
 * @param template Raw template source.
 * @param tokens Key-value map for placeholders.
 * @returns Template with all placeholders replaced.
 */
export function applyTemplateTokens(
  template: string,
  tokens: Record<string, string>,
): string {
  let resolvedTemplate = template;
  Object.entries(tokens).forEach(([token, value]) => {
    resolvedTemplate = resolvedTemplate.replaceAll(`{{${token}}}`, value);
  });
  return resolvedTemplate;
}

/**
 * Reads one `<template id="...">` fragment from a partials file.
 *
 * @param partialsMarkup Raw partials file content.
 * @param templateId Requested template id.
 * @returns Inner HTML of the template or an empty string.
 */
export function readTemplatePartial(partialsMarkup: string, templateId: string): string {
  const escapedId = templateId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`<template\\s+id="${escapedId}"[^>]*>([\\s\\S]*?)<\\/template>`);
  const match = partialsMarkup.match(pattern);
  return match ? match[1].trim() : '';
}
