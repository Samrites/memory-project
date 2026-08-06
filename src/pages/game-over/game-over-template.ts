import type { GameResult } from '../../app/game-result';
import type { ThemeOption } from '../../app/game-settings';
import { applyTemplateTokens, readTemplatePartial } from '../../app/template-utils';
import { resolveTheme } from '../../app/theme-assets';
import confettiAsset from '../../../puplic/designs/theme_1/Confetti.svg?url';
import codeVibesPlayerLabelIconRaw from '../../../puplic/designs/theme_1/label.svg?raw';
import foodsPlayerLabelIconRaw from '../../../puplic/designs/theme2/Frame 614.svg?raw';
import backToGameButtonSprite from '../../../puplic/designs/theme_1/back-to-game-button.svg';
import foodsHomeButtonSprite from '../../../puplic/designs/theme2/home-button.svg';
import foodsWinnerBluePlayerSprite from '../../../puplic/designs/theme2/player-blue.svg';
import foodsWinnerOrangePlayerSprite from '../../../puplic/designs/theme2/player-orange.svg';
import gameOverTemplateMarkup from './game-over-template.html?raw';
import gameOverPartialsMarkup from './game-over-partials.html?raw';
const GAME_OVER_CONFETTI_TEMPLATE = readTemplatePartial(gameOverPartialsMarkup, 'game-over-confetti');
const GAME_OVER_WINNER_CODE_VIBES_TEMPLATE = readTemplatePartial(
  gameOverPartialsMarkup,
  'game-over-winner-code-vibes',
);
const GAME_OVER_WINNER_FOODS_TEMPLATE = readTemplatePartial(
  gameOverPartialsMarkup,
  'game-over-winner-foods',
);
const GAME_OVER_WINNER_PLAYER_ICON_FOODS_TEMPLATE = readTemplatePartial(
  gameOverPartialsMarkup,
  'game-over-winner-player-icon-foods',
);
const GAME_OVER_SUMMARY_FOODS_TEMPLATE = readTemplatePartial(
  gameOverPartialsMarkup,
  'game-over-summary-foods',
);
const GAME_OVER_SUMMARY_CODE_VIBES_TEMPLATE = readTemplatePartial(
  gameOverPartialsMarkup,
  'game-over-summary-code-vibes',
);
const GAME_OVER_SUMMARY_FOODS_ROW_TEMPLATE = readTemplatePartial(
  gameOverPartialsMarkup,
  'game-over-summary-foods-row',
);
const GAME_OVER_SUMMARY_CODE_VIBES_ROW_TEMPLATE = readTemplatePartial(
  gameOverPartialsMarkup,
  'game-over-summary-code-vibes-row',
);

/**
 * Builds the game-over and winner markup for the selected theme.
 *
 * @param result Final score result.
 * @param theme Selected game theme.
 * @returns Game-over screen HTML string.
 */
export function createGameOverTemplate(
  result: GameResult,
  theme: ThemeOption | null,
): string {
  const resolvedTheme = resolveTheme(theme);
  const isFoodsTheme = resolvedTheme === 'foods';
  const winner = getWinnerPresentation(result);
  const scoreSummary = createScoreSummaryMarkup(result, resolvedTheme);

  return applyTemplateTokens(gameOverTemplateMarkup, {
    BACK_HOME_BUTTON_IMAGE_CLASS_NAME: readBackHomeButtonImageClassName(isFoodsTheme),
    BACK_HOME_BUTTON_SRC: readBackHomeButtonSprite(isFoodsTheme),
    CONFETTI_MARKUP: isFoodsTheme ? '' : createConfettiMarkup(),
    SCORE_SUMMARY_MARKUP: scoreSummary,
    THEME_CLASS_NAME: isFoodsTheme ? 'game-over-screen--foods' : 'game-over-screen--code-vibes',
    WINNER_CONTENT_MARKUP: createWinnerContentMarkup(
      winner,
      isFoodsTheme,
      scoreSummary,
    ),
  });
}

function createWinnerContentMarkup(
  winner: WinnerPresentation,
  isFoodsTheme: boolean,
  scoreSummary: string,
): string {
  if (isFoodsTheme) {
    return createFoodsWinnerContentMarkup(winner);
  }

  return createCodeVibesWinnerContentMarkup(winner, scoreSummary);
}

function createConfettiMarkup(): string {
  return applyTemplateTokens(GAME_OVER_CONFETTI_TEMPLATE, {
    CONFETTI_SRC: confettiAsset,
  });
}

function createCodeVibesWinnerContentMarkup(
  winner: WinnerPresentation,
  scoreSummary: string,
): string {
  return applyTemplateTokens(GAME_OVER_WINNER_CODE_VIBES_TEMPLATE, {
    SCORE_SUMMARY_MARKUP: scoreSummary,
    WINNER_LABEL: winner.label,
    WINNER_PLAYER_CLASS_NAME: winner.className,
    WINNER_PREFIX_MARKUP: winner.isDraw
      ? ''
      : '<p class="game-over-screen__winner-prefix">the winner is</p>',
  });
}

