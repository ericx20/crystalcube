import type { RotationMove, MoveSeq, SolverConfigName } from "../types";
import { SOLVED_INDEXED_FACELET_CUBE, SOLVER_CONFIGS } from "../constants";
import { faceletCubeToString, getMaskedFaceletCube, printFaceletCube } from "../cubeState";
import { isValidNFlip } from "./eo";
import { applyMoves, appendRandomMove, invertMoves, randomMoves, translateMoves } from "../moves";
import { parseNotation } from "../notation";
import { getPruningTable } from "./prune";
import { solve } from "./solve";

import { KState } from "cubing/kpuzzle"
import { experimentalSolve3x3x3IgnoringCenters, random333State } from "cubing/search";
import shuffle from "lodash/shuffle"

export async function nFlipScramble(n: number): Promise<MoveSeq> {
  const { kpuzzle, stateData } = await random333State()
  const newStateData = {
    ...stateData,
    EDGES: {
      orientation: nFlipEOArray(n),
      pieces: stateData.EDGES.pieces
    }
  }
  const newPuzzle = new KState(kpuzzle, newStateData)
  const solution = await experimentalSolve3x3x3IgnoringCenters(newPuzzle)
  return invertMoves(parseNotation(solution.toString()))
}

function nFlipEOArray(n: number): Array<number> {
  if (!isValidNFlip(n)) {
    console.error("nFlipEOArray(): must be an even integer from 0 to 12 inclusive")
    return Array(12).fill(0)
  }
  const goodEdges = Array<number>(12 - n).fill(0)
  const badEdges = Array<number>(n).fill(1)
  return shuffle(goodEdges.concat(badEdges))
}

// generate scrambles that need n moves to solve optimally
// n must be integer from 0 to solverConfig.nMoveScrambleLimit
// TODO: add nMoveScrambleLimit and nMoveScrambleMaxIterations to solver configs, same with maxIterations
// better yet, some range so minimum 2 move eocross to maximum 9 move eocross
// TODO: make this actually async
export async function nMoveScrambleForSolver(
  n: number,
  solverName: SolverConfigName,
  preRotation: Array<RotationMove> = []
): Promise<MoveSeq | null> {
  const solverConfig = SOLVER_CONFIGS[solverName]
  const { min, max, iterationLimit } = solverConfig.nMoveScrambleConfig
  if (n < min || n > max) {
    return null
  }

  // the optimal solution for an n-move sequence will always be at most n
  // e.g. if you scramble with 3 moves, the optimal solution will always be at most 3 moves long
  // therefore optimalSolutionLength <= n
  let scramble: MoveSeq = randomMoves(n)
  for (let i = 0; i < iterationLimit; i++) {
    // console.log(`iteration #${i+1}`);
    // check pruning table to see if it has length of optimal solution
    const translatedScramble = [...invertMoves(preRotation), ...scramble, ...preRotation]
    const scrambledCube = applyMoves([...SOLVED_INDEXED_FACELET_CUBE], translatedScramble)
    const maskedCube = getMaskedFaceletCube(scrambledCube, solverConfig.mask)
    const stringCube = faceletCubeToString(maskedCube)

    const optimalSolutionLength = getPruningTable(solverName)[stringCube]
      ?? solve(scramble, solverName, preRotation, 1)[0].length
    if (optimalSolutionLength === n) {
      // the scramble is the right difficulty, bingo
      console.log(`iteration #${i+1}`);
      return simplifyScramble(scramble, solverName, preRotation)
    }

    // the scramble is not hard enough, add an extra move
    appendRandomMove(scramble)
  }
  console.log(`failed to gen scramble`);
  return null
}

export function simplifyScramble(
  scramble: MoveSeq,
  solverName: SolverConfigName,
  preRotation: Array<RotationMove> = [],
  nthSolutionToPick: number = 1
): MoveSeq {
  console.log(scramble.join(" "))
  const numSolutions = nthSolutionToPick
  const solutions = solve(scramble, solverName, preRotation, numSolutions)
  if (solutions.length) {
    const solutionToPick = solutions[solutions.length - 1]
    const scramble = translateMoves(invertMoves(solutionToPick), invertMoves(preRotation))
    return scramble
  }
  return scramble
}
