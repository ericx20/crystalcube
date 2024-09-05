import { randomScrambleForEvent } from "cubing/scramble";
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
} from "src/lib/puzzles/cube3x3";
import { CrossOptions } from "./crossOptions";
import { genReversePruningTable } from "src/lib/search";
import { solveCube3x3, solveEntire3x3 } from "src/lib/puzzles/cube3x3/solvers";
import random3x3Scramble from "src/lib/puzzles/cube3x3/scramble";
import { eightMoveCrosses } from "./eightMoveCrosses";

export default async function scrambler(
  options: CrossOptions
): Promise<Move3x3[] | null> {
  switch (options.levelMode) {
    case "num-of-moves":
      return await numOfMovesScramble(
        options.numOfMoves,
        options.solutionOrientation,
        options.shortScrambles
      );
    case "random":
      return await randomScramble(
        options.solutionOrientation,
        options.shortScrambles
      );
  }
}

/**
 * This algorithm may fail to generate a scramble, it returns `null` in that case
 */
async function numOfMovesScramble(
  n: number,
  solutionOrientation: CubeOrientation,
  shortScramble: boolean = false
): Promise<Move3x3[] | null> {
  const puzzleConfig = PUZZLE_CONFIGS.Cross;
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
      name: "cross-reverse",
    });

    const scramble = sample(table[n]) ?? [];
    return shortScramble
      ? makeShortScramble(scramble, preRotation, 4)
      : makeBetterScramble(scramble, preRotation);
  } else if (n === 8) {
    // 8-move crosses are extremely rare, there are only 102 of them. Best way is to sample a list of all 8 move cross scrambles
    const eightMoveYellowCrossScramble = sample(eightMoveCrosses)!;
    const scramble = translateMoves(
      eightMoveYellowCrossScramble,
      invertMoves(preRotation)
    );
    return shortScramble
      ? makeShortScramble(scramble, preRotation, 4)
      : makeBetterScramble(scramble, preRotation);
  } else {
    // Approach 2: if the difficulty `n` exceeds pruning depth, we have to do a random-move scramble
    // We will need to shorten the scramble, either with respect to only the edges or we need to get proper random state corners as well!
    const iterationLimit = 10000;
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
        await solveCube3x3(scramble, "Cross", preRotation, 1)
      )[0].length;
      if (optimalSolutionLength === n) {
        success = true;
        break;
      }

      appendRandomMove(scramble);

      /**
       * Leaving here for documentation: old approach for finding 8 move cross scrambles.
       * This is an altered algorithm where instead of appending any random move to our current scramble,
       * we only append a random scramble that makes the scramble at least as hard
       */
      //   if (n === 8 && optimalSolutionLength === n - 1) {
      //     const validChoices = movesToAppend(scramble);
      //     let bestChoice: Move3x3 = sample(validChoices)!;
      //     let bestLength: number = 0;
      //     // it's very important to shuffle the list of valid choices, prevents us from getting stuck
      //     for (const choice of shuffle(validChoices)) {
      //       const choiceLength = (
      //         await solveCube3x3([...scramble, choice], "Cross", preRotation, 1)
      //       )[0].length;
      //       if (choiceLength > bestLength) {
      //         bestChoice = choice;
      //         bestLength = choiceLength;
      //         // when adding a move to a scramble, you can only make that scramble at most one move more difficult
      //         // so if we found a better choice, there would be nothing better
      //         continue;
      //       }
      //     }
      //     scramble.push(bestChoice);
      //   } else {
      //     appendRandomMove(scramble);
      //   }
    }

    if (!success) {
      console.warn("scramble failed!");
      return null;
    }

    return shortScramble
      ? makeShortScramble(scramble, preRotation, 4)
      : makeBetterScramble(scramble, preRotation);
  }
}

async function randomScramble(
  solutionOrientation: CubeOrientation,
  shortScramble: boolean = false
): Promise<Move3x3[]> {
  const scramble = await random3x3Scramble();
  if (shortScramble) {
    const preRotation = cubeOrientationToRotations(solutionOrientation);
    return await makeShortScramble(scramble, preRotation, 4);
  }
  return scramble;
}

// TODO: refactor into common
/**
 * Given a scramble for a specific step (e.g. EOCross)
 * Generate an equivalent scramble that also evenly scrambles the pieces not involved in that step.
 * This is useful when training the step that goes afterwards (e.g. EOCross+1, ZZF2L)
 * In addition, it makes the scramble a suitable size.
 * The input scramble may be too short (gives away good solutions too easily) or too long (inconvenient to scramble)
 */
async function makeBetterScramble(
  originalScramble: Move3x3[],
  preRotation: RotationMove[]
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
    await solveCube3x3(randomScramble, "Cross", preRotation, 1)
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

// TODO: refactor into common
async function makeShortScramble(
  scramble: Move3x3[],
  preRotation: RotationMove[],
  numExtraMoves = 0
) {
  const extraMoves = randomMoves(numExtraMoves);
  const newScramble = [...scramble, ...extraMoves];
  const solution = (
    await solveCube3x3(newScramble, "Cross", preRotation, 1)
  )[0];
  const solutionInverse = translateMoves(
    invertMoves(solution),
    invertMoves(preRotation)
  );
  // cancel out any moves if possible
  return simplifyMoves([...solutionInverse, ...invertMoves(extraMoves)]);
}
