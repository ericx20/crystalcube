import { useRef, useState } from "react"
import { Button, Heading, HStack, VStack } from "@chakra-ui/react"

import type { ZZConfigName } from "src/lib/types"
import { SOLVER_CONFIGS } from "src/lib/constants"
import ScrambleViewer from "../ScrambleViewer"
import SolutionsViewer from "../SolutionsViewer"
import SelectLevel from "./SelectLevel"
import SelectEOStepDropdown from "./SelectEOStepDropdown"

import useKey from "src/hooks/useKey"
import useScrambleAndSolutions from "src/hooks/useScrambleAndSolutions"
import type { ScrambleMode } from "src/hooks/useScrambleAndSolutions"

import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"


const scrambleModeAtom = atomWithStorage<ScrambleMode>("zz-scramble-mode", "random")
const nFlipAtom = atomWithStorage<number>("zz-nflip", 4)
const eoStepAtom = atomWithStorage<ZZConfigName>("zz-eostep", "EOCross")
const nMoveAtom = atomWithStorage<number>("zz-nmove", 3)

// TODO: generalize this for CFOP too, and make the method a prop
export default function ZZTrainer() {
  const headerRef = useRef<HTMLDivElement>(null)
  const scrollToTop = () => {
    window.scrollTo({
      top: headerRef.current?.offsetTop ?? 0,
      behavior: "smooth",
    });
  }

  const [isSolutionHidden, setSolutionHidden] = useState(true)
  const hideSolution = () => setSolutionHidden(true)
  const showSolution = () => setSolutionHidden(false)

  const actionButtonText = isSolutionHidden ? "reveal" : "next"
  const mainAction = () => {
    if (isSolutionHidden) {
      showSolution()
    } else {
      scrollToTop()
      getNext()
    }
  }
  useKey(" ", mainAction)
  useKey("Backspace", hideSolution)

  const onNewScramble = () => {
    setSolutionHidden(true)
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
    setEOStep(newEOStep)
  }

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

      <ScrambleViewer scramble={scramble} />

      <SolutionsViewer
        scramble={scramble}
        solutions={solutions}
        mask={mask}
        showEO
        hideSolution={isSolutionHidden}
        onRevealSolution={showSolution}
      >
        <HStack>
          <Button onClick={mainAction} w="100%">
            {actionButtonText}
          </Button>
          {!isSolutionHidden && (
            <Button onClick={hideSolution} w="4rem">
              hide
            </Button>
          )}
        </HStack>
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
