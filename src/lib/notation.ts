import type { MoveSeq, MoveSet } from "./types"
import { HTM_MOVESET } from "./constants"


// TODO: remove moveSet param, and allow stuff like user-entered scrambles to be any valid Singmaster notation
export function isValidNotation(notation: string, moveSet: MoveSet = HTM_MOVESET): boolean {
  const validTokens: Array<string> = [...moveSet]
  // either the scramble is empty, OR when you split the sequence by spaces, each token is a valid move
  return notation === "" || notation.trim().split(" ").every(token => validTokens.includes(token))
}

export function parseNotation(algString: string): MoveSeq {
  return isValidNotation(algString)
    ? algString.split(" ").filter(m => m) as MoveSeq
    : []
}
