import { useCallback, useEffect, useState } from "react"
import { randomScrambleForEvent } from "cubing/scramble"
import type { MoveSeq, SolverConfigName } from "src/lib/types"
import { nFlipScramble, parseNotation, solveV2 } from "src/lib/cubeLib"

export type ScrambleMode = "random" | "nFlip"

export default function useScrambleAndSolutions(solverName: SolverConfigName, mode: ScrambleMode, nFlip: number, onNewScramble?: () => void) {
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
    const solutions = solveV2(scramble, solverName)
    setScramble(scramble)
    setSolutions(solutions)
    onNewScramble && onNewScramble()
  }, [getScramble])

  // generate scram+solution upon load or whenever the settings change
  useEffect(() => {
    getNext()
  }, [solverName, mode, nFlip])

  return {
    scramble,
    solutions,
    getNext,
  }
}
