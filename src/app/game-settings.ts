export type ThemeOption = 'code-vibes' | 'foods';
export type PlayerOption = 'blue' | 'orange';
export type BoardSizeOption = '16' | '24' | '36';

export interface SettingsChoice<T extends string> {
  label: string;
  value: T;
}

export interface GameSettings {
  boardSize: BoardSizeOption | null;
  player: PlayerOption | null;
  theme: ThemeOption | null;
}

const STORAGE_KEY = 'memory-game-settings';

export const THEME_CHOICES: SettingsChoice<ThemeOption>[] = [
  { value: 'code-vibes', label: 'Code vibes theme' },
  { value: 'foods', label: 'Foods theme' },
];

export const PLAYER_CHOICES: SettingsChoice<PlayerOption>[] = [
  { value: 'blue', label: 'Blue' },
  { value: 'orange', label: 'Orange' },
];

export const BOARD_SIZE_CHOICES: SettingsChoice<BoardSizeOption>[] = [
  { value: '16', label: '16 cards' },
  { value: '24', label: '24 cards' },
  { value: '36', label: '36 cards' },
];

let currentSettings: GameSettings = loadGameSettings();

function createEmptySettings(): GameSettings {
  return { boardSize: null, player: null, theme: null };
}

function loadGameSettings(): GameSettings {
  const storedSettings = window.localStorage.getItem(STORAGE_KEY);
  if (!storedSettings) {
    return createEmptySettings();
  }

  try {
    return parseGameSettings(JSON.parse(storedSettings) as unknown);
  } catch {
    return createEmptySettings();
  }
}

function parseGameSettings(value: unknown): GameSettings {
  if (!isSettingsRecord(value)) {
    return createEmptySettings();
  }

  return {
    boardSize: typeof value.boardSize === 'string' && isBoardSizeOption(value.boardSize) ? value.boardSize : null,
    player: typeof value.player === 'string' && isPlayerOption(value.player) ? value.player : null,
    theme: typeof value.theme === 'string' && isThemeOption(value.theme) ? value.theme : null,
  };
}

function isSettingsRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function saveGameSettings(): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSettings));
}

/**
 * Returns a copy of the current game settings.
 *
 * @returns Current settings snapshot.
 */
export function getGameSettings(): GameSettings {
  return { ...currentSettings };
}

/**
 * Sets the selected game theme.
 *
 * @param theme Theme option to store.
 */
export function setGameTheme(theme: ThemeOption): void {
  currentSettings = { ...currentSettings, theme };
  saveGameSettings();
}

/**
 * Sets the selected player.
 *
 * @param player Player option to store.
 */
export function setPlayer(player: PlayerOption): void {
  currentSettings = { ...currentSettings, player };
  saveGameSettings();
}

/**
 * Sets the selected board size.
 *
 * @param boardSize Board size option to store.
 */
export function setBoardSize(boardSize: BoardSizeOption): void {
  currentSettings = { ...currentSettings, boardSize };
  saveGameSettings();
}

/**
 * Checks if all required settings are selected.
 *
 * @returns True if theme, player, and board size are set.
 */
export function hasCompleteSettings(): boolean {
  return Boolean(
    currentSettings.theme &&
      currentSettings.player &&
      currentSettings.boardSize,
  );
}

/**
 * Type guard for theme values.
 *
 * @param value Raw value to validate.
 * @returns True when the value is a theme option.
 */
export function isThemeOption(value: string): value is ThemeOption {
  return THEME_CHOICES.some((choice) => choice.value === value);
}

/**
 * Type guard for player values.
 *
 * @param value Raw value to validate.
 * @returns True when the value is a player option.
 */
export function isPlayerOption(value: string): value is PlayerOption {
  return PLAYER_CHOICES.some((choice) => choice.value === value);
}

/**
 * Type guard for board-size values.
 *
 * @param value Raw value to validate.
 * @returns True when the value is a board-size option.
 */
export function isBoardSizeOption(value: string): value is BoardSizeOption {
  return BOARD_SIZE_CHOICES.some((choice) => choice.value === value);
}
