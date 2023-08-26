import React, { useState } from "react";

import { Button, Heading, HStack, Select, VStack } from "@chakra-ui/react";
import { solveCube3x3 } from "src/libv2/puzzles/cube3x3/solvers";
import { Move3x3 } from "src/libv2/puzzles/cube3x3/types";

import useScrambleAndSolutions from "src/hooks/useScrambleAndSolutions";
import ScrambleEditor from "../ScrambleEditor";
import { Cube3x3 } from "src/libv2";

import { useOptions, useActions } from "./eoStepOptions";
import type { EOStep, EOStepOptions } from "./eoStepTypes"

import scrambler from "./scrambler";

import SolutionsViewer from "../common/SolutionsViewer";
import { MoveSeq } from "src/lib/types";

async function solver(scramble: Move3x3[], options: EOStepOptions) {
  const solutions = await solveCube3x3(scramble, options.eoStep, [], 5);
  return solutions;
}

export default function EOStepTrainer() {
  const [isSolutionHidden, setSolutionHidden] = useState(true);
  const hideSolution = () => setSolutionHidden(true);
  const showSolution = () => setSolutionHidden(false);

  const options = useOptions();
  const actions = useActions();

  const { scramble, setScramble, solutions, isLoading, getNext } =
    useScrambleAndSolutions(scrambler, solver, options, hideSolution);

  const mainAction = isSolutionHidden ? showSolution : getNext;
  
  // TODO: add scroll to top and hotkeys

  return (
    <VStack spacing={4} my={4}>
      <HStack spacing={4}>
        <Heading fontSize="xl">EO Trainer</Heading>
        <EOStepSelect
          eoStep={options.eoStep}
          setEOStep={actions.changeEOStep}
        />
      </HStack>
      <ScrambleEditor
        scramble={scramble}
        setScramble={setScramble}
        notationParser={Cube3x3.parseNotation}
      />
      {/* TODO: REMOVE X2 hardcode from everything */}
      <SolutionsViewer
        scramble={scramble as MoveSeq} // TODO
        solutions={solutions as MoveSeq[]}
        showEO
        hideSolution={isSolutionHidden}
        onRevealSolution={showSolution}
      >
        <HStack>
          {/* TODO: button for copying */}
          <Button onClick={mainAction} isLoading={isLoading} w="100%">
            {isSolutionHidden ? "reveal" : "next"}
          </Button>
          {!isSolutionHidden && <Button onClick={hideSolution}>hide</Button>}
        </HStack>
      </SolutionsViewer>
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
