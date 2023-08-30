export type EOStep =
  | "EO"
  | "EOLine"
  | "EOCross"
  | "EOArrowBack"
  | "EOArrowLeft"
  | "EO222";

export type LevelMode = "random" | "num-of-bad-edges" | "num-of-moves";

export interface EOStepOptions {
  eoStep: EOStep;
  levelMode: LevelMode;
  numOfBadEdges: number;
  numOfMoves: number;
}

export interface NumOfMovesConfig {
  min: number;
  max: number;
}
