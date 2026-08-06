import { getGameSettings, type PlayerOption } from '../../app/game-settings';
import { setGameResult } from '../../app/game-result';
import { createGameTemplate } from './game-template';

const EXIT_BUTTON_SELECTOR = '#game-exit-button';
const EXIT_MODAL_SELECTOR = '[data-exit-modal]';
const EXIT_MODAL_CANCEL_SELECTOR = '[data-exit-cancel]';
const EXIT_MODAL_CONFIRM_SELECTOR = '[data-exit-confirm]';
const GAME_SCREEN_SELECTOR = '.game-screen';
const EXIT_MODAL_OPEN_CLASS = 'is-exit-modal-open';
const CARD_SELECTOR = '.game-card';
const CURRENT_PLAYER_MARKER_SELECTOR = '[data-current-player-marker]';
const FLIPPED_CARD_CLASS = 'flipped';
const MATCHED_CARD_CLASS = 'is-matched';
const FLIP_BACK_DELAY_MS = 700;
const MATCH_FINISH_DELAY_MS = 320;

interface GameRuntimeState {
  currentPlayer: PlayerOption;
  firstFlippedCard: HTMLButtonElement | null;
  secondFlippedCard: HTMLButtonElement | null;
  isTurnLocked: boolean;
  scores: Record<PlayerOption, number>;
}

interface ExitFlowElements {
  exitButton: HTMLButtonElement;
  exitModal: HTMLElement;
  backToGameButton: HTMLButtonElement;
  confirmExitButton: HTMLButtonElement;
  gameScreen: HTMLElement;
}

/**
 * Mounts the game page and wires game interactions.
 *
 * @param target Root element that receives the game markup.
 */
export function mountGamePage(target: HTMLElement): void {
  const settings = getGameSettings();
  target.innerHTML = createGameTemplate(settings);
  bindExitFlow(target);
  bindMemoryGame(target, settings.player ?? 'blue');
}

function bindExitFlow(target: HTMLElement): void {
  const elements = readExitFlowElements(target);
  if (!elements) {
    return;
  }

  bindExitFlowEvents(elements);
}

function readExitFlowElements(target: HTMLElement): ExitFlowElements | null {
  const exitButton = target.querySelector<HTMLButtonElement>(EXIT_BUTTON_SELECTOR);
  const exitModal = target.querySelector<HTMLElement>(EXIT_MODAL_SELECTOR);
  const backToGameButton = target.querySelector<HTMLButtonElement>(EXIT_MODAL_CANCEL_SELECTOR);
  const confirmExitButton = target.querySelector<HTMLButtonElement>(EXIT_MODAL_CONFIRM_SELECTOR);
  const gameScreen = target.querySelector<HTMLElement>(GAME_SCREEN_SELECTOR);

  if (!exitButton || !exitModal || !backToGameButton || !confirmExitButton || !gameScreen) {
    return null;
  }

  return { exitButton, exitModal, backToGameButton, confirmExitButton, gameScreen };
}

function bindExitFlowEvents(elements: ExitFlowElements): void {
  elements.exitButton.addEventListener('click', () => {
    setExitModalState(elements, true);
  });
  elements.backToGameButton.addEventListener('click', () => {
    setExitModalState(elements, false);
  });
  elements.confirmExitButton.addEventListener('click', () => {
    window.location.hash = '#settings';
  });
}

function setExitModalState(elements: ExitFlowElements, isOpen: boolean): void {
  elements.exitModal.hidden = !isOpen;
  elements.gameScreen.classList.toggle(EXIT_MODAL_OPEN_CLASS, isOpen);
}

function bindMemoryGame(target: HTMLElement, initialPlayer: PlayerOption): void {
  const cards = collectGameCards(target);
  if (cards.length === 0) {
    return;
  }

  const gameState = createInitialGameState(initialPlayer);
  syncHud(target, gameState);
  bindCardSelectionEvents(target, cards, gameState);
}

function collectGameCards(target: HTMLElement): HTMLButtonElement[] {
  return Array.from(target.querySelectorAll<HTMLButtonElement>(CARD_SELECTOR));
}

function createInitialGameState(initialPlayer: PlayerOption): GameRuntimeState {
  return {
    currentPlayer: initialPlayer,
    firstFlippedCard: null,
    secondFlippedCard: null,
    isTurnLocked: false,
    scores: { blue: 0, orange: 0 },
  };
}

function bindCardSelectionEvents(
  target: HTMLElement,
  cards: HTMLButtonElement[],
  state: GameRuntimeState,
): void {
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      handleCardSelection(target, cards.length, state, card);
    });
  });
}

function handleCardSelection(target: HTMLElement, totalCards: number, state: GameRuntimeState, selectedCard: HTMLButtonElement): void {
  if (isBlockedCardSelection(state, selectedCard)) {
    return;
  }
  toggleCardSwitchState(selectedCard);
  if (!state.firstFlippedCard) {
    state.firstFlippedCard = selectedCard;
    return;
  }
  lockTurnWithSecondCard(state, selectedCard);
  resolveTurnResult(target, totalCards, state);
}

