import type { SolverConfig, PruningTable, FaceletCube } from "../types"
import { SOLVED_INDEXED_FACELET_CUBE } from "../constants"
import { faceletCubeToString, getMaskedFaceletCube } from "../cubeState"
import { applyMove } from "../moves"


export function genPruningTable(config: SolverConfig): PruningTable {
  const solvedState = getMaskedFaceletCube(SOLVED_INDEXED_FACELET_CUBE, config.mask)
  const pruningTable: PruningTable = {}
  let previousFrontier: Array<FaceletCube> = [solvedState]
  pruningTable[faceletCubeToString(solvedState)] = 0

  for (let i = 1; i <= config.pruningDepth; i++) {
    const frontier: Array<FaceletCube> = []
    for (const state of previousFrontier) {
      // for every previous state: try all possible moves on it
      for (const move of config.moveset) {
        const newState = applyMove(state, move)
        const newStateString = faceletCubeToString(newState)
        if (pruningTable[newStateString] === undefined) {
          pruningTable[newStateString] = i // add this state to pruning table
          frontier.push(newState) // add this to frontier so it can then become previousFrontier
        }
      }
    }
    previousFrontier = [...frontier]
  }

  return pruningTable
}
