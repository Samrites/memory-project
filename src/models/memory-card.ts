/** Represents one card on the memory board. */
export class MemoryCard {
  public readonly id: number;
  public readonly pairId: number;
  public readonly imagePath: string;
  public readonly label: string;
  public isFlipped: boolean;
  public isMatched: boolean;

  public constructor(
    id: number,
    pairId: number,
    imagePath: string,
    label: string,
  ) {
    this.id = id;
    this.pairId = pairId;
    this.imagePath = imagePath;
    this.label = label;
    this.isFlipped = false;
    this.isMatched = false;
  }

  public flip(): void {
    this.isFlipped = true;
  }

  public hide(): void {
    if (!this.isMatched) this.isFlipped = false;
  }

  public match(): void {
    this.isMatched = true;
    this.isFlipped = true;
  }
}
