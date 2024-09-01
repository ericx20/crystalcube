import { KState } from "cubing/kpuzzle";
import { randomScrambleForEvent } from "cubing/scramble";
import {
  experimentalSolve3x3x3IgnoringCenters,
  random333State,
} from "cubing/search";
import shuffle from "lodash/shuffle";
import sample from "lodash/sample";

import {
  appendRandomMove,
  Cube3x3,
  CubeOrientation,
  cubeOrientationToRotations,
  invertMoves,
  Move3x3,
  PUZZLE_CONFIGS,
  randomMoves,
  RotationMove,
  translateMoves,
} from "src/libv2/puzzles/cube3x3";
import { EOStepOptions, NUM_OF_MOVES_CONFIGS } from "./eoStepOptions";
import { EOStep } from "./eoStepTypes";
import {
  genPruningTableWithSetups,
  genReversePruningTable,
} from "src/libv2/search";
import {
  solveCube3x3,
  solveEntire3x3,
} from "src/libv2/puzzles/cube3x3/solvers";

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

// TODO: we need to make a singleton class Scrambler
// that way we can keep track of scramble generations and cancel old ones if a new one started
// each time the scrambler runs, one of its member functions will be called (nFlipScramble, numMovesScramble...)
// and in local scope store a copy of some counter thats like "scramble #"
// when the scrambler runs again, that thing will be incremented
// for a function like nFlipScramble, each iteration it can check if its backup of the counter is the same as the counter
// if different, immediately give up and reject the promise
// this also means that we need to do a try/catch for the solution generation
// if the promise rejects, do nothing
// WAIT actually can just do https://dev.to/ak_ram/asynchronous-javascript-operations-understanding-canceling-pausing-and-resuming-4ih5
// handle the cancelling logic in the useScrambleAndSolutions hook

// let's first make this run on the main thread, then move to a web worker once it works
// we need to move to web worker, currently it blocks the UI thread for even just a bit, preventing loading state from showing on UI
async function numMovesScramble(
  n: number,
  eoStep: EOStep,
  solutionOrientation: CubeOrientation
): Promise<Move3x3[]> {
  const puzzleConfig = PUZZLE_CONFIGS[eoStep];
  const preRotation = cubeOrientationToRotations(solutionOrientation);

  // Approach 1: if the difficulty `n` is between 0 and `pruningDepth`, we can get a random-state scramble with respect to edges by sampling the pruning table
  // the scramble will be optimal however, which is bad
  // so we have to combine the random state edges with randomly generated corners of a cube with matching edge-corner swap parity
  // to get a suitable state that we can try to solve
  if (0 <= n && n <= puzzleConfig.solverConfig.pruningDepth) {
    // ok let's just try to get the most basic thing done possible
    const maskedPuzzleState = new Cube3x3()
      .applyMoves(preRotation)
      .applyMask(puzzleConfig.solverConfig.mask)
      .applyMoves(invertMoves(preRotation)).stateData;
    const puzzle = new Cube3x3(
      puzzleConfig.solverConfig.moveSet,
      maskedPuzzleState
    );
    const table = genReversePruningTable(puzzle, {
      pruningDepth: puzzleConfig.solverConfig.pruningDepth,
      name: eoStep,
    });

    const scramble = sample(table[n]) ?? [];
    return makeBetterScramble(scramble, preRotation, eoStep);
  } else {
    // Approach 2: if the difficulty `n` exceeds pruning depth, we have to do a random-move scramble
    // We will need to shorten the scramble, either with respect to only the edges or we need to get proper random state corners as well!
    const { min, max, iterationLimit } = NUM_OF_MOVES_CONFIGS[eoStep];
    // if (n < min || n > max) {
    // // TODO: handle failure where the scramble function is being used
    //   return null;
    // }

    /*
    Our goal is to generate a scramble that can be solved optimally in exactly `n` moves.
    Typically we do this with trial and error, generating random-state scrambles until one with the correct difficulty is found.
    This requires solving each of the scrambles optimally, however for EOCross and other EO steps this takes far too much time.

    Instead we will generate random-move scrambles.
    Start with `n` random moves, and keep adding random moves until the scramble is hard enough to be optimally solved in `n` moves.
    This converges very quickly and requires fewer iterations to achieve a high success rate.
  */

    const scramble: Move3x3[] = randomMoves(n);
    let success = false;
    for (let i = 0; i < iterationLimit; i++) {
      const optimalSolutionLength = (
        await solveCube3x3(scramble, eoStep, preRotation, 1)
      )[0].length;
      if (optimalSolutionLength === n) {
        success = true;
        break;
      }
      appendRandomMove(scramble);
    }

    if (!success) {
      console.warn("scramble failed!");
      return []; // TODO: return null if scramble fails, or fallback to a random state and show an error message saying couldn't do it
    }

    return makeBetterScramble(scramble, preRotation, eoStep);

    // if the option for shorter scrambles is selected, then we just need to port the simplifyScramble function and apply it to the raw `scramble`, skipping the above 4 steps.
  }
}

/**
 * Given a scramble for a specific step (e.g. EOCross)
 * Generate an equivalent scramble that also evenly scrambles the pieces not involved in that step.
 * This is useful when training the step that goes afterwards (e.g. EOCross+1, ZZF2L)
 * In addition, it makes the scramble a suitable size.
 * The input scramble may be too short (gives away good solutions too easily) or too long (inconvenient to scramble)
 */
async function makeBetterScramble(
  originalScramble: Move3x3[],
  preRotation: RotationMove[],
  eoStep: EOStep
) {
  // This implementation is not very efficient but it's easy to implement
  // step 1: generate a random-state cube scramble and solve the selected EOStep on it
  // now we have an EOStep solved but everything else is scrambled
  // step 2: apply our original scramble on it
  // step 3: solve the entire cube using cubing.js
  // the inverse is a better scramble than the original
  const randomScramble = Cube3x3.parseNotation(
    (await randomScrambleForEvent("333")).toString()
  )!;
  const solutionForRandomScramble = (
    await solveCube3x3(randomScramble, eoStep, preRotation, 1)
  )[0]!;
  // the setup is `[...randomScramble, ...preRotation, ...solutionForRandomScramble, invertMoves(...preRotation) ...originalScramble]`
  // however we need to translate the setup so it doesn't have any rotations
  const setup = [
    ...randomScramble,
    ...translateMoves(solutionForRandomScramble, invertMoves(preRotation)),
    ...originalScramble,
  ];
  return invertMoves(await solveEntire3x3(setup));
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
