import { FACES, Facelet, FaceletIndex, FaceletCube, IndexedFaceletCube } from "./cubeDefs"
import type { Cube, EO, Mask, Move, Perm } from "./cubeDefs"

export const SOLVED_FACELET_CUBE: Readonly<FaceletCube> = [
                 "U", "U", "U",
                 "U", "U", "U",
                 "U", "U", "U",
  "L", "L", "L", "F", "F", "F", "R", "R", "R", "B", "B", "B",
  "L", "L", "L", "F", "F", "F", "R", "R", "R", "B", "B", "B",
  "L", "L", "L", "F", "F", "F", "R", "R", "R", "B", "B", "B",
                 "D", "D", "D",
                 "D", "D", "D",
                 "D", "D", "D",
]

export const SOLVED_INDEXED_FACELET_CUBE: Readonly<IndexedFaceletCube> = [...Array(54).keys()]

export const MOVE_PERMS: { [move in Move]: Array<Perm>} = {
  "B":  [[ 0, 33], [ 1, 21], [ 2,  9], [ 9, 51], [17,  0], [18, 20], [19, 32], [20, 44], [21, 52], [29,  1], [30, 19], [32, 43], [33, 53], [41,  2], [42, 18], [43, 30], [44, 42], [51, 41], [52, 29], [53, 17]],
  "B'": [[ 0, 17], [ 1, 29], [ 2, 41], [ 9,  2], [17, 53], [18, 42], [19, 30], [20, 18], [21,  1], [29, 52], [30, 43], [32, 19], [33,  0], [41, 51], [42, 44], [43, 32], [44, 20], [51,  9], [52, 21], [53, 33]],
  "B2": [[ 0, 53], [ 1, 52], [ 2, 51], [ 9, 41], [17, 33], [18, 44], [19, 43], [20, 42], [21, 29], [29, 21], [30, 32], [32, 30], [33, 17], [41,  9], [42, 20], [43, 19], [44, 18], [51,  2], [52,  1], [53,  0]],
  "D":  [[33, 36], [34, 37], [35, 38], [36, 39], [37, 40], [38, 41], [39, 42], [40, 43], [41, 44], [42, 33], [43, 34], [44, 35], [45, 47], [46, 50], [47, 53], [48, 46], [50, 52], [51, 45], [52, 48], [53, 51]],
  "D'": [[33, 42], [34, 43], [35, 44], [36, 33], [37, 34], [38, 35], [39, 36], [40, 37], [41, 38], [42, 39], [43, 40], [44, 41], [45, 51], [46, 48], [47, 45], [48, 52], [50, 46], [51, 53], [52, 50], [53, 47]],
  "D2": [[33, 39], [34, 40], [35, 41], [36, 42], [37, 43], [38, 44], [39, 33], [40, 34], [41, 35], [42, 36], [43, 37], [44, 38], [45, 53], [46, 52], [47, 51], [48, 50], [50, 48], [51, 47], [52, 46], [53, 45]],
  "F":  [[ 6, 15], [ 7, 27], [ 8, 39], [11,  8], [12, 14], [13, 26], [14, 38], [15, 47], [23,  7], [24, 13], [26, 37], [27, 46], [35,  6], [36, 12], [37, 24], [38, 36], [39, 45], [45, 11], [46, 23], [47, 35]],
  "F'": [[ 6, 35], [ 7, 23], [ 8, 11], [11, 45], [12, 36], [13, 24], [14, 12], [15,  6], [23, 46], [24, 37], [26, 13], [27,  7], [35, 47], [36, 38], [37, 26], [38, 14], [39,  8], [45, 39], [46, 27], [47, 15]],
  "F2": [[ 6, 47], [ 7, 46], [ 8, 45], [11, 39], [12, 38], [13, 37], [14, 36], [15, 35], [23, 27], [24, 26], [26, 24], [27, 23], [35, 15], [36, 14], [37, 13], [38, 12], [39, 11], [45,  8], [46,  7], [47,  6]],
  "L":  [[ 0, 12], [ 3, 24], [ 6, 36], [ 9, 11], [10, 23], [11, 35], [12, 45], [20,  6], [21, 10], [23, 34], [24, 48], [32,  3], [33,  9], [34, 21], [35, 33], [36, 51], [44,  0], [45, 44], [48, 32], [51, 20]],
  "L'": [[ 0, 44], [ 3, 32], [ 6, 20], [ 9, 33], [10, 21], [11,  9], [12,  0], [20, 51], [21, 34], [23, 10], [24,  3], [32, 48], [33, 35], [34, 23], [35, 11], [36,  6], [44, 45], [45, 12], [48, 24], [51, 36]],
  "L2": [[ 0, 45], [ 3, 48], [ 6, 51], [ 9, 35], [10, 34], [11, 33], [12, 44], [20, 36], [21, 23], [23, 21], [24, 32], [32, 24], [33, 11], [34, 10], [35,  9], [36, 20], [44, 12], [45,  0], [48,  3], [51,  6]],
  "R":  [[ 2, 42], [ 5, 30], [ 8, 18], [14,  2], [15, 17], [16, 29], [17, 41], [18, 53], [26,  5], [27, 16], [29, 40], [30, 50], [38,  8], [39, 15], [40, 27], [41, 39], [42, 47], [47, 14], [50, 26], [53, 38]],
  "R'": [[ 2, 14], [ 5, 26], [ 8, 38], [14, 47], [15, 39], [16, 27], [17, 15], [18,  8], [26, 50], [27, 40], [29, 16], [30,  5], [38, 53], [39, 41], [40, 29], [41, 17], [42,  2], [47, 42], [50, 30], [53, 18]],
  "R2": [[ 2, 47], [ 5, 50], [ 8, 53], [14, 42], [15, 41], [16, 40], [17, 39], [18, 38], [26, 30], [27, 29], [29, 27], [30, 26], [38, 18], [39, 17], [40, 16], [41, 15], [42, 14], [47,  2], [50,  5], [53,  8]],
  "U":  [[ 0,  2], [ 1,  5], [ 2,  8], [ 3,  1], [ 5,  7], [ 6,  0], [ 7,  3], [ 8,  6], [ 9, 18], [10, 19], [11, 20], [12,  9], [13, 10], [14, 11], [15, 12], [16, 13], [17, 14], [18, 15], [19, 16], [20, 17]],
  "U'": [[ 0,  6], [ 1,  3], [ 2,  0], [ 3,  7], [ 5,  1], [ 6,  8], [ 7,  5], [ 8,  2], [ 9, 12], [10, 13], [11, 14], [12, 15], [13, 16], [14, 17], [15, 18], [16, 19], [17, 20], [18,  9], [19, 10], [20, 11]],
  "U2": [[ 0,  8], [ 1,  7], [ 2,  6], [ 3,  5], [ 5,  3], [ 6,  2], [ 7,  1], [ 8,  0], [ 9, 15], [10, 16], [11, 17], [12, 18], [13, 19], [14, 20], [15,  9], [16, 10], [17, 11], [18, 12], [19, 13], [20, 14]],
}

