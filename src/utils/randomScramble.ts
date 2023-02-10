import type { MoveSeq } from "src/lib/types"
import { parseNotation } from "src/lib"

import { randomScrambleForEvent } from "cubing/scramble"


export async function randomScramble(): Promise<MoveSeq> {
  const rawScramble = await randomScrambleForEvent("333")
  return parseNotation(rawScramble.toString())
}
