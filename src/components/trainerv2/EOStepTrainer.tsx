import { Heading, HStack, Select, VStack } from "@chakra-ui/react";
import { useRef } from "react"

type EOStep =   "EO" | "EOLine" | "EOCross" | "EOArrowBack" | "EOArrowLeft" | "EO222";

export default function EOStepTrainer() {
  const headerRef = useRef<HTMLDivElement>(null)
  const scrollToTop = () => {
    window.scrollTo({
      top: headerRef.current?.offsetTop ?? 0,
      behavior: "smooth",
    });
  }

  return (
    <VStack spacing={4} my={4}>
      <HStack spacing={4} ref={headerRef}>
        <Heading fontSize="xl">EO Trainer</Heading>
        <EOStepSelect
          eoStep={'EOCross'}
          setEOStep={() => {}}
        />
      </HStack>
    </VStack>
  )
}

interface EOStepSelectProps {
  eoStep: EOStep
  setEOStep: (step: EOStep) => void
}

function EOStepSelect({ eoStep, setEOStep }: EOStepSelectProps) {
  return (
    <Select
      value={eoStep}
      onChange={e => setEOStep(e.target.value as EOStep)}
      variant="filled"
      width="10rem"
    >
      <option value="EO">EO</option>
      <option value="EOLine">EOLine</option>
      <option value="EOCross">EOCross</option>
      <option value="EOArrowBack">EOArrow (Back)</option>
      <option value="EOArrowLeft">EOArrow (Left)</option>
      <option value="EO222">EO222</option>
    </Select>
  )
}