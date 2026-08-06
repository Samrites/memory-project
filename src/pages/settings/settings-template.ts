import type {
  BoardSizeOption,
  GameSettings,
  PlayerOption,
  ThemeOption,
} from '../../app/game-settings';
import {
  BOARD_SIZE_CHOICES,
  PLAYER_CHOICES,
  THEME_CHOICES,
} from '../../app/game-settings';
import { applyTemplateTokens, readTemplatePartial } from '../../app/template-utils';
import boardSizeIcon from '../../../puplic/designs/theme_1/style.svg';
import inactiveOptionIcon from '../../../puplic/designs/theme_1/fiber_manual_record.svg';
import activeOptionIcon from '../../../puplic/designs/theme_1/mode_standby.svg';
import gameThemeIcon from '../../../puplic/designs/theme_1/palette.svg';
import playerIcon from '../../../puplic/designs/theme_1/chess_pawn.svg';
import footerSeparatorActive from '../../../puplic/designs/theme_1/footer-separator-active.svg';
import footerSeparatorLine from '../../../puplic/designs/theme_1/Line 6.svg';
import selectedOptionLine from '../../../puplic/designs/theme_1/select-line.svg';
import codeVibesPreviewImage from '../../../puplic/designs/theme_1/setting-picture.svg';
import foodsPreviewImage from '../../../puplic/designs/theme-visiual-food.svg';
import startButtonImage from '../../../puplic/designs/theme_1/small button.svg';
import settingsTemplateMarkup from './settings-template.html?raw';
import settingsPartialsMarkup from './settings-partials.html?raw';

type SettingsGroup = 'boardSize' | 'player' | 'theme';
const SETTINGS_GROUP_TEMPLATE = readTemplatePartial(settingsPartialsMarkup, 'settings-group');
const SETTINGS_OPTION_BUTTON_TEMPLATE = readTemplatePartial(settingsPartialsMarkup, 'settings-option-button');
const SETTINGS_FOOTER_SUMMARY_TEMPLATE = readTemplatePartial(settingsPartialsMarkup, 'settings-footer-summary');
const SETTINGS_FOOTER_ITEM_TEMPLATE = readTemplatePartial(settingsPartialsMarkup, 'settings-footer-item');
const SETTINGS_FOOTER_SEPARATOR_TEMPLATE = readTemplatePartial(settingsPartialsMarkup, 'settings-footer-separator');
const SETTINGS_START_BUTTON_TEMPLATE = readTemplatePartial(settingsPartialsMarkup, 'settings-start-button');

/**
 * Builds the settings screen markup for the current settings state.
 *
 * @param settings Current game settings.
 * @returns Settings screen HTML string.
 */
export function createSettingsTemplate(settings: GameSettings): string {
  const isComplete =
    settings.theme !== null &&
    settings.player !== null &&
    settings.boardSize !== null;
  const previewImage = settings.theme === 'foods'
    ? foodsPreviewImage
    : codeVibesPreviewImage;

  return applyTemplateTokens(settingsTemplateMarkup, {
    BOARD_SIZE_GROUP_MARKUP: createSettingsGroup(
      'Board size',
      boardSizeIcon,
      createBoardSizeOptions(settings.boardSize),
    ),
    FOOTER_SUMMARY_MARKUP: createFooterSummary(settings, isComplete),
    PLAYER_GROUP_MARKUP: createSettingsGroup(
      'Choose player',
      playerIcon,
      createPlayerOptions(settings.player),
    ),
    PREVIEW_CODE_VIBES_SRC: codeVibesPreviewImage,
    PREVIEW_DEFAULT_SRC: codeVibesPreviewImage,
    PREVIEW_FOODS_SRC: foodsPreviewImage,
    PREVIEW_IMAGE_SRC: previewImage,
    THEME_GROUP_MARKUP: createSettingsGroup(
      'Game themes',
      gameThemeIcon,
      createThemeOptions(settings.theme),
    ),
  });
}

function createSettingsGroup(title: string, icon: string, optionsMarkup: string): string {
  return applyTemplateTokens(SETTINGS_GROUP_TEMPLATE, {
    GROUP_ICON_SRC: icon,
    GROUP_TITLE: title,
    OPTIONS_MARKUP: optionsMarkup,
  });
}

