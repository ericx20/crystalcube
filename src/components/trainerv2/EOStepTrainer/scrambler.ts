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
  simplifyMoves,
  translateMoves,
} from "src/libv2/puzzles/cube3x3";
import { EOStepOptions, NUM_OF_MOVES_CONFIGS } from "./eoStepOptions";
import { EOStep } from "./eoStepTypes";
import { genReversePruningTable } from "src/libv2/search";
import {
  solveCube3x3,
  solveEntire3x3,
} from "src/libv2/puzzles/cube3x3/solvers";

export default async function scrambler(
  options: EOStepOptions
): Promise<Move3x3[]> {
  switch (options.levelMode) {
    case "num-of-bad-edges":
      return numBadEdgesScramble(
        options.numOfBadEdges,
        options.eoStep,
        options.solutionOrientation,
        options.shortScrambles
      );
    case "num-of-moves":
      return await numOfMovesScramble(
        options.numOfMoves,
        options.eoStep,
        options.solutionOrientation,
        options.shortScrambles
      );
    case "random":
      return await randomScramble(
        options.eoStep,
        options.solutionOrientation,
        options.shortScrambles
      );
  }
}

async function numOfMovesScramble(
  n: number,
  eoStep: EOStep,
  solutionOrientation: CubeOrientation,
  shortScramble: boolean = false
): Promise<Move3x3[]> {
  const puzzleConfig = PUZZLE_CONFIGS[eoStep];
  const preRotation = cubeOrientationToRotations(solutionOrientation);

  // Approach 1: if the difficulty `n` is between 0 and `pruningDepth`, we can get a random-state scramble with respect to edges by sampling a "reverse" pruning table
  // The reverse pruning table has a list of all states of a given depth, so you sample a random one to achieve random-state scrambles
  if (0 <= n && n <= puzzleConfig.solverConfig.pruningDepth) {
    const maskedPuzzleState = new Cube3x3()
      .applyMoves(preRotation)
      .applyMask(puzzleConfig.solverConfig.mask)
      .applyMoves(invertMoves(preRotation)).stateData;
    const puzzle = new Cube3x3(
      puzzleConfig.solverConfig.moveSet,
      maskedPuzzleState
    );
    // TODO: cache these?
    const table = genReversePruningTable(puzzle, {
      pruningDepth: puzzleConfig.solverConfig.pruningDepth,
      name: eoStep,
    });

    const scramble = sample(table[n]) ?? [];
    return shortScramble
      ? makeShortScramble(scramble, preRotation, eoStep, 4)
      : makeBetterScramble(scramble, preRotation, eoStep);
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

    return shortScramble
      ? makeShortScramble(scramble, preRotation, eoStep, 4)
      : makeBetterScramble(scramble, preRotation, eoStep);
  }
}

async function numBadEdgesScramble(
  n: number,
  eoStep: EOStep,
  solutionOrientation: CubeOrientation,
  shortScramble: boolean = false
): Promise<Move3x3[]> {
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
  const scrambleForFBAxis = invertMoves(
    Cube3x3.parseNotation(solution.toString())!
  );
  // Our scramble only has the desired number of bad edges when looking at the F/B axis!
  // However if the solution orientation has a different axis, we need to translate the whole scramble
  const preRotation = cubeOrientationToRotations(solutionOrientation);
  const scramble = translateMoves(scrambleForFBAxis, invertMoves(preRotation));

  if (shortScramble) {
    const preRotation = cubeOrientationToRotations(solutionOrientation);
    return await makeShortScramble(scramble, preRotation, eoStep, 4);
  }
  return scramble;
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

async function randomScramble(
  eoStep: EOStep,
  solutionOrientation: CubeOrientation,
  shortScramble: boolean = false
): Promise<Move3x3[]> {
  const scramble = (await randomScrambleForEvent("333"))
    .toString()
    .split(" ") as Move3x3[];
  if (shortScramble) {
    const preRotation = cubeOrientationToRotations(solutionOrientation);
    return await makeShortScramble(scramble, preRotation, eoStep, 4);
  }
  return scramble;
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

async function makeShortScramble(
  scramble: Move3x3[],
  preRotation: RotationMove[],
  eoStep: EOStep,
  numExtraMoves = 0
) {
  const extraMoves = randomMoves(numExtraMoves);
  const newScramble = [...scramble, ...extraMoves];
  const solution = (await solveCube3x3(newScramble, eoStep, preRotation, 1))[0];
  const solutionInverse = translateMoves(
    invertMoves(solution),
    invertMoves(preRotation)
  );
  // cancel out any moves if possible
  return simplifyMoves([...solutionInverse, ...invertMoves(extraMoves)]);
}
