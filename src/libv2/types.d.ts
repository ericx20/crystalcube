export interface Puzzle<Move extends string = string> {
  isSolved(): boolean;
  resetToSolved(): this;
  get nextMoves(): Readonly<Move[]>;
  encode(): string;
  applyMove(move: Move): this;
  applyMoves(moves: Move[]): this;
  getInvertedMoves(moves: Move[]): Move[];
  clone(): Puzzle<Move>;
}

export type Perm<T = number> = [src: T, dst: T][];

export type MoveSet<Move> = Readonly<Move[]>;
