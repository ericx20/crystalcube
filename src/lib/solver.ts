import { solve } from "src/lib/cubeLib"
import type { Move } from "./types"

// TODO: make this talk to a web worker, which will solve in a separate thread
// then we can properly use this function async
export function solveEOCross(scramble: Array<Move>): Array<Move> | null {
  return solve(scramble, 'EOCross')
}

const testScram = "R' U' D' R' F' R2 D R2 D B' F2 D2 B2 D R' U' L U' D' B2 L' B' D L2 B".split(" ") as Array<Move>
console.log(solveEOCross(testScram))
