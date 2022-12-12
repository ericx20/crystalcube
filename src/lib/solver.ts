import { solve } from "src/lib/cubeLib"
import type { Move } from "./types"

// TODO: make this talk to a web worker, which will solve in a separate thread
// then we can properly use this function async
export function solveEOCross(scramble: Array<Move>): Array<Move> | null {
  return solve(scramble, "EOCross")
}

export function solveEOLine(scramble: Array<Move>): Array<Move> | null {
  return solve(scramble, "EOLine")
}