function createFoodsWinnerContentMarkup(winner: WinnerPresentation): string {
  return applyTemplateTokens(GAME_OVER_WINNER_FOODS_TEMPLATE, {
    PLAYER_ICON_MARKUP: createFoodsWinnerPlayerIconMarkup(winner),
    WINNER_LABEL: winner.label,
    WINNER_PLAYER_CLASS_NAME: winner.className,
    WINNER_PREFIX_MARKUP: winner.isDraw
      ? ''
      : '<p class="game-over-screen__winner-prefix">The winner is</p>',
  });
}

function createFoodsWinnerPlayerIconMarkup(winner: WinnerPresentation): string {
  if (winner.isDraw) {
    return '';
  }

  const isOrangeWinner = winner.className === 'game-over-screen__winner-player--orange';
  return applyTemplateTokens(GAME_OVER_WINNER_PLAYER_ICON_FOODS_TEMPLATE, {
    WINNER_ICON_ALT: isOrangeWinner ? 'Orange player icon' : 'Blue player icon',
    WINNER_ICON_SRC: isOrangeWinner
      ? foodsWinnerOrangePlayerSprite
      : foodsWinnerBluePlayerSprite,
  });
}

function createCodeVibesPlayerLabelIconMarkup(): string {
  return codeVibesPlayerLabelIconRaw
    .replace(/fill="#2BB1FF"/gi, 'fill="currentColor"')
    .trim();
}

function createFoodsPlayerLabelIconMarkup(): string {
  return foodsPlayerLabelIconRaw
    .replace(/fill="#097FC5"/gi, 'fill="currentColor"')
    .trim();
}

function createScoreSummaryMarkup(
  result: GameResult,
  theme: ThemeOption,
): string {
  if (theme === 'foods') {
    return createFoodsScoreSummaryMarkup(result);
  }

  return createCodeVibesScoreSummaryMarkup(result);
}

function createFoodsScoreSummaryMarkup(result: GameResult): string {
  const playerLabelIcon = createFoodsPlayerLabelIconMarkup();
  return applyTemplateTokens(GAME_OVER_SUMMARY_FOODS_TEMPLATE, {
    FOODS_BLUE_SCORE_ROW: createFoodsScoreRow('blue', result.blueScore, playerLabelIcon),
    FOODS_ORANGE_SCORE_ROW: createFoodsScoreRow('orange', result.orangeScore, playerLabelIcon),
  });
}

function createFoodsScoreRow(
  playerColor: 'blue' | 'orange',
  playerScore: number,
  playerLabelIcon: string,
): string {
  return applyTemplateTokens(GAME_OVER_SUMMARY_FOODS_ROW_TEMPLATE, {
    PLAYER_COLOR: playerColor,
    PLAYER_LABEL_ICON: playerLabelIcon,
    PLAYER_SCORE: String(playerScore),
  });
}

function createCodeVibesScoreSummaryMarkup(result: GameResult): string {
  const playerLabelIcon = createCodeVibesPlayerLabelIconMarkup();
  return applyTemplateTokens(GAME_OVER_SUMMARY_CODE_VIBES_TEMPLATE, {
    CODE_VIBES_BLUE_SCORE_ROW: createCodeVibesScoreRow(
      'blue',
      'Blue',
      result.blueScore,
      playerLabelIcon,
    ),
    CODE_VIBES_ORANGE_SCORE_ROW: createCodeVibesScoreRow(
      'orange',
      'Orange',
      result.orangeScore,
      playerLabelIcon,
    ),
  });
}

function createCodeVibesScoreRow(
  playerColor: 'blue' | 'orange',
  playerName: string,
  playerScore: number,
  playerLabelIcon: string,
): string {
  return applyTemplateTokens(GAME_OVER_SUMMARY_CODE_VIBES_ROW_TEMPLATE, {
    PLAYER_COLOR: playerColor,
    PLAYER_LABEL_ICON: playerLabelIcon,
    PLAYER_NAME: playerName,
    PLAYER_SCORE: String(playerScore),
  });
}

function readBackHomeButtonSprite(isFoodsTheme: boolean): string {
  return isFoodsTheme ? foodsHomeButtonSprite : backToGameButtonSprite;
}

function readBackHomeButtonImageClassName(isFoodsTheme: boolean): string {
  if (isFoodsTheme) {
    return 'game-over-screen__back-home-button-image game-over-screen__back-home-button-image--foods';
  }

  return 'game-over-screen__back-home-button-image';
}

interface WinnerPresentation {
  isDraw: boolean;
  className: string;
  label: string;
}

function getWinnerPresentation(result: GameResult): WinnerPresentation {
  if (result.blueScore > result.orangeScore) {
    return {
      isDraw: false,
      className: 'game-over-screen__winner-player--blue',
      label: 'BLUE PLAYER',
    };
  }

  if (result.orangeScore > result.blueScore) {
    return {
      isDraw: false,
      className: 'game-over-screen__winner-player--orange',
      label: 'ORANGE PLAYER',
    };
  }

  return {
    isDraw: true,
    className: 'game-over-screen__winner-player--draw',
    label: 'DRAW',
  };
}
