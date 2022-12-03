import * as React from "react"
import { SlideFade, VStack, Input, FormControl, FormErrorMessage } from "@chakra-ui/react"
import type { Move } from "src/lib/cubeDefs"
import { EOCROSS_MASK } from "src/lib/cube"
import ScrambleViewer from "src/components/ScrambleViewer"
import SolutionViewer from "src/components/SolutionViewer"
import { isValidHTM } from "src/utils/solver"

// A LOT OF STUFF HERE IS TEMPORARY

// const sune: Array<Move> = ["R", "U", "R'", "U", "R", "U2", "R'"]
const defaultScram = "R' U' D' R' F' R2 D R2 D B' F2 D2 B2 D R' U' L U' D' B2 L' B' D L2 B".split(" ") as Array<Move>
const solution = "R2 F' B R U' B' D' B' R2".split(" ") as Array<Move>

const parseAlg = (algString: string): Array<Move> => {
  return isValidHTM(algString) ? algString.split(" ").filter(m => m) as Array<Move> : []
}

// n-flip and n-move difficulty have to be mutually exclusive
// it would be very hard to generate n-flip with a specified difficulty
// also n-flip only allows for z/z2 colour neutrality at most
export default function Trainer() {
  const [inputScram, setInputScram] = React.useState("R' U' D' R' F' R2 D R2 D B' F2 D2 B2 D R' U' L U' D' B2 L' B' D L2 B")
  const scram = parseAlg(inputScram)
  const isValid = isValidHTM(inputScram)
  return (
    <SlideFade in>
      <VStack spacing="1rem">
        <FormControl isInvalid={!isValid}>
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
        </FormControl>
        <ScrambleViewer scramble={scram} />
        <SolutionViewer scramble={scram} solution={[]} mask={EOCROSS_MASK} showEO />
      </VStack>
    </SlideFade>
  )
}