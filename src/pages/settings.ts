import type { BoardSize, PlayerColor, ThemeOption } from '../models/game-settings';

function option(name: string, value: string, label: string): string {
  return `
    <label class="choice" data-theme-preview="${name === 'theme' ? value : ''}">
      <input type="radio" name="${name}" value="${value}">
      <span>${label}</span>
    </label>
  `;
}

export function renderSettings(): string {
  return `
    <section class="settings-screen" aria-labelledby="settings-title">
      <div class="settings-screen__content">
        <header class="settings-screen__header">
          <h1 id="settings-title">Settings</h1>
        </header>

        <div class="settings-screen__layout">
          <form class="settings-form" id="settings-form">
            <fieldset class="settings-group settings-group--theme">
              <legend>🎨 Game themes</legend>
              <div class="choice-list">
                ${option('theme', 'code', 'Code vibes theme')}
                ${option('theme', 'food', 'Foods theme')}
              </div>
            </fieldset>

            <fieldset class="settings-group settings-group--player">
              <legend>♟ Choose player</legend>
              <div class="choice-list">
                ${option('player', 'blue', 'Blue')}
                ${option('player', 'orange', 'Orange')}
              </div>
            </fieldset>

            <fieldset class="settings-group settings-group--size">
              <legend>▱ Board size</legend>
              <div class="choice-list">
                ${option('board-size', '16', '16 cards')}
                ${option('board-size', '24', '24 cards')}
                ${option('board-size', '36', '36 cards')}
              </div>
            </fieldset>
          </form>

          <div class="settings-preview-column">
            <figure class="theme-preview" aria-live="polite">
              <div class="theme-preview__placeholder" id="theme-preview-placeholder">
                Choose a theme to see the preview
              </div>
              <img
                class="theme-preview__image is-hidden"
                id="theme-preview-image"
                src=""
                alt=""
              >
            </figure>

            <div class="settings-actions">
              <div class="settings-steps" aria-hidden="true">
                <span>Game theme</span><i></i><span>Player</span><i></i><span>Board size</span>
              </div>
              <button class="settings-form__start primary-button" id="settings-start-button" form="settings-form" type="submit" disabled>
                ▣ Start
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function readChoice<T extends string>(name: string): T | null {
  return document.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`)?.value as T | null;
}

export function readBoardSize(): BoardSize | null {
  const value = readChoice<string>('board-size');
  return value ? Number(value) as BoardSize : null;
}

export type SettingsChoice = PlayerColor | ThemeOption;
