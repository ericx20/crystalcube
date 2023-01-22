import { useState } from "react"
import { nMoveScrambleForSolver, SOLVER_CONFIGS } from "src/lib"
import SelectNMove from "src/components/Trainer/ZZ/SelectNMove";
import { Button } from "@chakra-ui/react";

/*
moves
EOCross: 2 to 9, max 200 attempts
EOLine: 2 to 8, max 1000 attempts
EO: 2 to 7, max 2000 attempts
cross: 2 to 7, max 500 attempts
// aim for similar failure rate, or similar number of iterations
*/

export default function SecretTestPage() {
  const [difficulty, setDifficulty] = useState(0);
  const func = async () => console.log((await nMoveScrambleForSolver(difficulty, "Cross"))?.join(" "))

  return (
    <>
      <SelectNMove nMove={difficulty} onSelectNMove={setDifficulty} nMoveScrambleConfig={SOLVER_CONFIGS.Cross.nMoveScrambleConfig} />
      <Button onClick={func}>Click me</Button>
    </>
  )
}