function isBlockedCardSelection(
  state: GameRuntimeState,
  selectedCard: HTMLButtonElement,
): boolean {
  return state.isTurnLocked
    || selectedCard.classList.contains(FLIPPED_CARD_CLASS)
    || selectedCard.classList.contains(MATCHED_CARD_CLASS);
}

function lockTurnWithSecondCard(
  state: GameRuntimeState,
  selectedCard: HTMLButtonElement,
): void {
  state.secondFlippedCard = selectedCard;
  state.isTurnLocked = true;
}

function resolveTurnResult(target: HTMLElement, totalCards: number, state: GameRuntimeState): void {
  if (hasOpenPairMatch(state)) {
    finishMatchedTurn(target, totalCards, state);
    return;
  }

  scheduleMismatchReset(target, state);
}

function hasOpenPairMatch(state: GameRuntimeState): boolean {
  if (!state.firstFlippedCard || !state.secondFlippedCard) {
    return false;
  }

  return isMatchingPair(state.firstFlippedCard, state.secondFlippedCard);
}

function scheduleMismatchReset(target: HTMLElement, state: GameRuntimeState): void {
  window.setTimeout(() => {
    flipCardBack(state.firstFlippedCard);
    flipCardBack(state.secondFlippedCard);
    switchCurrentPlayer(state);
    resetTurn(state);
    syncHud(target, state);
  }, FLIP_BACK_DELAY_MS);
}

function flipCardBack(card: HTMLButtonElement | null): void {
  if (card?.classList.contains(FLIPPED_CARD_CLASS)) {
    toggleCardSwitchState(card);
  }
}

function switchCurrentPlayer(state: GameRuntimeState): void {
  state.currentPlayer = state.currentPlayer === 'blue' ? 'orange' : 'blue';
}

function toggleCardSwitchState(card: HTMLButtonElement): void {
  card.classList.toggle(FLIPPED_CARD_CLASS);
}

function isMatchingPair(
  firstCard: HTMLButtonElement,
  secondCard: HTMLButtonElement,
): boolean {
  const firstIcon = firstCard.dataset.cardIcon;
  const secondIcon = secondCard.dataset.cardIcon;

  return Boolean(firstIcon && secondIcon && firstIcon === secondIcon);
}

function finishMatchedTurn(target: HTMLElement, totalCards: number, state: GameRuntimeState): void {
  const matchedPair = getTurnPair(state);
  if (!matchedPair) {
    resetTurn(state);
    return;
  }
  markPairAsMatched(matchedPair);
  incrementCurrentPlayerScore(state);
  resetTurn(state);
  syncHud(target, state);
  finishGameIfBoardIsCleared(target, totalCards, state);
}

function getTurnPair(state: GameRuntimeState): [HTMLButtonElement, HTMLButtonElement] | null {
  if (!state.firstFlippedCard || !state.secondFlippedCard) {
    return null;
  }

  return [state.firstFlippedCard, state.secondFlippedCard];
}

function markPairAsMatched(cards: [HTMLButtonElement, HTMLButtonElement]): void {
  cards.forEach((card) => {
    card.classList.add(MATCHED_CARD_CLASS);
    card.disabled = true;
  });
}

function incrementCurrentPlayerScore(state: GameRuntimeState): void {
  state.scores[state.currentPlayer] += 1;
}

function finishGameIfBoardIsCleared(target: HTMLElement, totalCards: number, state: GameRuntimeState): void {
  const isBoardCleared = target.querySelectorAll(`.${MATCHED_CARD_CLASS}`).length === totalCards;
  if (!isBoardCleared) {
    return;
  }
  scheduleGameOver(state);
}

function scheduleGameOver(state: GameRuntimeState): void {
  window.setTimeout(() => {
    setGameResult(createScoreResult(state));
    window.location.hash = '#game-over';
  }, MATCH_FINISH_DELAY_MS);
}

function createScoreResult(state: GameRuntimeState): { blueScore: number; orangeScore: number } {
  return { blueScore: state.scores.blue, orangeScore: state.scores.orange };
}

function resetTurn(state: GameRuntimeState): void {
  state.firstFlippedCard = null;
  state.secondFlippedCard = null;
  state.isTurnLocked = false;
}

function syncHud(target: HTMLElement, state: GameRuntimeState): void {
  setScoreValue(target, 'blue', state.scores.blue);
  setScoreValue(target, 'orange', state.scores.orange);

  const currentPlayerMarker = target.querySelector<HTMLElement>(
    CURRENT_PLAYER_MARKER_SELECTOR,
  );
  if (!currentPlayerMarker) {
    return;
  }

  currentPlayerMarker.classList.toggle('is-orange', state.currentPlayer === 'orange');
}

function setScoreValue(
  target: HTMLElement,
  player: PlayerOption,
  score: number,
): void {
  const scoreElements = target.querySelectorAll<HTMLElement>(`[data-score-player="${player}"]`);
  if (scoreElements.length === 0) {
    return;
  }

  scoreElements.forEach((scoreElement) => {
    scoreElement.textContent = String(score);
  });
}
