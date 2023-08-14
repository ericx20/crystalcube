import {
  Button,
  Heading,
  HStack,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import { randomScrambleForEvent } from "cubing/scramble";
import { solveCube3x3 } from "src/libv2/puzzles/cube3x3/solvers";
import { Move3x3 } from "src/libv2/puzzles/cube3x3/types";
import { useState } from "react";

import useScrambleAndSolutions from "src/hooks/useScrambleAndSolutions";
import ScrambleEditor from "./ScrambleEditor";
import { Cube3x3 } from "src/libv2";

type EOStep =
  | "EO"
  | "EOLine"
  | "EOCross"
  | "EOArrowBack"
  | "EOArrowLeft"
  | "EO222";

interface Options {
  eoStep: EOStep;
}

async function scrambler(_options: Options) {
  // TODO: shorten the scramble based on the option
  const scram = (await randomScrambleForEvent("333"))
    .toString()
    .split(" ") as Move3x3[];
  return scram;
  // const solutions = await solveCube3x3(scram, "EOCross", ["x2"], 5);
  // solutions.forEach(({ solution }) => console.log(solution.join(" ")))
}

async function solver(scramble: Move3x3[], options: Options) {
  const solutions = await solveCube3x3(scramble, options.eoStep, [], 5);
  return solutions;
}

export default function EOStepTrainer() {
  const [options, setOptions] = useState<Options>({
    eoStep: "EOCross",
  });

  const { scramble, setScramble, solutions, isLoading, getNext } =
    useScrambleAndSolutions(scrambler, solver, options);

  return (
    <VStack spacing={4} my={4}>
      <HStack spacing={4}>
        <Heading fontSize="xl">EO Trainer</Heading>
        <EOStepSelect
          eoStep={options.eoStep}
          setEOStep={(eoStep) => setOptions({ ...options, eoStep })}
        />
      </HStack>
      <ScrambleEditor
        scramble={scramble}
        setScramble={setScramble}
        notationParser={Cube3x3.parseNotation}
      />
      <Text>Solutions: </Text>
      {solutions.map((solution) => {
        return <Text key={solution.join()}>{solution.join(" ")}</Text>;
      })}
      <Button onClick={getNext} isLoading={isLoading}>
        get next
      </Button>
    </VStack>
  );
}

interface EOStepSelectProps {
  eoStep: EOStep;
  setEOStep: (step: EOStep) => void;
}

function EOStepSelect({ eoStep, setEOStep }: EOStepSelectProps) {
  return (
    <Select
      value={eoStep}
      onChange={(e) => setEOStep(e.target.value as EOStep)}
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
  );
}
