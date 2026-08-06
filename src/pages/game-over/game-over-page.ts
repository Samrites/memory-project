import { clearGameResult, getGameResult } from '../../app/game-result';
import { getGameSettings } from '../../app/game-settings';
import { createGameOverTemplate } from './game-over-template';

const WINNER_REVEAL_DELAY_MS = 3500;
const GAME_OVER_SCREEN_SELECTOR = '[data-game-over-screen]';
const BACK_HOME_BUTTON_SELECTOR = '[data-back-home-button]';
const WINNER_VISIBLE_CLASS = 'is-winner-visible';

/**
 * Mounts the game-over screen and schedules winner reveal.
 *
 * @param target Root element that receives the game-over markup.
 */
export function mountGameOverPage(target: HTMLElement): void {
  const gameResult = getGameResult();
  if (!gameResult) {
    window.location.hash = '#game';
    return;
  }

  target.innerHTML = createGameOverTemplate(gameResult, getGameSettings().theme);
  bindBackHomeButton(target);
  scheduleWinnerReveal(target);
}

function bindBackHomeButton(target: HTMLElement): void {
  const backHomeButton = target.querySelector<HTMLButtonElement>(BACK_HOME_BUTTON_SELECTOR);
  backHomeButton?.addEventListener('click', () => {
    clearGameResult();
    window.location.hash = '#home';
  });
}

function scheduleWinnerReveal(target: HTMLElement): void {
  const gameOverScreen = target.querySelector<HTMLElement>(GAME_OVER_SCREEN_SELECTOR);
  if (!gameOverScreen) {
    return;
  }

  window.setTimeout(() => {
    revealWinnerScreenIfActive(target, gameOverScreen);
  }, WINNER_REVEAL_DELAY_MS);
}

function revealWinnerScreenIfActive(target: HTMLElement, gameOverScreen: HTMLElement): void {
  if (!target.isConnected || window.location.hash !== '#game-over') {
    return;
  }

  gameOverScreen.classList.add(WINNER_VISIBLE_CLASS);
}
