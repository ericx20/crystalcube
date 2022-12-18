import { solve } from "src/lib/cubeLib"
import type { Move, SolverResult } from "./types"

// TODO: make this talk to a web worker, which will solve in a separate thread
// then we can properly use this function async
export function solveEOCross(scramble: Array<Move>): Array<Move> | null {
  return solve(scramble, "EOCross")
}

export function solveEOLine(scramble: Array<Move>): Array<Move> | null {
  return solve(scramble, "EOLine")
}

const testScram = "R2 U' F2 U2 L2 B2 U' F2 R2 D' F2 L' U' L2 B F D L D' U2".split(" ") as Array<Move>
const sol = solve(testScram, "EOCross", ["x"])
console.log(sol)