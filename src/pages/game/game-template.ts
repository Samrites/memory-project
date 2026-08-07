import type {
  BoardSizeOption,
  GameSettings,
  ThemeOption,
} from '../../app/game-settings';
import { applyTemplateTokens, readTemplatePartial } from '../../app/template-utils';
import { getThemeModifierClass, resolveTheme } from '../../app/theme-assets';
import codeVibesPlayerLabelIconRaw from '../../assets/designs/code-vibes/label.svg?raw';
import foodsPlayerMarkerIconRaw from '../../assets/designs/foods/frame-614.svg?raw';
import exitButtonSprite from '../../assets/icons/code-vibes/exit-game-icon.svg';
import backToGameButtonSprite from '../../assets/designs/code-vibes/back-to-game-button.svg';
import exitGameButtonSprite from '../../assets/designs/code-vibes/exit-game-button.svg';
import foodsExitHeaderButtonSprite from '../../assets/icons/foods/exit-game-button.svg';
import foodsExitHeaderButtonHoverSprite from '../../assets/icons/foods/exit-game-button-hover.svg';
import foodsBackToGameButtonSprite from '../../assets/icons/foods/back-to-game-button.svg';
import foodsBackToGameButtonHoverSprite from '../../assets/icons/foods/back-to-game-button-hover.svg';
import foodsExitOverlayButtonSprite from '../../assets/icons/foods/exit-game-button-overlay.svg';
import foodsExitOverlayButtonHoverSprite from '../../assets/icons/foods/exit-game-button-overlay-hover.svg';
import codeVibesCardBackSprite from '../../assets/icons/code-vibes/card-back.svg';
import angularCardIcon from '../../assets/icons/code-vibes/angular-card.svg';
import bootstrapCardIcon from '../../assets/icons/code-vibes/bootstrap-card.svg';
import cssCardIcon from '../../assets/icons/code-vibes/css-card.svg';
import databaseCardIcon from '../../assets/icons/code-vibes/database-card.svg';
import djangoCardIcon from '../../assets/icons/code-vibes/django-card.svg';
import firebaseCardIcon from '../../assets/icons/code-vibes/firebase-card.svg';
import githubCardIcon from '../../assets/icons/code-vibes/github-card.svg';
import html5CardIcon from '../../assets/icons/code-vibes/html5-card.svg';
import jsCardIcon from '../../assets/icons/code-vibes/js-card.svg';
import nodeCardIcon from '../../assets/icons/code-vibes/node-card.svg';
import pythonCardIcon from '../../assets/icons/code-vibes/python-card.svg';
import reactCardIcon from '../../assets/icons/code-vibes/react-card.svg';
import sassCardIcon from '../../assets/icons/code-vibes/sass-card.svg';
import terminalCardIcon from '../../assets/icons/code-vibes/terminal-card.svg';
import tsCardIcon from '../../assets/icons/code-vibes/ts-card.svg';
import vscodeCardIcon from '../../assets/icons/code-vibes/vscode-card.svg';
import vueCardIcon from '../../assets/icons/code-vibes/vue-card.svg';
import foodsCardBackSprite from '../../assets/icons/foods/back-card.svg';
import pretzelCardIcon from '../../assets/icons/foods/pretzel-card.svg';
import cakeCardIcon from '../../assets/icons/foods/cake-card.svg';
import chickenCardIcon from '../../assets/icons/foods/chicken-card.svg';
import chocolateCardIcon from '../../assets/icons/foods/chocolate-card.svg';
import corndogCardIcon from '../../assets/icons/foods/corndog-card.svg';
import donutCardIcon from '../../assets/icons/foods/donut-card.svg';
import hamburgerCardIcon from '../../assets/icons/foods/hamburger-card.svg';
import iceCreamCardIcon from '../../assets/icons/foods/ice-cream-card.svg';
import macaronCardIcon from '../../assets/icons/foods/macaron-card.svg';
import muffinCardIcon from '../../assets/icons/foods/muffin-card.svg';
import pizzaCardIcon from '../../assets/icons/foods/pizza-card.svg';
import friesCardIcon from '../../assets/icons/foods/fries-card.svg';
import puddingCardIcon from '../../assets/icons/foods/pudding-card.svg';
import saladCardIcon from '../../assets/icons/foods/salad-card.svg';
import sandwichCardIcon from '../../assets/icons/foods/sandwich-card.svg';
import sushiCardIcon from '../../assets/icons/foods/sushi-card.svg';
import tacoCardIcon from '../../assets/icons/foods/taco-card.svg';
import wrapCardIcon from '../../assets/icons/foods/wrap-card.svg';
import gameTemplateMarkup from './game-template.html?raw';
import gamePartialsMarkup from './game-partials.html?raw';

