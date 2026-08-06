export interface GameResult {
  blueScore: number;
  orangeScore: number;
}

let currentGameResult: GameResult | null = null;

/**
 * Stores the final game result in memory.
 *
 * @param result Final score object.
 */
export function setGameResult(result: GameResult): void {
  currentGameResult = { ...result };
}

/**
 * Returns a copy of the current game result.
 *
 * @returns Stored game result or null.
 */
export function getGameResult(): GameResult | null {
  if (!currentGameResult) {
    return null;
  }

  return { ...currentGameResult };
}

/**
 * Checks whether a game result is currently available.
 *
 * @returns True if a result exists, otherwise false.
 */
export function hasGameResult(): boolean {
  return currentGameResult !== null;
}

/**
 * Clears the stored game result.
 */
export function clearGameResult(): void {
  currentGameResult = null;
}
