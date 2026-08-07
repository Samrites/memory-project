import controllerIcon from '../../assets/designs/stadia-controller.svg';
import playButtonIcon from '../../assets/designs/play-button.svg';
import { applyTemplateTokens } from '../../app/template-utils';
import homeTemplateMarkup from './home-template.html?raw';

/**
 * Builds the home page markup.
 *
 * @returns Home screen HTML string.
 */
export function createHomeTemplate(): string {
  return applyTemplateTokens(homeTemplateMarkup, {
    CONTROLLER_ICON_SRC: controllerIcon,
    PLAY_BUTTON_SRC: playButtonIcon,
  });
}
