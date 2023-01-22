import { Heading, RadioGroup, HStack, Radio } from "@chakra-ui/react";
import { ScrambleMode } from "src/hooks/useScrambleAndSolutions";
import { SOLVER_CONFIGS } from "src/lib";
import type { SolverConfigName } from "src/lib/types";
import TrainerCard from "../TrainerCard";
import SelectNFlip from "./SelectNFlip";
import SelectNMove from "./SelectNMove"

interface SelectLevelProps {
  solverName: SolverConfigName
  scrambleMode: ScrambleMode
  setScrambleMode: (mode: ScrambleMode) => void
  nFlip: number
  setNFlip: (n: number) => void
  nMove: number
  setNMove: (n: number) => void
}

export default function SelectLevel({ solverName, scrambleMode, setScrambleMode, nFlip, setNFlip, nMove, setNMove }: SelectLevelProps) {
  const isNFlipMode = scrambleMode === "nFlip"
  const isNMoveMode = scrambleMode === "nMove"
  const nMoveScrambleConfig = SOLVER_CONFIGS[solverName].nMoveScrambleConfig
  return (
    <TrainerCard>
    <Heading size="md">level</Heading>
    <RadioGroup
      onChange={value => setScrambleMode(value as ScrambleMode)}
      value={scrambleMode}
    >
      <HStack spacing={4}>
        <Radio value="random">random</Radio>
        <Radio value="nFlip"># of bad edges</Radio>
        <Radio value="nMove"># of moves</Radio>
      </HStack>
    </RadioGroup>
    {isNFlipMode && (
      <SelectNFlip nFlip={nFlip} onSelectNFlip={setNFlip} />
    )}
    {isNMoveMode && (
      <SelectNMove
        nMoveScrambleConfig={nMoveScrambleConfig}
        nMove={nMove}
        onSelectNMove={setNMove}
      />
    )}
  </TrainerCard>
  )
}