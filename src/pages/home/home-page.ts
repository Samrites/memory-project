import { createHomeTemplate } from './home-template';

const PLAY_BUTTON_SELECTOR = '#play-button';

/**
 * Mounts the home page and binds the play action.
 *
 * @param target Root element that receives the home markup.
 */
export function mountHomePage(target: HTMLElement): void {
  target.innerHTML = createHomeTemplate();
  bindHomeEvents(target);
}

function bindHomeEvents(target: HTMLElement): void {
  const playButtonRef = target.querySelector<HTMLButtonElement>(PLAY_BUTTON_SELECTOR);
  if (!playButtonRef) {
    return;
  }

  playButtonRef.addEventListener('click', openSettingsScreen);
}

function openSettingsScreen(): void {
  window.location.hash = '#settings';
}
