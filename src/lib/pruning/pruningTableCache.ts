// TODO: persist in browser cache
// TODO: make this load asynchronously in a web worker to not block the page from loading

import type { PruningTable, SolverConfigName } from "../types";
import { SOLVER_CONFIGS } from "../constants";
import { genPruningTable } from "./genPruningTable";


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
