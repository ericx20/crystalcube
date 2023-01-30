import type { Move, MoveSeq } from "./types"
import { isLayerMove, isRotation } from "./moves"


// intended for forms and text inputs
export function isValidNotation(notation: string): boolean {
  // either the scramble is empty, OR when you split the sequence by spaces, each token is a valid move
  return notation === "" || notation.trim().split(" ").every(isValidMove)
}

const BAD_APOSTROPHES: ReadonlyArray<string> = ["’", "`"]
export function replaceBadApostrophes(notation: string): string {
  return notation
    .split("")
    .map(char => BAD_APOSTROPHES.includes(char) ? "'" : char)
    .join("")
}

export function parseNotation(algString: string): MoveSeq {
  return isValidNotation(algString)
    ? algString
      .trim()
      .split(" ")
      .filter(m => m) as MoveSeq
    : []
}

function isValidMove(move: string): move is Move {
  return isRotation(move as Move) || isLayerMove(move as Move)
}