import type { ThemeOption } from './models/game-settings';

export interface CardAsset {
  imagePath: string;
  label: string;
}

const CODE_NAMES = [
  'angular', 'bootstrap', 'css', 'database', 'django', 'firebase',
  'git', 'github', 'html', 'javascript', 'node', 'python', 'react',
  'sass', 'terminal', 'typescript', 'vscode', 'vue',
] as const;

const FOOD_NAMES = [
  'brezel', 'burger', 'cake', 'chicken', 'chocolate', 'cupcake',
  'donut', 'fries', 'hotdog', 'ice-cream', 'macarons', 'pizza',
  'pudding', 'salad', 'sandwich', 'sushi', 'taco', 'wrap',
] as const;

function createAssets(theme: ThemeOption, names: readonly string[]): CardAsset[] {
  return names.map((name) => ({
    imagePath: `./img/${theme}/${name}.png`,
    label: name.replaceAll('-', ' '),
  }));
}

export const CARD_ASSETS: Record<ThemeOption, CardAsset[]> = {
  code: createAssets('code', CODE_NAMES),
  food: createAssets('food', FOOD_NAMES),
};

export const CARD_BACKS: Record<ThemeOption, string> = {
  code: './img/code/back2.png',
  food: './img/food/back.png',
};
