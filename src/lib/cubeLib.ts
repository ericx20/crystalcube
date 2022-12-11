import type { Cube, EO, Facelet, FaceletIndex, FaceletCube, IndexedFaceletCube, Mask, Move, Perm, PruningTable, SolverConfig, SolverConfigName } from "./types"
import { HTM_MOVESET, MOVE_PERMS, SOLVED_INDEXED_FACELET_CUBE, SOLVER_CONFIGS } from "./constants";
import { getPruningTable } from "./pruningTableCache";

export function applyMove<C extends Cube>(cube: C, move: Move): C {
  const newCube = [...cube] as C
  const perms = MOVE_PERMS[move]
  perms.forEach(([src, dst]) => newCube[dst] = cube[src]);
  return newCube
}

export function applyMoves<C extends Cube>(cube: C, moves: Array<Move>): C {
  return moves.reduce(applyMove, cube)
}

export function colorOfIndexedFacelet(index: number): Facelet {
  const table: Array<Facelet> = ["U", "U", "U", "L", "F", "R", "B", "L", "F", "R", "B", "L", "F", "R", "B", "D", "D", "D"]
  return table[Math.floor(index / 3)]
}

export function faceletCubeToString(cube: FaceletCube): string {
  return cube.join("")
}

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

// EO recognition:
// good edge: U/D/O facelet in purple group, and/or L/R facelet in black group

// TODO: move these constants to constants.ts, but the [GOOD/BAD]_PURPLE_GROUP_FACELETS
// need to become functions of the cube's centre piece positions

// Every edge has two facelets: one that is currently inside a "purple" group, and one currently in a "black" group
// For each edge, these arrays categorize its two facelets into the two groups
// The edges are indexed in the order [UB, UL, UR, UF, BL, FL, FR, BR, DF, DL, DR, DB]
const EDGE_PURPLE_FACELET_INDICES: Readonly<Array<FaceletIndex>> = [1, 3, 5, 7, 32, 24, 26, 30, 46, 48, 50, 52]
const EDGE_BLACK_FACELET_INDICES: Readonly<Array<FaceletIndex>> = [19, 10, 16, 13, 21, 23, 27, 29, 37, 34, 40, 43]

// TODO: generalize so that instead of comparing facelets to absolute colours U/D, L/R,
// we sample the colours of the centres (check the locations of the U/D, L/R centres)
const GOOD_PURPLE_GROUP_FACELETS: Readonly<Array<Facelet>> = ["U", "D", "O"]
const GOOD_BLACK_GROUP_FACELETS: Readonly<Array<Facelet>> = ["L", "R"]

export function getFaceletCubeEO(cube: FaceletCube): EO {
  return [...Array(12).keys()].map(index => {
    const purpleGroupFacelet = cube[EDGE_PURPLE_FACELET_INDICES[index]]
    const blackGroupFacelet = cube[EDGE_BLACK_FACELET_INDICES[index]]
    return (GOOD_PURPLE_GROUP_FACELETS.includes(purpleGroupFacelet) || GOOD_BLACK_GROUP_FACELETS.includes(blackGroupFacelet))
  })
}

export function getMaskedFaceletCube(cube: IndexedFaceletCube, mask: Mask): FaceletCube {
  return cube.map(faceletIdx => {
    if (mask.solvedFaceletIndices.includes(faceletIdx)) {
      return colorOfIndexedFacelet(faceletIdx)
    }
    if (mask.eoFaceletIndices?.includes(faceletIdx)) {
      return "O"
    }
    return "X"
  })
}

function isSolved(cube: FaceletCube, pruningTable: PruningTable): boolean {
  return pruningTable[faceletCubeToString(cube)] === 0
}

// Depth limited search
// NOTE: MUTATES THE SOLUTION ARRAY
// TODO: nest this inside the solve() function and make it directly access its pruningTable (and solutions accumulator) in scope
function solveDepth(config: SolverConfig, pruningTable: PruningTable, cube: FaceletCube, solution: Array<Move>, depthRemaining: number): Array<Move> | null {
  if (isSolved(cube, pruningTable)) return solution // cube is solved! return what we got
  
  // pruning
  let lowerBound = pruningTable[faceletCubeToString(cube)] // least # moves needed to solve this scram
  if (lowerBound === undefined) {
    // if the pruning depth was 4 and it doesn't have our cube state,
    // then we need 5 or more moves to solve the cube
    lowerBound = config.pruningDepth + 1
  }
  if (lowerBound > depthRemaining) {
    return null
  }

  // cube is unsolved but we still have some remaining depth
  for (const move of config.moveset) {
    if (solution.length && move[0] === solution[solution.length - 1][0]) {
      continue // optimization: never use the same layer in consecutive moves
    }
    // try every available move by recursively calling solveDepth
    solution.push(move)
    let result = solveDepth(
      config,
      pruningTable,
      applyMove(cube, move), // copy of cube + the move done
      solution,
      depthRemaining - 1
    )
    // if a recursive call found a solution, then propagate it up
    if (result !== null) return result
    solution.pop() // otherwise, remove the move we tried and try another move
  }
  // ok we tried everything but nothing was found
  return null
}

export function solve(scram: Array<Move>, configName: SolverConfigName): Array<Move> | null {
  const config = SOLVER_CONFIGS[configName]
  const scrambledCube = applyMoves(SOLVED_INDEXED_FACELET_CUBE, scram)
  const maskedCube = getMaskedFaceletCube(scrambledCube, config.mask)
  const pruningTable = getPruningTable(configName)
  for (let depth = 0; depth <= config.depthLimit; depth++) {
    const solution = solveDepth(config, pruningTable, maskedCube, [], depth)
    if (solution !== null) return solution
  }
  return null
}

// TODO: remove moveset param, and allow stuff like user-entered scrambles to be any valid Singmaster notation
export function isValidNotation(notation: string, moveset: Array<Move> = HTM_MOVESET): boolean {
  const validTokens: Array<string> = moveset
  // either the scramble is empty, OR when you split the sequence by spaces, each token is a valid move
  return notation === "" || notation.trim().split(" ").every((token) => validTokens.includes(token))
}
