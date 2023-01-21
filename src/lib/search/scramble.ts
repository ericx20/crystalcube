import type { CubeRotation, MoveSeq, SolverConfigName } from "../types";
import { SOLVED_FACELET_CUBE, SOLVER_CONFIGS } from "../constants";
import { applyMask, faceletCubeToString } from "../cubeState";
import { isValidNFlip } from "./eo";
import { applyMoves, appendRandomMove, invertMoves, randomMoves } from "../moves";
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
// TODO: add nMoveScrambleLimit and nMoveScrambleMaxIterations to solver configs
// TODO: make this async
export function nMoveScrambleForSolver(n: number, solverName: SolverConfigName, preRotation: Array<CubeRotation> = []): MoveSeq | null {
  const MAX_ITERATIONS = 200
  const solverConfig = SOLVER_CONFIGS[solverName]

  // TODO: change this to solverConfig.nMoveScrambleLimit
  if (n > solverConfig.depthLimit) {
    return null
  }

  // the optimal solution for an n-move sequence will always be at most n
  // e.g. if you scramble with 3 moves, the optimal solution will always be at most 3 moves long
  // therefore optimalSolutionLength <= n
  let scramble: MoveSeq = randomMoves(n)
  for (let i = 0; i < MAX_ITERATIONS; i++) {
    console.log(`iteration #${i+1}`);
    // console.log(scramble.join(" "))
    // check pruning table to see if it has length of optimal solution
    const solvedCube = applyMask(SOLVED_FACELET_CUBE, solverConfig.mask)
    const scrambledCube = applyMoves(solvedCube, scramble)
    const stringCube = faceletCubeToString(scrambledCube)
    const optimalSolutionLength = getPruningTable(solverName)[stringCube]
      ?? solve(scramble, solverName, preRotation, 1)[0].length
    if (optimalSolutionLength === n) {
      // the scramble is the right difficulty, bingo
      return simplifyScramble(scramble, solverName, preRotation)
    }

    // the scramble is not hard enough, add an extra move
    appendRandomMove(scramble)
  }
  return null
}

export function simplifyScramble(
  moves: MoveSeq,
  solverName: SolverConfigName,
  preRotation: Array<CubeRotation> = [],
  nthSolutionToPick: number = 1
): MoveSeq {
  const numSolutions = nthSolutionToPick
  const solution = solve(moves, solverName, preRotation, numSolutions)
  if (solution.length) {
    return invertMoves(solution[solution.length - 1])
  }
  return moves
}
