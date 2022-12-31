import { useEffect, useState } from "react"
import type { Move } from "src/lib/types"

interface Config {
  mode: string
}

type ScrambleConfig = NormalScramble | NFlipScramble
interface NormalScramble extends Config {
  mode: "normal"
}
interface NFlipScramble {
  mode: "nflip"
  nflip: number
}

type SolutionConfig = NormalSolution
interface NormalSolution {
  mode: "normal"
}

const testThingy: ScrambleConfig = {
  mode: "normal"
}
const otherThingy: ScrambleConfig = {
  mode: "nflip",
  nflip: 4
}

// TODO
export default function useScrambleAndSolution(scrambleConfig: ScrambleConfig, solutionConfig: SolutionConfig = { mode: "normal" }) {
  const [scramble, setScramble] = useState<Array<Move>>([])
  const [solution, setSolution] = useState<Array<Move> | null>(null)


}
  