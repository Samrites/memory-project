import type { ThemeOption } from './game-settings';

interface ThemeAssets {
  cssModifierClass: string;
}

const DEFAULT_THEME: ThemeOption = 'code-vibes';

const THEME_ASSETS: Record<ThemeOption, ThemeAssets> = {
  'code-vibes': {
    cssModifierClass: 'game-screen--code-vibes',
  },
  foods: {
    cssModifierClass: 'game-screen--foods',
  },
};

/**
 * Resolves nullable theme values to the default theme.
 *
 * @param theme Selected theme or null.
 * @returns A valid theme option.
 */
export function resolveTheme(theme: ThemeOption | null): ThemeOption {
  return theme ?? DEFAULT_THEME;
}

/**
 * Returns the CSS modifier class for the provided theme.
 *
 * @param theme Selected theme or null.
 * @returns Theme-specific CSS modifier class.
 */
export function getThemeModifierClass(theme: ThemeOption | null): string {
  return THEME_ASSETS[resolveTheme(theme)].cssModifierClass;
}
