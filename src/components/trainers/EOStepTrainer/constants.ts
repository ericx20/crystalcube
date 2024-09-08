import { EOStep } from "./types";

interface NumOfMovesConfig {
  // Minimum choice for number of moves scramble
  min: number;
  // Maximum choice for number of moves scramble
  max: number;
  // The number of iterations allowed when finding an `n`-move scramble before we give up
  iterationLimit: number;
}

// prettier-ignore
export const NUM_OF_MOVES_CONFIGS: { [eoStep in EOStep]: NumOfMovesConfig } = {
  EO:           { min: 3, max: 7, iterationLimit: 2000 },
  EOLine:       { min: 3, max: 8, iterationLimit: 1000 },
  EOCross:      { min: 3, max: 9, iterationLimit: 200 },
  EOArrowBack:  { min: 3, max: 8, iterationLimit: 200 },
  EOArrowLeft:  { min: 3, max: 8, iterationLimit: 200 },
  EO222:        { min: 3, max: 9, iterationLimit: 200 },
};
