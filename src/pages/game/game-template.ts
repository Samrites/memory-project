import type {
  BoardSizeOption,
  GameSettings,
  ThemeOption,
} from '../../app/game-settings';
import { applyTemplateTokens, readTemplatePartial } from '../../app/template-utils';
import { getThemeModifierClass, resolveTheme } from '../../app/theme-assets';
import codeVibesPlayerLabelIconRaw from '../../../puplic/designs/theme_1/label.svg?raw';
import foodsPlayerMarkerIconRaw from '../../../puplic/designs/theme2/Frame 614.svg?raw';
import exitButtonSprite from '../../../puplic/icons/icons_1/exitgame1.svg';
import backToGameButtonSprite from '../../../puplic/designs/theme_1/back-to-game-button.svg';
import exitGameButtonSprite from '../../../puplic/designs/theme_1/exit-game-button.svg';
import foodsExitHeaderButtonSprite from '../../../puplic/icons/icons_2/exit-game-button.svg';
import foodsExitHeaderButtonHoverSprite from '../../../puplic/icons/icons_2/exit-game-button-hover.svg';
import foodsBackToGameButtonSprite from '../../../puplic/icons/icons_2/back-to-game-button.svg';
import foodsBackToGameButtonHoverSprite from '../../../puplic/icons/icons_2/back-to-game-button-hover.svg';
import foodsExitOverlayButtonSprite from '../../../puplic/icons/icons_2/exit-game-button-overlay.svg';
import foodsExitOverlayButtonHoverSprite from '../../../puplic/icons/icons_2/exit-game-button-overlay-hover.svg';
import codeVibesCardBackSprite from '../../../puplic/icons/icons_1/Cards 5.svg';
import angularCardIcon from '../../../puplic/icons/icons_1/angular-card.svg';
import bootstrapCardIcon from '../../../puplic/icons/icons_1/bootstrap-card.svg';
import cssCardIcon from '../../../puplic/icons/icons_1/css-card.svg';
import databaseCardIcon from '../../../puplic/icons/icons_1/database-card.svg';
import djangoCardIcon from '../../../puplic/icons/icons_1/django-card.svg';
import firebaseCardIcon from '../../../puplic/icons/icons_1/firebase-card.svg';
import githubCardIcon from '../../../puplic/icons/icons_1/guthub-card.svg';
import html5CardIcon from '../../../puplic/icons/icons_1/html5-card.svg';
import jsCardIcon from '../../../puplic/icons/icons_1/js-card.svg';
import nodeCardIcon from '../../../puplic/icons/icons_1/node-card.svg';
import pythonCardIcon from '../../../puplic/icons/icons_1/python-card.svg';
import reactCardIcon from '../../../puplic/icons/icons_1/react-card.svg';
import sassCardIcon from '../../../puplic/icons/icons_1/sass-card.svg';
import terminalCardIcon from '../../../puplic/icons/icons_1/terminal-card.svg';
import tsCardIcon from '../../../puplic/icons/icons_1/ts-card.svg';
import vscodeCardIcon from '../../../puplic/icons/icons_1/vscode-card.svg';
import vueCardIcon from '../../../puplic/icons/icons_1/vue-card.svg';
import foodsCardBackSprite from '../../../puplic/icons/icons_2/back-card.svg';
import brezelCardIcon from '../../../puplic/icons/icons_2/brezel-card.svg';
import cakeCardIcon from '../../../puplic/icons/icons_2/cake-card.svg';
import chickenCardIcon from '../../../puplic/icons/icons_2/chicken-card.svg';
import chocolateCardIcon from '../../../puplic/icons/icons_2/chocolate-card.svg';
import corndogCardIcon from '../../../puplic/icons/icons_2/corndog-card.svg';
import donutCardIcon from '../../../puplic/icons/icons_2/donut-card.svg';
import hamburgerCardIcon from '../../../puplic/icons/icons_2/hamburger-card.svg';
import icecreamCardIcon from '../../../puplic/icons/icons_2/icecream-card.svg';
import macronCardIcon from '../../../puplic/icons/icons_2/macron-card.svg';
import muffinCardIcon from '../../../puplic/icons/icons_2/muffin-card.svg';
import pizzaCardIcon from '../../../puplic/icons/icons_2/pizza-card.svg';
import pommesCardIcon from '../../../puplic/icons/icons_2/pommes-card.svg';
import puddingCardIcon from '../../../puplic/icons/icons_2/pudding-card.svg';
import saladCardIcon from '../../../puplic/icons/icons_2/salad-card.svg';
import sandwichCardIcon from '../../../puplic/icons/icons_2/sandwich-card.svg';
import sushiCardIcon from '../../../puplic/icons/icons_2/sushi-card.svg';
import taccoCardIcon from '../../../puplic/icons/icons_2/tacco-card.svg';
import wraoCardIcon from '../../../puplic/icons/icons_2/wrao-card.svg';
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
  brezelCardIcon,
  cakeCardIcon,
  chickenCardIcon,
  chocolateCardIcon,
  corndogCardIcon,
  donutCardIcon,
  hamburgerCardIcon,
  icecreamCardIcon,
  macronCardIcon,
  muffinCardIcon,
  pizzaCardIcon,
  pommesCardIcon,
  puddingCardIcon,
  saladCardIcon,
  sandwichCardIcon,
  sushiCardIcon,
  taccoCardIcon,
  wraoCardIcon,
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
