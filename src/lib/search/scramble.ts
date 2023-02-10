import type { RotationMove, MoveSeq, SolverConfigName } from "../types";
import { SOLVED_INDEXED_FACELET_CUBE, SOLVER_CONFIGS } from "../constants";
import { faceletCubeToString, getMaskedFaceletCube } from "../cubeState";
import { isValidNFlip } from "./eo";
import { applyMoves, appendRandomMove, invertMoves, randomMoves, translateMoves, simplifyMoves } from "../moves";
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
// n must be integer within a range defined by nMoveScrambleConfig
// TODO: make this actually async
export async function nMoveScrambleForSolver(
  n: number,
  solverName: SolverConfigName,
  preRotation: Array<RotationMove> = [],
  simplify = true,
): Promise<MoveSeq | null> {
  const solverConfig = SOLVER_CONFIGS[solverName]
  const { min, max, iterationLimit } = solverConfig.nMoveScrambleConfig
  if (n < min || n > max) {
    return null
  }

  // the optimal solution for an n-move sequence will always be at most n
  // e.g. if you scramble with 3 moves, the optimal solution will always be at most 3 moves long
  // therefore optimalSolutionLength <= n
  const scramble: MoveSeq = randomMoves(n)
  for (let i = 0; i < iterationLimit; i++) {
    // check pruning table to see if it has length of optimal solution
    const translatedScramble = [...invertMoves(preRotation), ...scramble, ...preRotation]
    const scrambledCube = applyMoves([...SOLVED_INDEXED_FACELET_CUBE], translatedScramble)
    const maskedCube = getMaskedFaceletCube(scrambledCube, solverConfig.mask)
    const stringCube = faceletCubeToString(maskedCube)

    const optimalSolutionLength = getPruningTable(solverName)[stringCube]
      ?? solve(scramble, solverName, preRotation, 1)[0].length
    if (optimalSolutionLength === n) {
      // the scramble is the right difficulty, bingo
      return simplify ? simplifyScramble(scramble, solverName, preRotation) : scramble
    }

    // the scramble is not hard enough, add an extra move
    appendRandomMove(scramble)
  }
  console.warn("failed to gen scramble")
  return null
}

export function simplifyScramble(
  scramble: MoveSeq,
  solverName: SolverConfigName,
  preRotation: Array<RotationMove> = [],
  suboptimality = 0,
): MoveSeq {
  const extraMoves = randomMoves(suboptimality)
  const newScramble = [...scramble, ...extraMoves]
  const solution = solve(newScramble, solverName, preRotation, 1).at(0)
  if (!solution) {
    return scramble
  }
  const solutionInverse = translateMoves(invertMoves(solution), preRotation)
  // cancel out any moves if possible
  return simplifyMoves([...solutionInverse, ...invertMoves(extraMoves)])
}
