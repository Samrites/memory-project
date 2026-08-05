import type { PlayerColor, ThemeOption } from '../models/game-settings';
import type { ScoreBoard } from './game';

function resultClass(scores: ScoreBoard): string {
  if (scores.blue === scores.orange) return 'is-draw';
  return scores.blue > scores.orange ? 'is-blue-winner' : 'is-orange-winner';
}

export function renderGameOverScore(scores: ScoreBoard, theme: ThemeOption): string {
  return `
    <section class="game-over-screen game-over-screen--score game-over-screen--${theme}" aria-labelledby="game-over-title">
      <h1 id="game-over-title">GAME OVER</h1>
      <p class="game-over-screen__label">Final score</p>
      <div class="final-score" aria-label="Final score">
        <p class="player--blue"><span>Blue</span><strong>${scores.blue}</strong></p>
        <p class="player--orange"><span>Orange</span><strong>${scores.orange}</strong></p>
      </div>
    </section>
  `;
}

export function renderGameResult(scores: ScoreBoard, theme: ThemeOption): string {
  const result = scores.blue === scores.orange
    ? { eyebrow: 'It’s a', title: 'DRAW', symbol: '⚖' }
    : scores.blue > scores.orange
      ? { eyebrow: 'The winner is', title: 'Blue Player', symbol: '♙' }
      : { eyebrow: 'The winner is', title: 'Orange Player', symbol: '♙' };

  return `
    <section class="game-over-screen game-over-screen--result game-over-screen--${theme} ${resultClass(scores)}" aria-labelledby="result-title">
      <p class="game-over-screen__eyebrow">${result.eyebrow}</p>
      <h1 id="result-title">${result.title}</h1>
      <div class="game-over-screen__symbol" aria-hidden="true">${result.symbol}</div>
      <button class="primary-button" id="home-button" type="button">Home</button>
    </section>
  `;
}

export function readWinner(scores: ScoreBoard): PlayerColor | null {
  if (scores.blue === scores.orange) return null;
  return scores.blue > scores.orange ? 'blue' : 'orange';
}
