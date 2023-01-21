import type { MoveSeq, SolverConfigName, CubeRotation } from "../types"
import { solve } from "./solve"
import { invertMoves } from "../moves"

export function simplify(
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