interface ThemeCardAssets {
  backCardSprite: string;
  faceIcons: string[];
}

const CODE_VIBES_CARD_FACE_ICONS: string[] = [
  angularCardIcon,
  bootstrapCardIcon,
  cssCardIcon,
  databaseCardIcon,
  djangoCardIcon,
  firebaseCardIcon,
  githubCardIcon,
  html5CardIcon,
  jsCardIcon,
  nodeCardIcon,
  pythonCardIcon,
  reactCardIcon,
  sassCardIcon,
  terminalCardIcon,
  tsCardIcon,
  vscodeCardIcon,
  vueCardIcon,
];

const FOODS_CARD_FACE_ICONS: string[] = [
  pretzelCardIcon,
  cakeCardIcon,
  chickenCardIcon,
  chocolateCardIcon,
  corndogCardIcon,
  donutCardIcon,
  hamburgerCardIcon,
  iceCreamCardIcon,
  macaronCardIcon,
  muffinCardIcon,
  pizzaCardIcon,
  friesCardIcon,
  puddingCardIcon,
  saladCardIcon,
  sandwichCardIcon,
  sushiCardIcon,
  tacoCardIcon,
  wrapCardIcon,
];

const THEME_CARD_ASSETS: Record<ThemeOption, ThemeCardAssets> = {
  'code-vibes': {
    backCardSprite: codeVibesCardBackSprite,
    faceIcons: CODE_VIBES_CARD_FACE_ICONS,
  },
  foods: {
    backCardSprite: foodsCardBackSprite,
    faceIcons: FOODS_CARD_FACE_ICONS,
  },
};
const GAME_HUD_CODE_VIBES_TEMPLATE = readTemplatePartial(gamePartialsMarkup, 'game-hud-code-vibes');
const GAME_HUD_FOODS_TEMPLATE = readTemplatePartial(gamePartialsMarkup, 'game-hud-foods');
const GAME_EXIT_MODAL_CODE_VIBES_TEMPLATE = readTemplatePartial(
  gamePartialsMarkup,
  'game-exit-modal-code-vibes',
);
const GAME_EXIT_MODAL_FOODS_TEMPLATE = readTemplatePartial(
  gamePartialsMarkup,
  'game-exit-modal-foods',
);
const GAME_CARD_TEMPLATE = readTemplatePartial(gamePartialsMarkup, 'game-card');

/**
 * Builds the game screen markup for the active settings.
 *
 * @param settings Selected game settings.
 * @returns Game screen HTML string.
 */
export function createGameTemplate(settings: GameSettings): string {
  const selectedTheme = resolveTheme(settings.theme);
  const gameThemeClassName = getThemeModifierClass(settings.theme);
  const boardSize = settings.boardSize ?? '16';
  const boardSizeClassName = readBoardSizeClassName(boardSize);
  const boardCards = createBoardCards(boardSize, selectedTheme);
  const playerMarkerClassName = settings.player === 'orange'
    ? ' is-orange'
    : ' is-blue';
  const hudMarkup = selectedTheme === 'foods'
    ? createFoodsHud(playerMarkerClassName)
    : createCodeVibesHud(playerMarkerClassName);

  return applyTemplateTokens(gameTemplateMarkup, {
    BOARD_CARDS: boardCards,
    BOARD_SIZE: boardSize,
    BOARD_SIZE_CLASS_NAME: boardSizeClassName,
    EXIT_MODAL_MARKUP: createExitModalMarkup(selectedTheme),
    GAME_THEME_CLASS_NAME: gameThemeClassName,
    HUD_MARKUP: hudMarkup,
  });
}

function createCodeVibesHud(playerMarkerClassName: string): string {
  const playerLabelIcon = createCodeVibesPlayerLabelIconMarkup();
  return applyTemplateTokens(GAME_HUD_CODE_VIBES_TEMPLATE, {
    EXIT_BUTTON_SRC: exitButtonSprite,
    PLAYER_LABEL_ICON: playerLabelIcon,
    PLAYER_MARKER_CLASS_NAME: playerMarkerClassName,
  });
}

