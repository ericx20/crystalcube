import { Heading, RadioGroup, HStack, Radio } from "@chakra-ui/react";
import { ScrambleMode } from "src/hooks/useScrambleAndSolutions";
import TrainerCard from "../TrainerCard";
import SelectNFlip from "./SelectNFlip";

interface SelectLevel {
  scrambleMode: ScrambleMode
  setScrambleMode: (mode: ScrambleMode) => void
  nFlip: number
  setNFlip: (n: number) => void
}

export default function SelectLevel({ scrambleMode, setScrambleMode, nFlip, setNFlip }: SelectLevel) {
  const isNFlipMode = scrambleMode === "nFlip"
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
      </HStack>
    </RadioGroup>
    {isNFlipMode && (
      <SelectNFlip nFlip={nFlip} onSelectNFlip={(n) => setNFlip(n)} />
    )}
  </TrainerCard>
  )
}