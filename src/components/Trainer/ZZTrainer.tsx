import { useEffect, useRef, useState } from "react"
import { Button, Heading, HStack, VStack, useClipboard, Tooltip } from "@chakra-ui/react"

import type { MoveSeq, RotationMove, SolverConfigName, ZZConfigName } from "src/lib/types"
import { METHOD_SOLVERS, SOLVER_CONFIGS } from "src/lib/constants"
import ScrambleEditor from "./ScrambleEditor"
import SolutionEditor from "./VirtualCube"
import SolutionsViewer from "./SolutionsViewer"
import SelectLevel from "./select/SelectLevel"
import SelectEOStepDropdown from "./select/SelectEOStepDropdown"

import { useHotkeys } from "react-hotkeys-hook"
import useScrambleAndSolutions from "src/hooks/useScrambleAndSolutions"
import type { ScrambleMode } from "src/hooks/useScrambleAndSolutions"

import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { getEOSolutionAnnotation, moveSeqToString } from "src/lib"
import VirtualCube from "./VirtualCube"


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

  useHotkeys(" ", mainAction, [isSolutionHidden], { preventDefault: true })
  useHotkeys("Backspace", hideSolution)

  const onNewScramble = hideSolution

  const [scrambleMode, setScrambleMode] = useAtom(scrambleModeAtom)
  const [nFlip, setNFlip] = useAtom(nFlipAtom)
  const [eoStep, setEOStep] = useAtom(eoStepAtom)
  const [nMove, setNMove] = useAtom(nMoveAtom)

  // TODO: rewrite state stuff so this isn't needed
  if (METHOD_SOLVERS.ZZ.find((step)=>{return step === eoStep}) === undefined) {
    setEOStep("EOCross")
  }

  const handleEOStepChange = (newEOStep: ZZConfigName) => {
    const { min, max } = SOLVER_CONFIGS[newEOStep].nMoveScrambleConfig
    if (nMove < min) {
      setNMove(min)
    } else if (nMove > max) {
      setNMove(max)
    }
    setEOStep(newEOStep)
  }

  const [solution, setSolution] =  useState<MoveSeq>([]);

  const {
    scramble,
    setScramble,
    solutions,
    isLoading,
    getNext
  } = useScrambleAndSolutions(eoStep, scrambleMode, nFlip, nMove, onNewScramble)

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

      <ScrambleEditor scramble={scramble} setScramble={setScramble} />
      <VirtualCube scramble={scramble} solution={solution} setSolution={setSolution} mask={mask} showEO />

      <SolutionsViewer
        scramble={scramble}
        solutions={solutions}
        mask={mask}
        showEO
        hideSolution={isSolutionHidden}
        onRevealSolution={showSolution}
      >
        <HStack>
          {!isSolutionHidden && (
            <CopyButton solverName={eoStep} scramble={scramble} preRotation={["x2"]} solutions={solutions} />
          )}
          <Button onClick={mainAction} isLoading={isLoading} w="100%">
            {actionButtonText}
          </Button>
          {!isSolutionHidden && (
            <Button onClick={hideSolution}>
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

interface CopyTextProps {
  solverName: SolverConfigName
  scramble: MoveSeq
  preRotation: Array<RotationMove>
  solutions: Array<MoveSeq>
}

function CopyButton(copyTextProps: CopyTextProps) {
  const copyText = generateCopyText(copyTextProps)
  const { onCopy, hasCopied, setValue } = useClipboard(copyText)
  useEffect(() => {
    setValue(copyText)
  }, [copyText])
  return (
    <Tooltip label="copied!" isOpen={hasCopied} hasArrow>
      <Button onClick={onCopy}>copy</Button>
    </Tooltip>
  )
}

function generateCopyText({ solverName, scramble, preRotation, solutions }: CopyTextProps): string {
  const isEOStep = !!SOLVER_CONFIGS[solverName].isEOStep

  const scrambleText = `scramble: ${moveSeqToString(scramble)}`

  const solutionText = [
    `${solverName} solutions:`,
    ...solutions.map((solution, index) => {
      const prefixText = `${index + 1}.`
      const movecountText = `(${solution.length} HTM)` // TODO: compute HTM instead of checking length
      const solutionText = moveSeqToString([...preRotation, ...solution])
      const eoProgressionText = isEOStep
         ? "[" + getEOSolutionAnnotation(scramble, solution).filter(a => a !== null).join(" ") + "]"
         : ""
      return [prefixText, movecountText, solutionText, eoProgressionText].join(" ").trimEnd()
    })
  ].join("\n")

  const linkText = "generated by https://crystalcube.app"

  return [scrambleText, solutionText, linkText].join("\n\n")
}