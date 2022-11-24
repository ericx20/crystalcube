import { SlideFade, VStack } from "@chakra-ui/react"
import type { Move } from "src/lib/cubeDefs"
import { EOCROSS_MASK } from "src/lib/cube"
import ScrambleViewer from "src/components/ScrambleViewer"
import SolutionViewer from "src/components/SolutionViewer"

// const sune: Array<Move> = ["R", "U", "R'", "U", "R", "U2", "R'"]
const scram = "R' U' D' R' F' R2 D R2 D B' F2 D2 B2 D R' U' L U' D' B2 L' B' D L2 B".split(" ") as Array<Move>
const solution = "R2 F' B R U' B' D' B' R2".split(" ") as Array<Move>


export default function Trainer() {
  return (
    <SlideFade in>
      <VStack spacing="1rem">
        <ScrambleViewer scramble={scram} />
        <SolutionViewer scramble={scram} solution={solution} mask={EOCROSS_MASK} showEO />
      </VStack>
    </SlideFade>
  )
}