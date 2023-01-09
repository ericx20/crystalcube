import { Heading, RadioGroup, HStack, Radio } from "@chakra-ui/react";
import TrainerCard from "../TrainerCard";
import type { ZZConfigName } from "src/lib/types"


interface SelectEOStepProps {
  eoStep: ZZConfigName
  setEOStep: (step: ZZConfigName) => void
}

export default function SelectEOStep({ eoStep, setEOStep }: SelectEOStepProps) {
  return (
    <TrainerCard>
    <Heading size="md">EO step</Heading>
    <RadioGroup
      onChange={value => setEOStep(value as ZZConfigName)}
      value={eoStep}
    >
      <HStack spacing={4}>
        <Radio value="EO">EO</Radio>
        <Radio value="EOLine">EOLine</Radio>
        <Radio value="EOCross">EOCross</Radio>
      </HStack>
    </RadioGroup>
  </TrainerCard>
  )
}
