export type EOStep =
  | "EO"
  | "EOLine"
  | "EOCross"
  | "EOArrowBack"
  | "EOArrowLeft"
  | "EO222";

export type LevelMode = "random" | "num-of-bad-edges" | "num-of-moves";

export interface NumOfMovesConfig {
  // Minimum choice for number of moves scramble
  min: number;
  // Maximum choice for number of moves scramble
  max: number;
  // The number of iterations allowed when finding an `n`-move scramble before we give up
  iterationLimit: number;
}
