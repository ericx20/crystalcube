import { useState } from "react"
import { Button, VStack } from "@chakra-ui/react"

import { SOLVER_CONFIGS } from "src/lib/constants"
import ScrambleViewer from "../ScrambleViewer"
import SolutionsViewer from "../SolutionsViewer"
import useSpacebar from "src/hooks/useSpacebar"

import useScrambleAndSolutions from "src/hooks/useScrambleAndSolutions"
import type { ScrambleMode } from "src/hooks/useScrambleAndSolutions"

import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import type { ZZConfigName } from "src/lib/types"
import SelectLevel from "./SelectLevel"
import SelectEOStep from "./SelectEOStep"


const scrambleModeAtom = atomWithStorage<ScrambleMode>("scrambleMode", "random")
const nFlipAtom = atomWithStorage<number>("nFlip", 4)
const eoStepAtom = atomWithStorage<ZZConfigName>("eoStep", "EOCross")

export default function ZZTrainer() {
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
  const isNFlipMode = scrambleMode === "nFlip"

  const { scramble, solutions, getNext } = useScrambleAndSolutions(eoStep, scrambleMode, nFlip, onNewScramble)

  const mask = SOLVER_CONFIGS[eoStep].mask

  return (
    <VStack spacing={4} my={4}>
      <ScrambleViewer
        scramble={scramble}
        nFlip={ isNFlipMode ? nFlip : undefined}
      />

      <SolutionsViewer
        scramble={scramble}
        solutions={solutions}
        mask={mask}
        showEO
        hideSolution={hideSolution}
        onRevealSolution={() => setHideSolution(false)}
      >
        <Button
          onClick={mainAction}
          w="100%"
        >
          {actionButtonText}
        </Button>
      </SolutionsViewer>

      <SelectLevel
        scrambleMode={scrambleMode}
        setScrambleMode={setScrambleMode}
        nFlip={nFlip}
        setNFlip={setNFlip}
      />

      <SelectEOStep
        eoStep={eoStep}
        setEOStep={setEOStep}
      />
    </VStack>
  )
}