function createThemeOptions(selectedTheme: ThemeOption | null): string {
  return THEME_CHOICES.map((choice) => {
    return createOptionButton(
      'theme',
      choice.value,
      choice.label,
      selectedTheme === choice.value,
    );
  }).join('');
}

function createPlayerOptions(selectedPlayer: PlayerOption | null): string {
  return PLAYER_CHOICES.map((choice) => {
    return createOptionButton(
      'player',
      choice.value,
      choice.label,
      selectedPlayer === choice.value,
    );
  }).join('');
}

function createBoardSizeOptions(selectedSize: BoardSizeOption | null): string {
  return BOARD_SIZE_CHOICES.map((choice) => {
    return createOptionButton(
      'boardSize',
      choice.value,
      choice.label,
      selectedSize === choice.value,
    );
  }).join('');
}

function createOptionButton(
  group: SettingsGroup,
  value: string,
  label: string,
  isSelected: boolean,
): string {
  const previewThemeAttribute = group === 'theme'
    ? ` data-preview-theme="${value}"`
    : '';

  return applyTemplateTokens(SETTINGS_OPTION_BUTTON_TEMPLATE, {
    MARKER_ACTIVE_ICON_SRC: activeOptionIcon,
    MARKER_ICON_SRC: isSelected ? activeOptionIcon : inactiveOptionIcon,
    MARKER_INACTIVE_ICON_SRC: inactiveOptionIcon,
    OPTION_GROUP: group,
    OPTION_LABEL: label,
    OPTION_VALUE: value,
    PREVIEW_THEME_ATTRIBUTE: previewThemeAttribute,
    SELECTED_CLASS: isSelected ? ' is-selected' : '',
    SELECTED_LINE_ICON_SRC: selectedOptionLine,
    VISIBLE_LINE_CLASS: isSelected ? ' is-visible' : '',
  });
}

function createFooterSummary(settings: GameSettings, isComplete: boolean): string {
  return applyTemplateTokens(SETTINGS_FOOTER_SUMMARY_TEMPLATE, {
    FOOTER_FIELDS_MARKUP: createFooterFields(settings),
    START_BUTTON_MARKUP: createStartButton(isComplete),
  });
}

function createFooterFields(settings: GameSettings): string {
  return [
    createFooterItem('theme', formatThemeSummary(settings.theme), settings.theme !== null, true),
    createFooterItem('player', formatPlayerSummary(settings.player), settings.player !== null, true),
    createFooterItem('boardSize', formatBoardSummary(settings.boardSize), settings.boardSize !== null, false),
  ].join('');
}

function createFooterItem(
  group: SettingsGroup,
  text: string,
  isSelected: boolean,
  withSeparator: boolean,
): string {
  return applyTemplateTokens(SETTINGS_FOOTER_ITEM_TEMPLATE, {
    SELECTED_CLASS: isSelected ? ' is-selected' : '',
    SEPARATOR_MARKUP: withSeparator ? createFooterSeparator() : '',
    SUMMARY_GROUP: group,
    SUMMARY_TEXT: text,
  });
}

function createFooterSeparator(): string {
  return applyTemplateTokens(SETTINGS_FOOTER_SEPARATOR_TEMPLATE, {
    SEPARATOR_ACTIVE_SRC: footerSeparatorActive,
    SEPARATOR_LINE_SRC: footerSeparatorLine,
  });
}

function formatThemeSummary(theme: ThemeOption | null): string {
  if (!theme) {
    return 'Theme';
  }

  return 'Game theme';
}

function formatPlayerSummary(player: PlayerOption | null): string {
  if (!player) {
    return 'Player';
  }

  if (player === 'orange') {
    return 'Orange Player';
  }

  return 'Blue Player';
}

function formatBoardSummary(boardSize: BoardSizeOption | null): string {
  if (!boardSize) {
    return 'Board size';
  }

  return `Board-${boardSize} Cards`;
}

function createStartButton(isComplete: boolean): string {
  return applyTemplateTokens(SETTINGS_START_BUTTON_TEMPLATE, {
    DISABLED_ATTRIBUTE: isComplete ? '' : ' disabled',
    READY_CLASS: isComplete ? ' is-ready' : '',
    START_BUTTON_IMAGE_SRC: startButtonImage,
  });
}