function createCodeVibesPlayerLabelIconMarkup(): string {
  return codeVibesPlayerLabelIconRaw
    .replace(/fill="#2BB1FF"/gi, 'fill="currentColor"')
    .trim();
}

function createFoodsHud(playerMarkerClassName: string): string {
  const scoreIcon = createFoodsScoreIconMarkup();
  const playerMarkerIcon = createFoodsPlayerMarkerIconMarkup();
  return applyTemplateTokens(GAME_HUD_FOODS_TEMPLATE, {
    FOODS_EXIT_HEADER_BUTTON_HOVER_SRC: foodsExitHeaderButtonHoverSprite,
    FOODS_EXIT_HEADER_BUTTON_SRC: foodsExitHeaderButtonSprite,
    FOODS_PLAYER_MARKER_ICON: playerMarkerIcon,
    FOODS_SCORE_ICON: scoreIcon,
    PLAYER_MARKER_CLASS_NAME: playerMarkerClassName,
  });
}

function createFoodsScoreIconMarkup(): string {
  return foodsPlayerMarkerIconRaw
    .replace(/<rect[^>]*fill="#097FC5"[^>]*\/>\s*/gi, '')
    .replace(/fill="white"/gi, 'fill="currentColor"')
    .trim();
}

function createFoodsPlayerMarkerIconMarkup(): string {
  return foodsPlayerMarkerIconRaw
    .replace(/fill="#097FC5"/gi, 'fill="currentColor"')
    .trim();
}

function createExitModalMarkup(theme: ThemeOption): string {
  if (theme === 'foods') {
    return createFoodsExitModalMarkup();
  }

  return createCodeVibesExitModalMarkup();
}

function createCodeVibesExitModalMarkup(): string {
  return applyTemplateTokens(GAME_EXIT_MODAL_CODE_VIBES_TEMPLATE, {
    BACK_TO_GAME_BUTTON_SRC: backToGameButtonSprite,
    EXIT_GAME_BUTTON_SRC: exitGameButtonSprite,
  });
}

function createFoodsExitModalMarkup(): string {
  return applyTemplateTokens(GAME_EXIT_MODAL_FOODS_TEMPLATE, {
    FOODS_BACK_TO_GAME_BUTTON_HOVER_SRC: foodsBackToGameButtonHoverSprite,
    FOODS_BACK_TO_GAME_BUTTON_SRC: foodsBackToGameButtonSprite,
    FOODS_EXIT_OVERLAY_BUTTON_HOVER_SRC: foodsExitOverlayButtonHoverSprite,
    FOODS_EXIT_OVERLAY_BUTTON_SRC: foodsExitOverlayButtonSprite,
  });
}

function createBoardCards(
  boardSize: BoardSizeOption,
  theme: ThemeOption,
): string {
  const parsedCount = Number.parseInt(boardSize, 10);
  const cardCount = Number.isFinite(parsedCount) && parsedCount > 0
    ? parsedCount
    : 16;
  const themeCardAssets = THEME_CARD_ASSETS[theme];
  const pairCount = Math.floor(cardCount / 2);
  const pairIcons = createPairIcons(pairCount, theme);
  const cardIconsDeck = shuffleArray([...pairIcons, ...pairIcons]);

  return cardIconsDeck.map((cardIcon, index) => {
    return applyTemplateTokens(GAME_CARD_TEMPLATE, {
      BACK_CARD_SPRITE: themeCardAssets.backCardSprite,
      CARD_ICON: cardIcon,
      CARD_INDEX: String(index),
    });
  }).join('');
}

function createPairIcons(pairCount: number, theme: ThemeOption): string[] {
  const faceIcons = THEME_CARD_ASSETS[theme].faceIcons;

  return Array.from({ length: pairCount }, (_, index) => {
    return faceIcons[index % faceIcons.length];
  });
}

function shuffleArray<T>(items: T[]): T[] {
  const shuffledItems = [...items];
  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledItems[index], shuffledItems[randomIndex]] = [
      shuffledItems[randomIndex],
      shuffledItems[index],
    ];
  }

  return shuffledItems;
}

function readBoardSizeClassName(boardSize: BoardSizeOption): string {
  if (boardSize === '24') {
    return 'game-screen--board-24';
  }

  if (boardSize === '36') {
    return 'game-screen--board-36';
  }

  return 'game-screen--board-16';
}
