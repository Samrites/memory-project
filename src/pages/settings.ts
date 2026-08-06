import type { BoardSize, ThemeOption } from '../models/game-settings';

interface ChoiceOption {
  label: string;
  name: string;
  value: string;
}

const THEME_OPTIONS: ChoiceOption[] = [
  { label: 'Code vibes theme', name: 'theme', value: 'code' },
  { label: 'Foods theme', name: 'theme', value: 'food' },
];

const PLAYER_OPTIONS: ChoiceOption[] = [
  { label: 'Blue', name: 'player', value: 'blue' },
  { label: 'Orange', name: 'player', value: 'orange' },
];

const BOARD_OPTIONS: ChoiceOption[] = [
  { label: '16 cards', name: 'board-size', value: '16' },
  { label: '24 cards', name: 'board-size', value: '24' },
  { label: '36 cards', name: 'board-size', value: '36' },
];

function renderOption(option: ChoiceOption): string {
  const previewAttribute = option.name === 'theme'
    ? `data-theme-preview="${option.value}"`
    : '';

  return `
    <label class="choice" ${previewAttribute}>
      <input type="radio" name="${option.name}" value="${option.value}">
      <span class="choice__label">${option.label}</span>
    </label>
  `;
}

function renderOptions(options: ChoiceOption[]): string {
  return options.map(renderOption).join('');
}

function renderIcon(path: string): string {
  return `<img class="settings-group__icon" src="${path}" alt="" aria-hidden="true">`;
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
            <fieldset class="settings-group">
              <legend>${renderIcon('./img/icons/game-theme.svg')}<span>Game themes</span></legend>
              <div class="choice-list">${renderOptions(THEME_OPTIONS)}</div>
            </fieldset>

            <fieldset class="settings-group">
              <legend>${renderIcon('./img/icons/player.svg')}<span>Choose player</span></legend>
              <div class="choice-list">${renderOptions(PLAYER_OPTIONS)}</div>
            </fieldset>

            <fieldset class="settings-group">
              <legend>${renderIcon('./img/icons/board-size.svg')}<span>Board size</span></legend>
              <div class="choice-list">${renderOptions(BOARD_OPTIONS)}</div>
            </fieldset>
          </form>

          <section class="settings-preview-column" aria-label="Theme preview and selected settings">
            <figure class="theme-preview" id="theme-preview" data-preview-theme="code" aria-live="polite">
              <img class="theme-preview__image" id="theme-preview-image" src="./img/previews/code-preview.png" alt="Preview of the Code Vibes theme">
            </figure>

            <div class="settings-actions">
              <div class="settings-summary" aria-live="polite">
                <span id="summary-theme">Game theme</span>
                <i aria-hidden="true"></i>
                <span id="summary-player">Player</span>
                <i aria-hidden="true"></i>
                <span id="summary-board">Board size</span>
              </div>
              <button class="settings-form__start" id="settings-start-button" form="settings-form" type="submit" disabled>
                <span aria-hidden="true">▣</span><span>Start</span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </section>
  `;
}

export function readChoice<T extends string>(name: string): T | null {
  const selected = document.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`);
  return selected ? selected.value as T : null;
}

export function readBoardSize(): BoardSize | null {
  const selectedValue = readChoice<string>('board-size');
  if (!selectedValue) return null;

  const boardSize = Number(selectedValue);
  return boardSize === 16 || boardSize === 24 || boardSize === 36 ? boardSize : null;
}

export function getSelectedTheme(): ThemeOption | null {
  return readChoice<ThemeOption>('theme');
}
