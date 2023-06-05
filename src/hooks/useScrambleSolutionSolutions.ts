import { useCallback, useEffect, useState } from "react"
import type { MoveSeq, SolverConfigName } from "src/lib/types"
import { nFlipScramble, nMoveScrambleForSolver, simplifyScramble, solve } from "src/lib"
import { randomScramble } from "src/utils/randomScramble"


export type ScrambleMode = "random" | "nFlip" | "nMove"

export default function useScrambleAndSolutions(
  solverName: SolverConfigName,
  mode: ScrambleMode,
  nFlip: number,
  nMove: number, onNewScramble?: () => void
) {
  const [scramble, setScramble] = useState<MoveSeq>([])
  const [solution, setSolution] = useState<MoveSeq>([])
  const [solutions, setSolutions] = useState<Array<MoveSeq>>([])
  const [isLoading, setLoading] = useState(false)

  const generateScramble: () => Promise<MoveSeq> = ({
    random: randomScramble,
    nFlip: () => nFlipScramble(nFlip),
    nMove: async () => await nMoveScrambleForSolver(nMove, solverName, ["x2"]) ?? [],
  })[mode]

  const getNext = useCallback(async () => {
    setLoading(true)
    const newScramble = await generateScramble()
    // TODO: REMOVE HARDCODE FOR: x2 away from scramble orientation
    const newSolutions = solve(newScramble, solverName, ["x2"], 5)
    const optimalSolutionLength = newSolutions.at(0)?.length ?? 0
    const suboptimality = (optimalSolutionLength < 5) ? (10 - optimalSolutionLength) : 3
    const simplifiedScramble = simplifyScramble(newScramble, solverName, ["x2"], suboptimality)
    setScramble(simplifiedScramble)
    setSolution([])
    setSolutions(newSolutions)
    setLoading(false)
    onNewScramble && onNewScramble()
  }, [generateScramble, onNewScramble])

  const setCustomScrambleWithSolutions = useCallback(async (newScramble: MoveSeq) => {
    setLoading(true)
    const newSolutions = solve(newScramble, solverName, ["x2"], 5)
    setScramble(newScramble)
    setSolutions(newSolutions)
    setLoading(false)
    onNewScramble && onNewScramble()
  }, [solverName])

  // generate scram+solution upon load or whenever the settings change
  useEffect(() => {
    getNext()
  }, [solverName, mode, nFlip, nMove])

  return {
    scramble,
    setScramble: setCustomScrambleWithSolutions,
    solution,
    setSolution,
    solutions,
    isLoading,
    getNext,
  }
}
