export interface Puzzle<Move extends string = string> {
  isSolved(): boolean;
  resetToSolved(): this;
  resetHistory(): this;
  get nextMoves(): readonly Move[];
  get history(): Move[]; // TODO: keep??
  encode(): string;
  applyMove(move: Move): this;
  applyMoves(moves: Move[]): this;
  clone(): Puzzle<Move>;
}

export type Perm<T = number> = [src: T, dst: T][];

export type MoveSet<Move> = readonly Move[];
