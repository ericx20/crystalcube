export type EOStep =
  | "EO"
  | "EOLine"
  | "EOCross"
  | "EOArrowBack"
  | "EOArrowLeft"
  | "EO222";

export type LevelMode = "random" | "num-of-bad-edges" | "num-of-moves";

type Color = "W" | "O" | "G" | "R" | "B" | "Y";

// prettier-ignore
// All cube orientations, 1st character is the top color and 2nd is the front color
const CUBE_ORIENTATIONS = [
  "WO", "WG", "WR", "WB",
  "OW", "OG", "OB", "OY",
  "GW", "GO", "GR", "GY",
  "RW", "RG", "RB", "RY",
  "BW", "BO", "BR", "BY",
  "YO", "YG", "YR", "YB",
] as const satisfies `${Color}${Color}`;

export type CubeOrientation = (typeof CUBE_ORIENTATIONS)[number];

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
