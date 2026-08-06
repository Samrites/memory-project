import './styles/main.scss';
import { CARD_ASSETS } from './cards';
import { MemoryCard } from './models/memory-card';
import type { GameSettings, PlayerColor, ThemeOption } from './models/game-settings';
import { renderGame, type ScoreBoard } from './pages/game';
import { renderGameOverScore, renderGameResult } from './pages/game-over';
import { renderHome } from './pages/home';
import { readBoardSize, readChoice, renderSettings } from './pages/settings';
import { shuffle } from './utils/shuffle';

const APP = document.querySelector<HTMLElement>('#app');
const FLIP_DELAY = 850;
const LAST_CARD_DELAY = 900;
const RESULT_DELAY = 2200;
const THEME_PREVIEWS: Record<ThemeOption, { src: string; alt: string; caption: string }> = {
  code: {
    src: './img/previews/code-preview.png',
    alt: 'Preview of the Code Vibes theme',
    caption: 'Code Vibes theme preview',
  },
  food: {
    src: './img/previews/food-preview.png',
    alt: 'Preview of the Foods theme',
    caption: 'Foods theme preview',
  },
};
let settings: GameSettings | null = null;
let cards: MemoryCard[] = [];
let openCards: MemoryCard[] = [];
let currentPlayer: PlayerColor = 'blue';
let scores: ScoreBoard = { blue: 0, orange: 0 };
let isChecking = false;

function setApp(markup: string): void {
  if (!APP) throw new Error('App element not found.');
  APP.innerHTML = markup;
}

function showHome(): void {
  document.body.dataset.theme = 'food';
  setApp(renderHome());
  document.querySelector('#play-button')?.addEventListener('click', showSettings);
}

function showSettings(): void {
  document.body.dataset.theme = 'settings';
  setApp(renderSettings());
  bindSettingsEvents();
}

function bindSettingsEvents(): void {
  const form = document.querySelector<HTMLFormElement>('#settings-form');
  form?.addEventListener('submit', startGame);
  form?.addEventListener('change', updateSettingsState);

}

function showThemePreview(theme: ThemeOption): void {
  const preview = THEME_PREVIEWS[theme];
  const image = document.querySelector<HTMLImageElement>('#theme-preview-image');
  if (!preview || !image) return;
  image.src = preview.src;
  image.alt = preview.alt;
  const frame = document.querySelector<HTMLElement>('#theme-preview');
  if (frame) frame.dataset.previewTheme = theme;
}

function updateSettingsState(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.name === 'theme') {
    showThemePreview(input.value as ThemeOption);
  }

  updateSettingsSummary();
  const startButton = document.querySelector<HTMLButtonElement>('#settings-start-button');
  if (startButton) startButton.disabled = readSettings() === null;
}

function setSummaryText(selector: string, value: string): void {
  const element = document.querySelector<HTMLElement>(selector);
  if (element) element.textContent = value;
}

function updateSettingsSummary(): void {
  const theme = readChoice<ThemeOption>('theme');
  const player = readChoice<PlayerColor>('player');
  const boardSize = readBoardSize();
  const themeLabel = theme === 'code' ? 'Code vibes theme' : theme === 'food' ? 'Foods theme' : 'Game theme';
  const playerLabel = player ? `${player[0].toUpperCase()}${player.slice(1)} Player` : 'Player';
  const boardLabel = boardSize ? `Board-${boardSize} Cards` : 'Board size';
  setSummaryText('#summary-theme', themeLabel);
  setSummaryText('#summary-player', playerLabel);
  setSummaryText('#summary-board', boardLabel);
}

function readSettings(): GameSettings | null {
  const startingPlayer = readChoice<PlayerColor>('player');
  const theme = readChoice<ThemeOption>('theme');
  const boardSize = readBoardSize();
  return startingPlayer && theme && boardSize ? { startingPlayer, theme, boardSize } : null;
}

function createCards(gameSettings: GameSettings): MemoryCard[] {
  const pairCount = gameSettings.boardSize / 2;
  const assets = CARD_ASSETS[gameSettings.theme].slice(0, pairCount);
  const pairs = assets.flatMap((asset, pairId) => [asset, asset].map((item) => ({ item, pairId })));
  return shuffle(pairs).map(({ item, pairId }, id) => new MemoryCard(id, pairId, item.imagePath, item.label));
}

