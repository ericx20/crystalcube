import { useCallback, useEffect, useState } from "react"
import { randomScrambleForEvent } from "cubing/scramble"
import type { MoveSeq } from "src/lib/types"
import { nFlipScramble, parseNotation, solveV2 } from "src/lib/cubeLib"

export type ScrambleMode = "random" | "nFlip"

export default function useScrambleAndSolutions(mode: ScrambleMode, nFlip: number) {
  const [scramble, setScramble] = useState<MoveSeq>([])
  const [solutions, setSolutions] = useState<Array<MoveSeq>>([])

  const getScramble: () => Promise<MoveSeq> = ({
    random: async () => {
      const rawScramble = await randomScrambleForEvent("333")
      return parseNotation(rawScramble.toString())
    },
    nFlip: () => nFlipScramble(nFlip)
  })[mode]

  const getNext = useCallback(async () => {
    const scramble = await getScramble()
    const solutions = solveV2(scramble, "EOCross")
    setScramble(scramble)
    setSolutions(solutions)
  }, [getScramble])

  // generate scram+solution upon load or whenever the settings change
  useEffect(() => {
    getNext()
  }, [mode, nFlip])

  return {
    scramble,
    solutions,
    getNext,
  }
}
