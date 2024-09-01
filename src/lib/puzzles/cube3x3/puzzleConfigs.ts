import { MASKS } from "./masks";
import { MOVESETS } from "./moves";
import { MoveSet } from "src/lib/types";
import { Move3x3, Cube3x3Mask } from ".";

export const PUZZLE_CONFIG_NAMES = [
  "EO",
  "EOLine",
  "EOCross",
  "EOArrowBack",
  "EOArrowLeft",
  "EO222",
  "Cross",
  "FB",
  "SB",
] as const;

export type PuzzleConfigName = (typeof PUZZLE_CONFIG_NAMES)[number];

export interface PuzzleConfig {
  solverConfig: SolverConfig;
  /** @deprecated */
  isEOStep?: boolean;
}

export interface SolverConfig {
  moveSet: MoveSet<Move3x3>;
  mask: Cube3x3Mask;
  pruningDepth: number;
  depthLimit: number;
}

export const PUZZLE_CONFIGS = {
  EO: {
    solverConfig: {
      moveSet: MOVESETS.RUFLDB,
      mask: MASKS.EO,
      pruningDepth: 4,
      depthLimit: 7,
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
    isEOStep: true,
  },
  EOCross: {
    solverConfig: {
      moveSet: MOVESETS.RUFLDB,
      mask: MASKS.EOCross,
      pruningDepth: 4,
      depthLimit: 10,
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
    isEOStep: true,
  },
  EOArrowLeft: {
    solverConfig: {
      moveSet: MOVESETS.RUFLDB,
      mask: MASKS.EOArrowLeft,
      pruningDepth: 4,
      depthLimit: 10,
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
    isEOStep: true,
  },
  Cross: {
    solverConfig: {
      moveSet: MOVESETS.RUFLDB,
      mask: MASKS.Cross,
      pruningDepth: 4,
      depthLimit: 8,
    },
  },
  FB: {
    solverConfig: {
      moveSet: MOVESETS.RrUMDFB, // TODO
      mask: MASKS.FB,
      pruningDepth: 4,
      depthLimit: 10,
    },
  },
  SB: {
    solverConfig: {
      moveSet: MOVESETS.RrUM,
      mask: MASKS.F2B,
      pruningDepth: 5,
      depthLimit: 18,
    },
  },
} as const satisfies { [name in PuzzleConfigName]: PuzzleConfig };
