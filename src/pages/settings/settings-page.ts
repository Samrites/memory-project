import {
  getGameSettings,
  hasCompleteSettings,
  isBoardSizeOption,
  type GameSettings,
  isPlayerOption,
  isThemeOption,
  setBoardSize,
  setGameTheme,
  setPlayer,
} from '../../app/game-settings';
import { clearGameResult } from '../../app/game-result';
import { createSettingsTemplate } from './settings-template';

const OPTION_SELECTOR = '.settings-option';
const THEME_OPTION_SELECTOR = '.settings-option[data-group="theme"]';
const OPTION_LINE_SELECTOR = '.settings-option__line';
const OPTION_MARKER_SELECTOR = '.settings-option__marker';
const FOOTER_SEPARATOR_SELECTOR = '.settings-footer__separator';
const PREVIEW_IMAGE_SELECTOR = '.settings-preview__image';
const START_BUTTON_SELECTOR = '#start-game-button';
const FOOTER_REFRESH_CLASS = 'is-refreshing';

type SettingsGroup = 'boardSize' | 'player' | 'theme';

/**
 * Mounts the settings page and wires selection interactions.
 *
 * @param target Root element that receives the settings markup.
 */
export function mountSettingsPage(target: HTMLElement): void {
  target.innerHTML = createSettingsTemplate(getGameSettings());
  bindOptionEvents(target);
  bindThemePreviewEvents(target);
  bindStartButton(target);
  syncPreviewImage(target, getGameSettings().theme);
}

function bindOptionEvents(target: HTMLElement): void {
  const optionButtons = target.querySelectorAll<HTMLButtonElement>(OPTION_SELECTOR);
  optionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      handleOptionSelection(target, button.dataset.group, button.dataset.value);
    });
  });
}

function handleOptionSelection(
  target: HTMLElement,
  group?: string,
  value?: string,
): void {
  if (!group || !value) {
    return;
  }

  applySelection(group, value);
  syncSettingsUi(target, getGameSettings());
}

function applySelection(group: string, value: string): void {
  const handler = resolveSelectionHandler(group);
  if (handler) {
    handler(value);
  }
}

function resolveSelectionHandler(group: string): ((value: string) => void) | null {
  if (group === 'theme') {
    return applyThemeSelection;
  }
  if (group === 'player') {
    return applyPlayerSelection;
  }
  if (group === 'boardSize') {
    return applyBoardSizeSelection;
  }
  return null;
}

function applyThemeSelection(value: string): void {
  if (isThemeOption(value)) {
    setGameTheme(value);
  }
}

function applyPlayerSelection(value: string): void {
  if (isPlayerOption(value)) {
    setPlayer(value);
  }
}

function applyBoardSizeSelection(value: string): void {
  if (isBoardSizeOption(value)) {
    setBoardSize(value);
  }
}

function syncSettingsUi(target: HTMLElement, settings: GameSettings): void {
  syncOptions(target, settings);
  syncFooterSummary(target, settings);
  syncStartButtonState(target);
  syncPreviewImage(target, settings.theme);
}

function bindThemePreviewEvents(target: HTMLElement): void {
  const themeOptionButtons = target.querySelectorAll<HTMLButtonElement>(THEME_OPTION_SELECTOR);
  themeOptionButtons.forEach((button) => {
    bindThemePreviewHandlers(target, button);
  });
}

function bindThemePreviewHandlers(target: HTMLElement, button: HTMLButtonElement): void {
  const showPreview = (): void => syncHoveredThemePreview(target, button.dataset.previewTheme);
  const resetPreview = (): void => syncPreviewImage(target, getGameSettings().theme);

  button.addEventListener('mouseenter', showPreview);
  button.addEventListener('mouseleave', resetPreview);
  button.addEventListener('focus', showPreview);
  button.addEventListener('blur', resetPreview);
}

function syncHoveredThemePreview(target: HTMLElement, hoveredTheme?: string): void {
  if (!hoveredTheme || !isThemeOption(hoveredTheme)) {
    return;
  }

  syncPreviewImage(target, hoveredTheme);
}

function syncPreviewImage(target: HTMLElement, theme: GameSettings['theme']): void {
  const previewImage = target.querySelector<HTMLImageElement>(PREVIEW_IMAGE_SELECTOR);
  if (!previewImage) {
    return;
  }

  const previewSource = theme === 'foods'
    ? previewImage.dataset.previewFoods
    : previewImage.dataset.previewCodeVibes || previewImage.dataset.previewDefault;

  if (previewSource) {
    previewImage.src = previewSource;
  }
}

function syncOptions(target: HTMLElement, settings: GameSettings): void {
  const optionButtons = target.querySelectorAll<HTMLButtonElement>(OPTION_SELECTOR);
  optionButtons.forEach((button) => {
    syncOptionButtonState(button, settings);
  });
}

function syncOptionButtonState(button: HTMLButtonElement, settings: GameSettings): void {
  const isSelected = isMatchingOption(settings, button.dataset.group, button.dataset.value);
  button.classList.toggle('is-selected', isSelected);
  syncOptionLine(button, isSelected);
  syncOptionMarker(button, isSelected);
}

function syncOptionLine(button: HTMLButtonElement, isSelected: boolean): void {
  const lineElement = button.querySelector<HTMLElement>(OPTION_LINE_SELECTOR);
  lineElement?.classList.toggle('is-visible', isSelected);
}

