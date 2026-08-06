import { hasCompleteSettings } from './game-settings';
import { hasGameResult } from './game-result';
import { mountGamePage } from '../pages/game/game-page';
import { mountGameOverPage } from '../pages/game-over/game-over-page';
import { mountHomePage } from '../pages/home/home-page';
import { mountSettingsPage } from '../pages/settings/settings-page';

type RouteName = 'game' | 'game-over' | 'home' | 'settings';

/**
 * Starts hash-based routing and renders the initial screen.
 *
 * @param target Root element that receives route content.
 */
export function startRouter(target: HTMLElement): void {
  renderRoute(target);
  window.addEventListener('hashchange', () => {
    renderRoute(target);
  });
}

function renderRoute(target: HTMLElement): void {
  const routeName = readRoute();
  const routeRenderer = ROUTE_RENDERERS[routeName];
  routeRenderer(target);
}

function renderGameRoute(target: HTMLElement): void {
  if (!hasCompleteSettings()) {
    window.location.hash = '#settings';
    return;
  }

  mountGamePage(target);
}

function renderGameOverRoute(target: HTMLElement): void {
  if (!hasCompleteSettings()) {
    window.location.hash = '#settings';
    return;
  }

  if (!hasGameResult()) {
    window.location.hash = '#game';
    return;
  }

  mountGameOverPage(target);
}

function readRoute(): RouteName {
  const hash = window.location.hash.toLowerCase();
  return ROUTE_HASH_MAP[hash] ?? 'home';
}

const ROUTE_HASH_MAP: Partial<Record<string, RouteName>> = {
  '#game': 'game',
  '#game-over': 'game-over',
  '#home': 'home',
  '#settings': 'settings',
};

const ROUTE_RENDERERS: Record<RouteName, (target: HTMLElement) => void> = {
  game: renderGameRoute,
  'game-over': renderGameOverRoute,
  home: mountHomePage,
  settings: mountSettingsPage,
};
