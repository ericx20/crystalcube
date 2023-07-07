import { MASKS } from "./masks";
import { MOVESETS } from "./moves";
import { MoveSet } from "src/libv2/types";
import { Move3x3, Cube3x3Mask } from "./types";

export const PUZZLE_CONFIG_NAMES = [
  "EO",
  "EOLine",
  "EOCross",
  "EOArrowBack",
  "EOArrowLeft",
  "EO222",
  "Cross",
] as const;

export type PuzzleConfigName = (typeof PUZZLE_CONFIG_NAMES)[number];

export interface PuzzleConfig {
  solverConfig: SolverConfig;
  nMoveScrambleConfig: NMoveScrambleConfig;
  isEOStep?: boolean;
}

export interface SolverConfig {
  moveSet: MoveSet<Move3x3>;
  mask: Cube3x3Mask;
  pruningDepth: number;
  depthLimit: number;
}

export interface NMoveScrambleConfig {
  min: number;
  max: number; // cannot exceed `depthLimit` from the solver config
  iterationLimit: number;
}

export const PUZZLE_CONFIGS: { [name in PuzzleConfigName]: PuzzleConfig } = {
  EO: {
    solverConfig: {
      moveSet: MOVESETS.RUFLDB,
      mask: MASKS.EO,
      pruningDepth: 4,
      depthLimit: 7,
    },
    nMoveScrambleConfig: {
      min: 3,
      max: 7,
      iterationLimit: 2000,
    },
    isEOStep: true,
  },
  EOLine: {
    solverConfig: {
      moveSet: MOVESETS.RUFLDB,
      mask: MASKS.EOLine,
      pruningDepth: 4,
      depthLimit: 9,
    },
    nMoveScrambleConfig: {
      min: 3,
      max: 8,
      iterationLimit: 1000,
    },
    isEOStep: true,
  },
  EOCross: {
    solverConfig: {
      moveSet: MOVESETS.RUFLDB,
      mask: MASKS.EOCross,
      pruningDepth: 4,
      depthLimit: 10,
    },
    nMoveScrambleConfig: {
      min: 3,
      max: 9,
      iterationLimit: 200,
    },
    isEOStep: true,
  },
  EOArrowBack: {
    solverConfig: {
      moveSet: MOVESETS.RUFLDB,
      mask: MASKS.EOArrowBack,
      pruningDepth: 4,
      depthLimit: 10,
    },
    nMoveScrambleConfig: {
      min: 3,
      max: 8,
      iterationLimit: 200,
    },
    isEOStep: true,
  },
  EOArrowLeft: {
    solverConfig: {
      moveSet: MOVESETS.RUFLDB,
      mask: MASKS.EOArrowLeft,
      pruningDepth: 4,
      depthLimit: 10,
    },
    nMoveScrambleConfig: {
      min: 3,
      max: 8,
      iterationLimit: 200,
    },
    isEOStep: true,
  },
  EO222: {
    solverConfig: {
      moveSet: MOVESETS.RUFLDB,
      mask: MASKS.EO222,
      pruningDepth: 4,
      depthLimit: 10, // TODO: what's God's number for EO222?
    },
    nMoveScrambleConfig: {
      min: 3,
      max: 9,
      iterationLimit: 200,
    },
    isEOStep: true,
  },
  Cross: {
    solverConfig: {
      moveSet: MOVESETS.RUFLDB,
      mask: MASKS.Cross,
      pruningDepth: 4,
      depthLimit: 8,
    },
    nMoveScrambleConfig: {
      min: 3,
      max: 7,
      iterationLimit: 500,
    },
  },
} as const;
