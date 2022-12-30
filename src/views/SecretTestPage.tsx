import { invertMove, invertMoves, parseNotation, solve } from "src/lib/cubeLib"
import { CubeRotation, Move } from "src/lib/types"

// const test: Array<Move> = ["R", "U", "R'", "U", "R", "U2", "R'"]
// console.log('original:', test)
// console.log('invert:', invertMoves(test))

const scram = parseNotation("B F U F D R' F D L B2 U' B2 D B' R' F2 L2 R2 U'")
const allAngles: Array<Array<CubeRotation>> = [
  [],
  ["y"],
  ["x"],
  ["x", "y"],
  ["x'"],
  ["x'", "y"],
  ["x2"],
  ["x2", "y"],
  ["z"],
  ["z", "y"],
  ["z'"],
  ["z'", "y"]
]

allAngles.forEach(angle => {
  console.log(angle)
  console.log(solve(scram, "EOCross", angle)?.join(" "));
})

export default function SecretTestPage() {
  return (
    <h1>hello world!</h1>
  )
}