function startGame(event: Event): void {
  event.preventDefault();
  const nextSettings = readSettings();
  if (!nextSettings) return;
  settings = nextSettings;
  currentPlayer = settings.startingPlayer;
  scores = { blue: 0, orange: 0 };
  cards = createCards(settings);
  openCards = [];
  document.body.dataset.theme = settings.theme;
  drawGame();
}

function drawGame(): void {
  if (!settings) return;
  setApp(renderGame(settings, cards, currentPlayer, scores));
  bindGameEvents();
}

function bindGameEvents(): void {
  document.querySelector('#game-board')?.addEventListener('click', handleBoardClick);
  document.querySelector('#exit-button')?.addEventListener('click', () => toggleExitModal(true));
  document.querySelector('#continue-button')?.addEventListener('click', () => toggleExitModal(false));
  document.querySelector('#quit-button')?.addEventListener('click', showSettings);
}

function toggleExitModal(show: boolean): void {
  document.querySelector('#exit-modal')?.classList.toggle('is-hidden', !show);
}

function getClickedCard(event: Event): MemoryCard | null {
  const target = event.target as HTMLElement | null;
  const button = target?.closest<HTMLButtonElement>('[data-card-id]');
  const id = Number(button?.dataset.cardId);
  return Number.isInteger(id) ? cards.find((card) => card.id === id) ?? null : null;
}

function handleBoardClick(event: Event): void {
  const target = event.target as HTMLElement | null;
  const button = target?.closest<HTMLButtonElement>('[data-card-id]');
  const card = getClickedCard(event);
  if (!button || !card || card.isFlipped || card.isMatched || isChecking) return;

  card.flip();
  button.classList.add('is-flipped');
  button.setAttribute('aria-pressed', 'true');
  openCards.push(card);

  if (openCards.length === 2) checkOpenCards();
}

function updateScoreDisplay(): void {
  const blueScore = document.querySelector<HTMLElement>('#blue-score');
  const orangeScore = document.querySelector<HTMLElement>('#orange-score');
  if (blueScore) blueScore.textContent = String(scores.blue);
  if (orangeScore) orangeScore.textContent = String(scores.orange);
}

function updateCurrentPlayerDisplay(): void {
  const player = document.querySelector<HTMLElement>('#game-title');
  if (!player) return;
  player.textContent = currentPlayer;
  player.className = `player player--${currentPlayer}`;
}


function checkOpenCards(): void {
  const [first, second] = openCards;
  if (!first || !second) return;
  first.pairId === second.pairId ? handleMatch(first, second) : handleMismatch(first, second);
}

function handleMatch(first: MemoryCard, second: MemoryCard): void {
  first.match();
  second.match();
  scores[currentPlayer] += 1;
  updateScoreDisplay();

  document.querySelectorAll<HTMLButtonElement>('[data-card-id]').forEach((button) => {
    const id = Number(button.dataset.cardId);
    if (id === first.id || id === second.id) button.classList.add('is-matched');
  });

  openCards = [];
  if (cards.every((card) => card.isMatched)) {
    window.setTimeout(showGameOver, LAST_CARD_DELAY);
  }
}

function handleMismatch(first: MemoryCard, second: MemoryCard): void {
  isChecking = true;
  window.setTimeout(() => {
    first.hide();
    second.hide();

    document.querySelectorAll<HTMLButtonElement>('[data-card-id]').forEach((button) => {
      const id = Number(button.dataset.cardId);
      if (id === first.id || id === second.id) {
        button.classList.remove('is-flipped');
        button.setAttribute('aria-pressed', 'false');
      }
    });

    openCards = [];
    currentPlayer = currentPlayer === 'blue' ? 'orange' : 'blue';
    updateCurrentPlayerDisplay();
    isChecking = false;
  }, FLIP_DELAY);
}

function showGameOver(): void {
  if (!settings) return;
  setApp(renderGameOverScore(scores, settings.theme));
  window.setTimeout(showGameResult, RESULT_DELAY);
}

function showGameResult(): void {
  if (!settings) return;
  setApp(renderGameResult(scores, settings.theme));
  document.querySelector('#home-button')?.addEventListener('click', showHome);
}

showHome();
