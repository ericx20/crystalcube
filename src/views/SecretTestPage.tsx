import { invertMove, invertMoves } from "src/lib/cubeLib"
import { Move } from "src/lib/types"

const test: Array<Move> = ["R", "U", "R'", "U", "R", "U2", "R'"]
console.log('original:', test)
console.log('invert:', invertMoves(test))

export default function SecretTestPage() {
  return (
    <h1>hello world!</h1>
  )
}
