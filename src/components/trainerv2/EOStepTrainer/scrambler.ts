import { KState } from "cubing/kpuzzle";
import { randomScrambleForEvent } from "cubing/scramble";
import {
  experimentalSolve3x3x3IgnoringCenters,
  random333State,
} from "cubing/search";
import sample from "lodash/sample";
import shuffle from "lodash/shuffle";

import {
  Cube3x3,
  CubeOrientation,
  cubeOrientationToRotations,
  invertMoves,
  Move3x3,
  PUZZLE_CONFIGS,
} from "src/libv2/puzzles/cube3x3";
import { EOStepOptions, NUM_OF_MOVES_CONFIGS } from "./eoStepOptions";
import { EOStep } from "./eoStepTypes";
import {
  genPruningTableWithSetups,
  genReversePruningTable,
} from "src/libv2/search";

export default async function scrambler(
  options: EOStepOptions
): Promise<Move3x3[]> {
  switch (options.levelMode) {
    case "num-of-bad-edges":
      return await nFlipScramble(options.numOfBadEdges);
    case "num-of-moves": // TODO: implement
      return await numMovesScramble(
        options.numOfMoves,
        options.eoStep,
        options.solutionOrientation
      );
    case "random":
      return await randomScramble();
  }

  // TODO: shorten the scramble based on the option
}

// let's first make this run on the main thread, then move to a web worker once it works
// we need to move to web worker, currently it blocks the UI thread for even just a bit, preventing loading state from showing on UI
async function numMovesScramble(
  n: number,
  eoStep: EOStep,
  solutionOrientation: CubeOrientation
): Promise<Move3x3[]> {
  const puzzleConfig = PUZZLE_CONFIGS[eoStep];
  const preRotation = cubeOrientationToRotations(solutionOrientation);

  // TODO: explore Approach 1, but for now not a priority

  // // Approach 1: if the difficulty `n` is between 0 and `pruningDepth`, we can get a random-state scramble with respect to edges by sampling the pruning table
  // // the scramble will be optimal however, which is bad
  // // so we have to combine the random state edges with randomly generated corners of a cube with matching edge-corner swap parity
  // // to get a suitable state that we can try to solve
  // if (0 <= n && n <= puzzleConfig.solverConfig.pruningDepth) {
  //   // ok let's just try to get the most basic thing done possible
  //   const maskedPuzzleState = new Cube3x3()
  //     .applyMoves(preRotation)
  //     .applyMask(puzzleConfig.solverConfig.mask)
  //     .applyMoves(invertMoves(preRotation)).stateData;
  //   const puzzle = new Cube3x3(
  //     puzzleConfig.solverConfig.moveSet,
  //     maskedPuzzleState
  //   );
  //   const table = genReversePruningTable(puzzle, {
  //     pruningDepth: puzzleConfig.solverConfig.pruningDepth,
  //     name: eoStep,
  //   });
  //   return sample(table[n]) ?? [];
  // }

  // Approach 2: if the difficulty `n` exceeds pruning depth, we have to do a random-move scramble
  const { min, max, iterationLimit } = NUM_OF_MOVES_CONFIGS[eoStep];
  // if (n < min || n > max) {
  // // TODO: handle failure where the scramble function is being used
  //   return null;
  // }

  return []; // TEMP
}

async function nFlipScramble(n: number): Promise<Move3x3[]> {
  const { kpuzzle, stateData } = await random333State();
  const newStateData = {
    ...stateData,
    EDGES: {
      orientation: nFlipEOArray(n),
      pieces: stateData.EDGES.pieces,
    },
  };
  const newPuzzle = new KState(kpuzzle, newStateData);
  const solution = await experimentalSolve3x3x3IgnoringCenters(newPuzzle);
  return invertMoves(Cube3x3.parseNotation(solution.toString())!);
}

function nFlipEOArray(n: number): Array<number> {
  if (!Number.isInteger(n) || n % 2 !== 0 || n < 0 || n > 12) {
    console.error(
      "nFlipEOArray(): must be an even integer from 0 to 12 inclusive"
    );
    return Array(12).fill(0);
  }
  const goodEdges = Array<number>(12 - n).fill(0);
  const badEdges = Array<number>(n).fill(1);
  return shuffle(goodEdges.concat(badEdges));
}

async function randomScramble(): Promise<Move3x3[]> {
  return (await randomScrambleForEvent("333"))
    .toString()
    .split(" ") as Move3x3[];
}
