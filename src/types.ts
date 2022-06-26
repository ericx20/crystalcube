// import { ExperimentalStickering } from "cubing/twisty"

import { PNG, PNGVisualizerOptions } from "sr-puzzlegen";
import { VisualizerType } from "sr-puzzlegen/dist/lib/visualizer/enum";

export declare const puzzles: [
    "2x2x2",
    "3x3x3",
    "4x4x4",
    "5x5x5",
    "6x6x6",
    "7x7x7",
    "megaminx",
    "pyraminx",
    "square1",
    "skewb",
];

export type Puzzle = typeof puzzles[number]

// let type = "cube";
// let options: PNGVisualizerOptions = {
//   "width": 250,
//   "height": 250,
//   "strokeWidth": 0.01,
//   "puzzle": {
//     "case": "R U R'",
//     "mask": {
//       "F": [0,1,2],
//       "B": [0,1,2],
//       "R": [0,1,2],
//       "L": [0,1,2],
//       "U": [0,1,2,3,4,5,6,7,8]
//     }
//   }
// };

// PNG("#puzzle", VisualizerType.CUBE, options)

export interface PuzzleConfig {
    puzzle: Puzzle;
    view: "3d" | "net" | "top"
    mask?: { // if not defined, default is full stickering
        // must be valid mask for the puzzle
        // TODO: support specifying convenient default masks by string name
        // like mask: "OLL" would show OLL mask
        // TODO: make alg validation accept this format
        [face: string]: number[];
    }
}

export interface AlgSheet {
  name: string;
  description?: string;
  algSets: AlgSet[];
}

export interface AlgSet {
  name: string;
  description?: string;
  cases: AlgCase[];
  puzzleConfig: PuzzleConfig;
}

export interface AlgCase {
  name: string;
  imageUrl?: string;
  setup: string; // must be valid alg
  algs: CaseAlg[];
}

export interface CaseAlg {
    alg: string; // must be valid alg
    // TODO: should these be optional? or moved to a "meta" property?
    isFavorite?: boolean;
    notes?: string;
    link?: string;
}