function syncOptionMarker(button: HTMLButtonElement, isSelected: boolean): void {
  const markerElement = button.querySelector<HTMLImageElement>(OPTION_MARKER_SELECTOR);
  if (!markerElement) {
    return;
  }

  const markerSource = isSelected ? markerElement.dataset.activeIcon : markerElement.dataset.inactiveIcon;
  if (markerSource) {
    markerElement.src = markerSource;
  }
}

function isMatchingOption(settings: GameSettings, group?: string, value?: string): boolean {
  if (!group || !value) {
    return false;
  }

  return readSelectedValueByGroup(settings, group) === value;
}

function readSelectedValueByGroup(settings: GameSettings, group: string): string | null {
  if (group === 'theme') {
    return settings.theme;
  }
  if (group === 'player') {
    return settings.player;
  }
  if (group === 'boardSize') {
    return settings.boardSize;
  }
  return null;
}

function syncFooterSummary(target: HTMLElement, settings: GameSettings): void {
  const summaryItems = createFooterSummaryItems(settings);
  summaryItems.forEach(([group, isSelected, text]) => {
    updateFooterItem(target, group, isSelected, text);
  });
}

function createFooterSummaryItems(settings: GameSettings): [SettingsGroup, boolean, string][] {
  return [
    ['theme', settings.theme !== null, formatThemeSummary(settings.theme)],
    ['player', settings.player !== null, formatPlayerSummary(settings.player)],
    ['boardSize', settings.boardSize !== null, formatBoardSummary(settings.boardSize)],
  ];
}

function updateFooterItem(target: HTMLElement, group: SettingsGroup, isSelected: boolean, text: string): void {
  const summaryItem = target.querySelector<HTMLElement>(`[data-summary-group="${group}"]`);
  if (!summaryItem) {
    return;
  }

  const wasSelected = applySummarySelectionState(summaryItem, isSelected);
  syncSummarySeparator(summaryItem, isSelected);
  const hasTextChanged = syncSummaryText(summaryItem, group, text);
  if (shouldReplaySummaryAnimation(isSelected, wasSelected, hasTextChanged)) {
    replayFooterAnimation(summaryItem);
  }
}

function applySummarySelectionState(summaryItem: HTMLElement, isSelected: boolean): boolean {
  const wasSelected = summaryItem.classList.contains('is-selected');
  summaryItem.classList.toggle('is-selected', isSelected);
  return wasSelected;
}

function syncSummarySeparator(summaryItem: HTMLElement, isSelected: boolean): void {
  const separator = summaryItem.querySelector<HTMLImageElement>(FOOTER_SEPARATOR_SELECTOR);
  const source = resolveSummarySeparatorSource(separator, isSelected);
  if (separator && source) {
    separator.src = source;
  }
}

function resolveSummarySeparatorSource(
  separator: HTMLImageElement | null,
  isSelected: boolean,
): string | undefined {
  if (!separator) {
    return undefined;
  }
  return isSelected ? separator.dataset.separatorActive : separator.dataset.separatorInactive;
}

function syncSummaryText(summaryItem: HTMLElement, group: SettingsGroup, text: string): boolean {
  const summaryText = summaryItem.querySelector<HTMLElement>(`[data-summary-text="${group}"]`);
  if (!summaryText || summaryText.textContent === text) {
    return false;
  }

  summaryText.textContent = text;
  return true;
}

function shouldReplaySummaryAnimation(
  isSelected: boolean,
  wasSelected: boolean,
  hasTextChanged: boolean,
): boolean {
  return (isSelected && !wasSelected) || hasTextChanged;
}

function replayFooterAnimation(summaryItem: HTMLElement): void {
  summaryItem.classList.remove(FOOTER_REFRESH_CLASS);
  window.requestAnimationFrame(() => {
    summaryItem.classList.add(FOOTER_REFRESH_CLASS);
    window.setTimeout(() => {
      summaryItem.classList.remove(FOOTER_REFRESH_CLASS);
    }, 240);
  });
}

function formatThemeSummary(theme: GameSettings['theme']): string {
  if (!theme) {
    return 'Theme';
  }

  return 'Game theme';
}

function formatPlayerSummary(player: GameSettings['player']): string {
  if (!player) {
    return 'Player';
  }

  if (player === 'orange') {
    return 'Orange Player';
  }

  return 'Blue Player';
}

function formatBoardSummary(boardSize: GameSettings['boardSize']): string {
  if (!boardSize) {
    return 'Board size';
  }

  return `Board-${boardSize} Cards`;
}

function syncStartButtonState(target: HTMLElement): void {
  const startButton = target.querySelector<HTMLButtonElement>(START_BUTTON_SELECTOR);
  if (!startButton) {
    return;
  }

  const isReady = hasCompleteSettings();
  startButton.classList.toggle('is-ready', isReady);
  startButton.disabled = !isReady;
}

function bindStartButton(target: HTMLElement): void {
  const startButton = target.querySelector<HTMLButtonElement>(START_BUTTON_SELECTOR);
  if (!startButton) {
    return;
  }

  startButton.addEventListener('click', handleStartButtonClick);
}

function handleStartButtonClick(): void {
  if (!hasCompleteSettings()) {
    return;
  }

  clearGameResult();
  window.location.hash = '#game';
}
