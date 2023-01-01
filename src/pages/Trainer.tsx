import { useCallback, useEffect, useState } from "react"
import { Button, Card, Container, Heading, HStack, RadioGroup, Radio, VStack } from "@chakra-ui/react"

import { EOCROSS_MASK } from "src/lib/constants"
import ScrambleViewer from "src/components/ScrambleViewer"
import SolutionsViewer from "src/components/View/SolutionsViewer"
import useSpacebar from "src/hooks/useSpacebar"
import SelectNFlip from "src/components/SelectNFlip"
import type { Move, MoveSeq } from "src/lib/types"

import useScrambleAndSolutions from "src/hooks/useScrambleAndSolutions"

import type { ScrambleMode } from "src/hooks/useScrambleAndSolutions"

export default function Trainer() {
  const [scrambleMode, setScrambleMode] = useState<ScrambleMode>("random")
  const [nFlip, setNFlip] = useState(4)
  const { scramble, solutions, getNext } = useScrambleAndSolutions(scrambleMode, nFlip)
  useSpacebar(getNext)

  const isNFlipMode = scrambleMode === "nFlip"
  return (
    <VStack spacing="1rem">
      <ScrambleViewer scramble={scramble} nFlip = { isNFlipMode ? nFlip : undefined}/>
      <SolutionsViewer scramble={scramble} solutions={solutions} mask={EOCROSS_MASK} showEO>
        <Button onClick={getNext} w="100%">next</Button>
      </SolutionsViewer>
      {/* TODO */}
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
