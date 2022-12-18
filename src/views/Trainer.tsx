import * as React from "react"
import { VStack, /* Input, FormControl, FormErrorMessage, */ Button } from "@chakra-ui/react"
import type { Move, SolverResult } from "src/lib/types"
import { EOCROSS_MASK } from "src/lib/constants"
import ScrambleViewer from "src/components/ScrambleViewer"
import SolutionViewer from "src/components/SolutionViewer"
import { isValidNotation, solve } from "src/lib/cubeLib"
import { randomScrambleForEvent } from "cubing/scramble"

const parseAlg = (algString: string): Array<Move> => {
  return isValidNotation(algString) ? algString.split(" ").filter(m => m) as Array<Move> : []
}

function useSpacebar(callback: () => any) {
  const keyDownHandler = React.useCallback((event: KeyboardEvent) => {
    if (event.key === " ") {
      event.preventDefault()
      callback()
    }
  }, [callback])

  React.useEffect(() => {
    window.addEventListener("keyup", keyDownHandler)
    return () => {
      window.removeEventListener("keyup", keyDownHandler)
    }
  }, [callback, keyDownHandler])
}

// n-flip and n-move difficulty have to be mutually exclusive
// it would be very hard to generate n-flip with a specified difficulty
// also n-flip only allows for z/z2 colour neutrality at most
export default function Trainer() {
  const [scram, setScram] = React.useState<Array<Move>>([])
  const [sol, setSol] = React.useState<Array<Move> | null>(null)
  const getScramble = React.useCallback(async () => {
    const rawScramble = await randomScrambleForEvent("333");
    const scramble = parseAlg(rawScramble.toString())
    const solution = solve(scramble, "EOCross")
    setScram(scramble)
    setSol(solution)
  }, [])

  useSpacebar(getScramble)

  // this fires twice when Trainer is loaded, don't worry
  // React Strict mode makes components render twice
  // but that only applies to dev server, prod is ok
  React.useEffect(() => {
    getScramble()
  }, [getScramble])

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
    </VStack>
  )
}