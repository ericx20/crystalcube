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

function isValidMoveVC(move: string): boolean {
  if("weiosdfghjkl".search(move)) return true
  return false
}
export function isValidVC(vc: string): boolean {
  return vc === "" || vc.trim().split("").every(isValidMoveVC)
}
export function parseVC(vc: string): Move {
  const moveTable: {[name: string]: string} = {
    "w": "B",
    "e": "L'",
    "i": "R",
    "o": "B'",
    "s": "D",
    "d": "L",
    "f": "U'",
    "g": "F'",
    "h": "F",
    "j": "U",
    "k": "R'",
    "l": "D'"
  }
  return (moveTable[vc]??"") as Move;
}