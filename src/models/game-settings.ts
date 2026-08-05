export type PlayerColor = 'blue' | 'orange';
export type ThemeOption = 'food' | 'code';
export type BoardSize = 16 | 24 | 36;

export interface GameSettings {
  startingPlayer: PlayerColor;
  boardSize: BoardSize;
  theme: ThemeOption;
}
