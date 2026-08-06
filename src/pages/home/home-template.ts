import controllerIcon from '../../../puplic/designs/stadia_controller.svg';
import playButtonIcon from '../../../puplic/designs/play-button.svg';
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
