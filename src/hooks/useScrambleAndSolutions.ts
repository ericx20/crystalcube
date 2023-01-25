import { useCallback, useEffect, useState } from "react"
import type { MoveSeq, SolverConfigName } from "src/lib/types"
import { nFlipScramble, nMoveScrambleForSolver, randomScramble, simplifyScramble, solve } from "src/lib"

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
    random: randomScramble,
    nFlip: () => nFlipScramble(nFlip),
    nMove: async () => await nMoveScrambleForSolver(nMove, solverName, ["x2"]) ?? [],
  })[mode]

  const getNext = useCallback(async () => {
    const scramble = await generateScramble()
    // TODO: REMOVE HARDCODE FOR: x2 away from scramble orientation
    // generate (up to) 6 solutions, present the worst one as a scramble and the rest as solutions
    const solutions = solve(scramble, solverName, ["x2"], 5)
    const optimalSolutionLength = solutions.at(0)?.length ?? 0
    const suboptimality = (optimalSolutionLength < 5) ? (10 - optimalSolutionLength) : 3
    const simplifiedScramble = simplifyScramble(scramble, solverName, ["x2"], suboptimality)
    setScramble(simplifiedScramble)
    setSolutions(solutions)
    onNewScramble && onNewScramble()
  }, [generateScramble])

  // generate scram+solution upon load or whenever the settings change
  useEffect(() => {
    getNext()
  }, [solverName, mode, nFlip, nMove])

  return {
    scramble,
    solutions,
    getNext,
  }
}
