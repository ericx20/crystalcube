import { useCallback, useEffect, useState } from "react"
import { VStack, Input, FormControl, FormErrorMessage, Button } from "@chakra-ui/react"

import { EOCROSS_MASK } from "src/lib/constants"
import ScrambleViewer from "src/components/ScrambleViewer"
import SolutionViewer from "src/components/SolutionViewer"
import useSpacebar from "src/hooks/useSpacebar"
import { parseNotation, solve } from "src/lib/cubeLib"
import { randomScrambleForEvent } from "cubing/scramble"
import SelectNFlip from "src/components/SelectNFlip"
import type { Move } from "src/lib/types"

import useScrambleAndSolution from "src/hooks/useScrambleAndSolution"


export default function Trainer() {
  // TODO
  // const { scramble, solution, /* solutionString, isLoading, */ getNext /*, editScramble */ } = useScrambleAndSolution(scrambleConfig, solutionConfig)
  const [scram, setScram] = useState<Array<Move>>([])
  const [sol, setSol] = useState<Array<Move> | null>(null)
  const getScramble = useCallback(async () => {
    const rawScramble = await randomScrambleForEvent("333")
    const scramble = parseNotation(rawScramble.toString())
    const solution = solve(scramble, "EOCross")
    setScram(scramble)
    setSol(solution)
  }, [])

  useSpacebar(getScramble)

  // get scramble when Trainer first loads
  useEffect(() => {
    getScramble()
  }, [getScramble])

  // null means no restriction on number of bad edges
  const [nFlip, setNFlip] = useState<number | null>(null)

  return (
    <VStack spacing="1rem">
      {/* <FormControl isInvalid={!isValid}>
        <Input
          value={inputScram}
          _placeholder={{ opacity: 1, color: "gray.500" }}
          onChange={(e) => setInputScram(e.target.value)}
        />
        {!isValid && (
          <FormErrorMessage>
            Invalid scramble
          </FormErrorMessage>
        )}
      </FormControl> */}
      <ScrambleViewer scramble={scram} />
      <SolutionViewer scramble={scram} solution={sol} mask={EOCROSS_MASK} showEO>
        <Button onClick={getScramble}>next</Button>
      </SolutionViewer>
      {/* TODO */}
      {/* <SelectNFlip nFlip={nFlip} onSelectNFlip={(n) => setNFlip(n)} /> */}
    </VStack>
  )
}
