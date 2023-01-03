import { useState } from "react"
import { Button, Card, Container, Heading, HStack, RadioGroup, Radio, VStack } from "@chakra-ui/react"

import { EOCROSS_MASK, EOLINE_MASK, METHOD_SOLVERS } from "src/lib/constants"
import ScrambleViewer from "src/components/ScrambleViewer"
import SolutionsViewer from "src/components/View/SolutionsViewer"
import useSpacebar from "src/hooks/useSpacebar"
import SelectNFlip from "src/components/SelectNFlip"

import useScrambleAndSolutions from "src/hooks/useScrambleAndSolutions"
import type { ScrambleMode } from "src/hooks/useScrambleAndSolutions"

import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { Mask } from "src/lib/types"

const scrambleModeAtom = atomWithStorage<ScrambleMode>("scrambleMode", "random")
const nFlipAtom = atomWithStorage<number>("nFlip", 4)
type ZZConfigName = typeof METHOD_SOLVERS.ZZ[number]
const eoStepAtom = atomWithStorage<ZZConfigName>("eoStep", "EOCross")

// TODO: move this to constants.ts
const eoStepMasks: { [eoStep in ZZConfigName]: Mask } = {
  EOCross: EOCROSS_MASK,
  EOLine: EOLINE_MASK,
}

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
  const [eoStep, setEOStep] = useAtom(eoStepAtom)
  const { scramble, solutions, getNext } = useScrambleAndSolutions(eoStep, scrambleMode, nFlip, onNewScramble)
  

  const isNFlipMode = scrambleMode === "nFlip"
  return (
    <VStack spacing="1rem">
      <ScrambleViewer scramble={scramble} nFlip = { isNFlipMode ? nFlip : undefined}/>
      <SolutionsViewer
        scramble={scramble}
        solutions={solutions}
        mask={eoStepMasks[eoStep]}
        showEO
        hideSolution={hideSolution}
        onRevealSolution={() => setHideSolution(false)}
      >
        <Button onClick={mainAction} w="100%">{actionButtonText}</Button>
      </SolutionsViewer>
      {/* TODO: abstract these cards into reusable component */}
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
      <Container maxW="container.lg">
        <Card p="1.5rem">
          <VStack align="left">
            <Heading size="md">EO step</Heading>
            <RadioGroup
              onChange={value => setEOStep(value as ZZConfigName)}
              value={eoStep}
            >
              <HStack spacing={4}>
                {/* TODO: make this dynamic based on all defined zz eosteps */}
                <Radio value="EOLine">EOLine</Radio>
                <Radio value="EOCross">EOCross</Radio>
              </HStack>
            </RadioGroup>
          </VStack>
        </Card>
      </Container>
    </VStack>
  )
}
