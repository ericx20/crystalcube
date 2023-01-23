import { useRef, useState } from "react"
import { Button, Heading, HStack, VStack } from "@chakra-ui/react"

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
import SelectEOStepDropdown from "./SelectEOStepDropdown"


const scrambleModeAtom = atomWithStorage<ScrambleMode>("zz-scramble-mode", "random")
const nFlipAtom = atomWithStorage<number>("zz-nflip", 4)
const eoStepAtom = atomWithStorage<ZZConfigName>("zz-eostep", "EOCross")
const nMoveAtom = atomWithStorage<number>("zz-nmove", 3)

// TODO: generalize this for CFOP too, and make the method a prop
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

  const headerRef = useRef<HTMLDivElement>(null)

  const scrollToTop = () => {
    window.scrollTo({
      top: headerRef.current?.offsetTop ?? 0,
      behavior: "smooth",
    });
  }

  const onNewScramble = () => {
    setHideSolution(true)
    scrollToTop()
  }

  const [scrambleMode, setScrambleMode] = useAtom(scrambleModeAtom)
  const [nFlip, setNFlip] = useAtom(nFlipAtom)
  const [eoStep, setEOStep] = useAtom(eoStepAtom)
  const [nMove, setNMove] = useAtom(nMoveAtom)

  const handleEOStepChange = (newEOStep: ZZConfigName) => {
    const { min, max } = SOLVER_CONFIGS[newEOStep].nMoveScrambleConfig
    if (nMove < min) {
      setNMove(min)
    } else if (nMove > max) {
      setNMove(max)
    }
    console.log('hello')
    setEOStep(newEOStep)
  }

  const isNFlipMode = scrambleMode === "nFlip"

  const { scramble, solutions, getNext } = useScrambleAndSolutions(eoStep, scrambleMode, nFlip, nMove, onNewScramble)

  const mask = SOLVER_CONFIGS[eoStep].mask

  return (
    <VStack spacing={4} my={4}>
      <HStack spacing={4} ref={headerRef}>
        <Heading fontSize="2xl">ZZ Trainer</Heading>
        <SelectEOStepDropdown
          eoStep={eoStep}
          setEOStep={handleEOStepChange}
        />
      </HStack>

      <ScrambleViewer
        scramble={scramble}
        nFlip={isNFlipMode ? nFlip : undefined}
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
        solverName={eoStep}
        scrambleMode={scrambleMode}
        setScrambleMode={setScrambleMode}
        nFlip={nFlip}
        setNFlip={setNFlip}
        nMove={nMove}
        setNMove={setNMove}
      />
    </VStack>
  )
}
