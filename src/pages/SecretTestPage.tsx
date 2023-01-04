import { useState } from "react"
import { parseNotation, solve, movesAreParallel, moveSeqToString } from "src/lib"
import { invertMove, invertMoves } from "src/lib/moves"
import { CubeRotation, Move, MoveSeq } from "src/lib/types"
import useScrambleAndSolutions from "src/hooks/useScrambleAndSolutions"
import type { ScrambleMode } from "src/hooks/useScrambleAndSolutions"
import { Button } from "@chakra-ui/react"
import SelectNFlip from "src/components/SelectNFlip"

// const scrambles =
// `F D2 B2 F U2 F L2 R2 U2 L2 R' B' U2 L R D2 L D' U R' 
// L D' R2 F2 U2 F2 U2 F2 R2 U2 L U2 D' L D U F' U' L2 
// D' R2 U' L2 B2 U2 R2 B2 D' L2 B2 F' L2 F2 L' U R B U R' 
// L D' F2 B' R2 F' L2 D' F L2 F2 D2 F2 D2 R B2 R' L2 F2 R' 
// U' B2 F2 R2 D2 L F2 L2 D2 U2 L D2 L' U F' D' B D2 L' D U2 
// U D B D' L' B' R2 F U' B2 R2 D B2 U' R2 D' L2 U2 L2 R' B' 
// F' L2 U2 F2 L2 U2 R2 U2 F' L U2 B2 L' D' R2 B' L' U 
// B' D' B' U' F L2 B' R D F2 B U2 L2 B R2 D2 R2 U2 F U2 
// U B2 D' L2 F D B' R L2 D2 R' F2 B2 L D2 B2 R' L D L2 
// L' B R' F R U' R U2 L' B2 U' R2 U L2 F2 L2 U D2 B2 
// `.split("\n").filter(m => m).map(thing => parseNotation(thing))

// console.time('eocross')
// scrambles.forEach((scramble) => {
//   solve(scramble, "EOCross", [], 1)
// })
// console.timeEnd('eocross')

// const allAngles: Array<Array<CubeRotation>> = [
//   [],
//   ["y"],
//   ["x"],
//   ["x", "y"],
//   ["x'"],
//   ["x'", "y"],
//   ["x2"],
//   ["x2", "y"],
//   ["z"],
//   ["z", "y"],
//   ["z'"],
//   ["z'", "y"]
// ]

// allAngles.forEach(angle => {
//   console.log(angle)
//   console.log(solve(scram, "EOCross", angle)?.join(" "));
// })

export default function SecretTestPage() {
  const [mode, setScrambleMode] = useState<ScrambleMode>("random")
  const [nFlip, setNFlip] = useState(4)
  const { scramble, solutions, getNext } = useScrambleAndSolutions("EOCross", mode, nFlip)
  const scrambleString = moveSeqToString(scramble)

  const toggleMode = () => {
    setScrambleMode(mode === "random" ? "nFlip" : "random")
  }
  return (
    <>
      <p>{APP_VERSION}</p>
      <p>{scrambleString}</p>
      <p>Solutions:</p>
      {solutions.map((solution) => {
        const solutionString = moveSeqToString(solution)
        return (
          <p key={solutionString}>{solutionString}</p>
        )
      })}
      <Button onClick={getNext}>Click me!</Button>
      <Button onClick={toggleMode}>Switch mode, currently {mode}</Button>
      <SelectNFlip nFlip={nFlip} onSelectNFlip={(n) => setNFlip(n)} />
    </>
  )
}
