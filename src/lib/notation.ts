import { HTM_MOVESET } from "./constants"
import { MoveSeq } from "./types"


// TODO: remove moveset param, and allow stuff like user-entered scrambles to be any valid Singmaster notation
export function isValidNotation(notation: string, moveset: MoveSeq = HTM_MOVESET): boolean {
  const validTokens: Array<string> = moveset
  // either the scramble is empty, OR when you split the sequence by spaces, each token is a valid move
  return notation === "" || notation.trim().split(" ").every((token) => validTokens.includes(token))
}

export function parseNotation(algString: string): MoveSeq {
  return isValidNotation(algString)
    ? algString.split(" ").filter(m => m) as MoveSeq
    : []
}
