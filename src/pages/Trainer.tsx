import { useState } from "react"
import { Button, Card, Container, Heading, HStack, RadioGroup, Radio, VStack } from "@chakra-ui/react"

import { EOCROSS_MASK } from "src/lib/constants"
import ScrambleViewer from "src/components/ScrambleViewer"
import SolutionsViewer from "src/components/View/SolutionsViewer"
import useSpacebar from "src/hooks/useSpacebar"
import SelectNFlip from "src/components/SelectNFlip"

import useScrambleAndSolutions from "src/hooks/useScrambleAndSolutions"
import type { ScrambleMode } from "src/hooks/useScrambleAndSolutions"

import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

const scrambleModeAtom = atomWithStorage<ScrambleMode>("scrambleMode", "random")
const nFlipAtom = atomWithStorage<number>("nFlip", 4)

export default function Trainer() {

  const [hideSolution, setHideSolution] = useState(true)

  const actionButtonText = hideSolution ? "reveal" : "next"

  const mainAction = () => {
    if (hideSolution) {
      setHideSolution(false)
    } else {
      getNext()
    }
  }

  useSpacebar(mainAction)

  const onNewScramble = () => {
    setHideSolution(true)
  }

  const [scrambleMode, setScrambleMode] = useAtom(scrambleModeAtom)
  const [nFlip, setNFlip] = useAtom(nFlipAtom)
  const { scramble, solutions, getNext } = useScrambleAndSolutions(scrambleMode, nFlip, onNewScramble)
  

  const isNFlipMode = scrambleMode === "nFlip"
  return (
    <VStack spacing="1rem">
      <ScrambleViewer scramble={scramble} nFlip = { isNFlipMode ? nFlip : undefined}/>
      <SolutionsViewer
        scramble={scramble}
        solutions={solutions}
        mask={EOCROSS_MASK}
        showEO
        hideSolution={hideSolution}
        onRevealSolution={() => setHideSolution(false)}
      >
        <Button onClick={mainAction} w="100%">{actionButtonText}</Button>
      </SolutionsViewer>
      <Container maxW="container.lg">
        <Card p="1.5rem">
          <VStack align="left">
            <Heading size="md">level</Heading>
            <RadioGroup
              onChange={value => setScrambleMode(value as ScrambleMode)}
              value={scrambleMode}
            >
              <HStack spacing={4}>
                <Radio value="random">random</Radio>
                <Radio value="nFlip"># of bad edges</Radio>
              </HStack>
            </RadioGroup>
            {isNFlipMode && (
              <SelectNFlip nFlip={nFlip} onSelectNFlip={(n) => setNFlip(n)} />
            )}
          </VStack>
        </Card>
      </Container>
    </VStack>
  )
}
