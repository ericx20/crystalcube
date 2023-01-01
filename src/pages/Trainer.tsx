import { useCallback, useEffect, useState } from "react"
import { VStack, Input, FormControl, FormErrorMessage, Button } from "@chakra-ui/react"

import { EOCROSS_MASK } from "src/lib/constants"
import ScrambleViewer from "src/components/ScrambleViewer"
import SolutionsViewer from "src/components/View/SolutionsViewer"
import useSpacebar from "src/hooks/useSpacebar"
import { randomScrambleForEvent } from "cubing/scramble"
import SelectNFlip from "src/components/SelectNFlip"
import type { Move, MoveSeq } from "src/lib/types"

import useScrambleAndSolutions from "src/hooks/useScrambleAndSolutions"

import type { ScrambleMode } from "src/hooks/useScrambleAndSolutions"

export default function Trainer() {
  const [mode, setScrambleMode] = useState<ScrambleMode>("random")
  const [nFlip, setNFlip] = useState(4)
  const { scramble, solutions, getNext } = useScrambleAndSolutions(mode, nFlip)

  useSpacebar(getNext)

  return (
    <VStack spacing="1rem">
      <ScrambleViewer scramble={scramble} />
      {/* TODO: edit solutions viewer to accept an array of solutions */}
      <SolutionsViewer scramble={scramble} solutions={solutions} mask={EOCROSS_MASK} showEO>
        <Button onClick={getNext} w="100%">next</Button>
      </SolutionsViewer>
      {/* TODO */}
      {/* <SelectNFlip nFlip={nFlip} onSelectNFlip={(n) => setNFlip(n)} /> */}
    </VStack>
  )
}
