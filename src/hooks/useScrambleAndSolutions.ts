import { useCallback, useEffect, useState } from "react"
import { randomScrambleForEvent } from "cubing/scramble"
import type { MoveSeq, SolverConfigName } from "src/lib/types"
import { nFlipScramble, nMoveScrambleForSolver, parseNotation, solve } from "src/lib"

export type ScrambleMode = "random" | "nFlip" | "nMove"

export default function useScrambleAndSolutions(
  solverName: SolverConfigName,
  mode: ScrambleMode,
  nFlip: number,
  nMove: number, onNewScramble?: () => void
) {
  const [scramble, setScramble] = useState<MoveSeq>([])
  const [solutions, setSolutions] = useState<Array<MoveSeq>>([])

  const generateScramble: () => Promise<MoveSeq> = ({
    random: async () => {
      const rawScramble = await randomScrambleForEvent("333")
      return parseNotation(rawScramble.toString())
    },
    nFlip: () => nFlipScramble(nFlip),
    nMove: async () => {
      return await nMoveScrambleForSolver(nMove, solverName, ["x2"]) ?? []
    }
  })[mode]

  const getNext = useCallback(async () => {
    const scramble = await generateScramble()
    // TODO: REMOVE HARDCODE FOR: x2 away from scramble orientation
    const solutions = solve(scramble, solverName, ["x2"])
    setScramble(scramble)
    setSolutions(solutions)
    onNewScramble && onNewScramble()
  }, [generateScramble])

  // generate scram+solution upon load or whenever the settings change
  useEffect(() => {
    getNext()
  }, [mode, nFlip, nMove])

  // regenerate solution whenever solverName changes
  useEffect(() => {
    setSolutions(solve(scramble, solverName, ["x2"]))
    onNewScramble && onNewScramble()
  }, [solverName])

  return {
    scramble,
    solutions,
    getNext,
  }
}
