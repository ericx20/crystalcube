import type { SolverConfig, SolverConfigName, PruningTable, FaceletCube } from "../types"
import { SOLVED_FACELET_CUBE, SOLVER_CONFIGS } from "../constants"
import { faceletCubeToString, applyMask } from "../cubeState"
import { applyMove } from "../moves"


export function genPruningTable(config: SolverConfig): PruningTable {
  const solvedState = applyMask(SOLVED_FACELET_CUBE, config.mask)
  const pruningTable: PruningTable = {}
  let previousFrontier: Array<FaceletCube> = [solvedState]
  pruningTable[faceletCubeToString(solvedState)] = 0

  for (let i = 1; i <= config.pruningDepth; i++) {
    const frontier: Array<FaceletCube> = []
    for (const state of previousFrontier) {
      // for every previous state: try all possible moves on it
      for (const move of config.moveSet) {
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


// TODO: persist in browser cache
// TODO: make this load asynchronously in a web worker to not block the page from loading

const pruningTables = new Map<SolverConfigName, PruningTable>()

export function getPruningTable(name: SolverConfigName): PruningTable {
  const cachedResult = pruningTables.get(name)
  if (!cachedResult) {
    const config = SOLVER_CONFIGS[name]
    const pruningTable = genPruningTable(config)
    pruningTables.set(name, pruningTable)
    return pruningTable
  }

  return cachedResult
}
