export interface Puzzle<Move = string> {
  isSolved(): boolean;
  get nextMoves(): Readonly<Move[]>;
  encode(): string;
  applyMove(move: Move): this;
  applyMoves(moves: Move[]): this;
  clone: () => Puzzle<Move>;
}

export type Perm<T = number> = [src: T, dst: T][];

export type MoveSet<Move> = Readonly<Move[]>;
