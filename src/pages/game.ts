import { CARD_BACKS } from '../cards';
import type { MemoryCard } from '../models/memory-card';
import type { GameSettings, PlayerColor } from '../models/game-settings';

export interface ScoreBoard {
  blue: number;
  orange: number;
}

function cardMarkup(card: MemoryCard, backImage: string): string {
  const state = card.isMatched ? ' is-matched' : card.isFlipped ? ' is-flipped' : '';
  return `<button class="memory-card${state}" data-card-id="${card.id}" type="button" aria-pressed="${card.isFlipped || card.isMatched}" aria-label="Memory card ${card.id + 1}"><span class="memory-card__inner"><span class="memory-card__face memory-card__back"><img src="${backImage}" alt=""></span><span class="memory-card__face memory-card__front"><img src="${card.imagePath}" alt="${card.label}"></span></span></button>`;
}

export function renderGame(
  settings: GameSettings,
  cards: MemoryCard[],
  currentPlayer: PlayerColor,
  scores: ScoreBoard,
): string {
  const cardsMarkup = cards.map((card) => cardMarkup(card, CARD_BACKS[settings.theme])).join('');
  return `
    <section class="game-screen" aria-labelledby="game-title">
      <header class="game-header">
        <div><p class="game-header__label">Current player</p><h1 id="game-title" class="player player--${currentPlayer}">${currentPlayer}</h1></div>
        <div class="scoreboard" aria-label="Score"><p><span>Blue</span><strong id="blue-score">${scores.blue}</strong></p><p><span>Orange</span><strong id="orange-score">${scores.orange}</strong></p></div>
        <button class="exit-button" id="exit-button" type="button">Exit game</button>
      </header>
      <section class="game-board game-board--${settings.boardSize}" id="game-board" aria-label="Memory board">${cardsMarkup}</section>
    </section>
    <div class="modal-backdrop is-hidden" id="exit-modal" role="dialog" aria-modal="true" aria-labelledby="exit-title">
      <section class="modal"><h2 id="exit-title">Quit game?</h2><p>Your current round will be lost.</p><div class="modal__actions"><button class="secondary-button" id="continue-button" type="button">No, back to game</button><button class="danger-button" id="quit-button" type="button">Yes, quit game</button></div></section>
    </div>
  `;
}
