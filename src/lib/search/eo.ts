import type { FaceletIndex, FaceletCube, EO, Facelet, Move, MoveSeq } from "../types"
import { SOLVED_FACELET_CUBE } from "../constants"
import { applyMoves } from "../moves"


// EO recognition:
// good edge: U/D/O facelet in purple group, and/or L/R facelet in black group

// Every edge has two facelets: one that is currently inside a "purple" group, and one currently in a "black" group
// For each edge, these arrays categorize its two facelets into the two groups
// The edges are indexed in the order [UB, UL, UR, UF, BL, FL, FR, BR, DF, DL, DR, DB]
const EDGE_PURPLE_FACELET_INDICES: Readonly<Array<FaceletIndex>> = [1, 3, 5, 7, 32, 24, 26, 30, 46, 48, 50, 52]
const EDGE_BLACK_FACELET_INDICES: Readonly<Array<FaceletIndex>> = [19, 10, 16, 13, 21, 23, 27, 29, 37, 34, 40, 43]

/**
 * @deprecated
 */
export function getFaceletCubeEO(cube: FaceletCube): EO {
  const uCenterFacelet = cube[4]
  const dCenterFacelet = cube[49]
  const lCenterFacelet = cube[22]
  const rCenterFacelet = cube[28]
  const goodPurpleGroupFacelets: Array<Facelet> = [uCenterFacelet, dCenterFacelet, "O"]
  const GOOD_BLACK_GROUP_FACELETS: Array<Facelet> = [lCenterFacelet, rCenterFacelet]

  return [...Array(12).keys()].map(index => {
    const purpleGroupFacelet = cube[EDGE_PURPLE_FACELET_INDICES[index]]
    const blackGroupFacelet = cube[EDGE_BLACK_FACELET_INDICES[index]]
    return (goodPurpleGroupFacelets.includes(purpleGroupFacelet) || GOOD_BLACK_GROUP_FACELETS.includes(blackGroupFacelet))
  })
}

/**
 * @deprecated
 */
function countBadEdges(cube: FaceletCube): number {
  return getFaceletCubeEO(cube).reduce((n, x) => n + (x === false ? 1 : 0), 0)
}

// TODO: REMOVE HARDCODED X2, support premoves
const EO_CHANGING_MOVES: Array<Move> = ["F", "F'", "B", "B'"]
/**
 * @deprecated
 */
export function getEOSolutionAnnotation(scramble: MoveSeq, solution: MoveSeq): Array<string | null> {
  const scrambledCube = applyMoves([...SOLVED_FACELET_CUBE], scramble)
  const badEdgeArray = [...Array(solution.length + 1).keys()].map(index => {
    const state = applyMoves(scrambledCube, ["x2", ...solution.slice(0, index)])
    return countBadEdges(state)
  })

  return solution.map((move, index) => {
    const numBadEdges = badEdgeArray[index]
    const nextNumBadEdges = badEdgeArray[index + 1]
    const change = nextNumBadEdges - numBadEdges
    if (!EO_CHANGING_MOVES.includes(move)) {
      return null
    }
    if (change < 0) {
      return change.toString()
    }
    if (change === 0) {
      return "-0"
    }
    return "+" + change.toString()
  })
}

/**
 * @deprecated
 */
export function isValidNFlip(n: number) {
  return Number.isInteger(n) && n % 2 === 0
}