export function applyMove<C extends Cube>(cube: C, move: Move): C {
  let newCube = [...cube] as C
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

function faceletCubeToString(cube: FaceletCube) {
  return cube.join("")
}

type PruningTable = { [k: string]: number }

export function genPruningTable(solvedStates: Array<FaceletCube>, depth: number, moveset: Array<Move>): PruningTable {
  let pruningTable: PruningTable = {}
  let previousFrontier: Array<FaceletCube> = [...solvedStates]
  solvedStates.forEach(state => pruningTable[faceletCubeToString(state)] = 0)

  for (let i = 1; i <= depth; i++) {
    const frontier: Array<FaceletCube> = []
    for (const state of previousFrontier) {
      // for every previous state: try all possible moves on it
      for (const move of moveset) {
        const newState = applyMove(state, move)
        const newStateString = faceletCubeToString(newState)
        if (!pruningTable[newStateString]) {
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

// Every edge has two facelets: one that is currently inside a "purple" group, and one currently in a "black" group
// For each edge, these arrays categorize its two facelets into the two groups
// The edges are indexed in the order [UB, UL, UR, UF, BL, FL, FR, BR, DF, DL, DR, DB]
const EDGE_PURPLE_FACELET_INDICES: Readonly<Array<FaceletIndex>> = [1, 3, 5, 7, 32, 24, 26, 30, 46, 48, 50, 52]
const EDGE_BLACK_FACELET_INDICES: Readonly<Array<FaceletIndex>> = [19, 10, 16, 13, 21, 23, 27, 29, 37, 34, 40, 43]

const GOOD_PURPLE_GROUP_FACELETS: Readonly<Array<Facelet>> = ["U", "D", "O"]
const GOOD_BLACK_GROUP_FACELETS: Readonly<Array<Facelet>> = ["L", "R"]

export function getFaceletCubeEO(cube: FaceletCube): EO {
  return [...Array(12).keys()].map(index => {
    const purpleGroupFacelet = cube[EDGE_PURPLE_FACELET_INDICES[index]]
    const blackGroupFacelet = cube[EDGE_BLACK_FACELET_INDICES[index]]
    return (GOOD_PURPLE_GROUP_FACELETS.includes(purpleGroupFacelet) || GOOD_BLACK_GROUP_FACELETS.includes(blackGroupFacelet))
  })
}

export const CROSS_FACELETS: Readonly<Array<FaceletIndex>> = [4, 22, 25, 28, 31, 34, 37, 40, 43, 46, 48, 49, 50, 52]
export const EO_FACELETS: Readonly<Array<FaceletIndex>> = [1, 3, 5, 7, 24, 26, 30, 32, 46, 48, 50, 52]


export function getMaskedFaceletCube(mask: Mask): FaceletCube {
  return SOLVED_INDEXED_FACELET_CUBE.map(faceletIdx => {
    if (mask.solvedFaceletIndices.includes(faceletIdx)) {
      return colorOfIndexedFacelet(faceletIdx)
    }
    if (mask.eoFaceletIndices.includes(faceletIdx)) {
      return "O"
    }
    return "X"
  })
}

export const EOCROSS_MASK: Mask = {
  solvedFaceletIndices: CROSS_FACELETS,
  eoFaceletIndices: EO_FACELETS,
}

const eocrossMaskedCube = getMaskedFaceletCube(EOCROSS_MASK)

// TODO: replace with a safer alternative
const htmMoves = FACES.flatMap(m => [m, m + "'", m + "2"]) as Array<Move>

// const newTable = genPruningTable([eocrossMaskedCube], 4, htmMoves)

// TODO: keep refactoring more of solver.js, move the solver parts to a web worker
