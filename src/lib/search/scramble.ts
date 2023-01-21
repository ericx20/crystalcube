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
