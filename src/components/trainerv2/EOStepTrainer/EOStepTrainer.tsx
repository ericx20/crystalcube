import React, { useState } from "react";

import { Button, Heading, HStack, Select, VStack } from "@chakra-ui/react";
import { solveCube3x3 } from "src/libv2/puzzles/cube3x3/solvers";
import { cubeOrientationToRotations, Move3x3 } from "src/libv2/puzzles/cube3x3";

import useScrambleAndSolutions from "src/hooks/useScrambleAndSolutions";
import ScrambleEditor from "../common/ScrambleEditor";
import { Cube3x3 } from "src/libv2/puzzles/cube3x3";

import { useOptions, useActions, EOStepOptions } from "./eoStepOptions";
import type { EOStep } from "./eoStepTypes";

import scrambler from "./scrambler";

import SolutionsViewer from "../common/SolutionsViewer";
import { MoveSeq } from "src/lib/types";
import EOStepLevelSelect from "./cards/EOStepLevelSelect";
import PreferenceSelect from "./cards/PreferenceSelect";

async function solver(scramble: Move3x3[], options: EOStepOptions) {
  const solutions = await solveCube3x3(
    scramble,
    options.eoStep,
    cubeOrientationToRotations(options.solutionOrientation),
    5
  );
  return solutions;
}

export default function EOStepTrainer() {
  const [areSolutionsHidden, setSolutionsHidden] = useState(true);
  const hideSolutions = () => setSolutionsHidden(true);
  const showSolutions = () => setSolutionsHidden(false);

  // if any of the options change, this component will re-render
  // that's what we want for now, but if not then make selectors for the parts of the state we care about
  const options = useOptions();
  const actions = useActions();

  const { scramble, setScramble, solutions, isLoading, getNext } =
    useScrambleAndSolutions(scrambler, solver, options, hideSolutions);

  const mainAction = areSolutionsHidden ? showSolutions : getNext;

  // TODO: add scroll to top and hotkeys

  return (
    <VStack spacing={4} my={4}>
      <HStack spacing={4}>
        <Heading fontSize="xl">EO Trainer</Heading>
        <EOStepSelect eoStep={options.eoStep} setEOStep={actions.setEOStep} />
      </HStack>
      <ScrambleEditor
        scramble={scramble}
        setScramble={setScramble}
        notationParser={Cube3x3.parseNotation}
      />
      {/* TODO: make new verison of getEOSolutionAnnotation that supports different cube orientations */}
      <SolutionsViewer
        scramble={scramble as MoveSeq} // TODO
        solutions={solutions as MoveSeq[]}
        showEO
        areSolutionsHidden={areSolutionsHidden}
        onRevealSolutions={showSolutions}
      >
        <HStack>
          {/* TODO: button for copying */}
          <Button onClick={mainAction} isLoading={isLoading} w="100%">
            {areSolutionsHidden ? "reveal" : "next"}
          </Button>
          {!areSolutionsHidden && !isLoading && (
            <Button onClick={hideSolutions}>hide</Button>
          )}
        </HStack>
      </SolutionsViewer>
      <EOStepLevelSelect
        levelMode={options.levelMode}
        setLevelMode={actions.setLevelMode}
        numOfBadEdges={options.numOfBadEdges}
        setNumOfBadEdges={actions.setLevelNumOfBadEdges}
        numOfMoves={options.numOfMoves}
        setNumOfMoves={actions.setLevelNumOfMoves}
        numOfMovesConfig={actions.getNumOfMovesConfig()}
      />
      <PreferenceSelect
        orientation={options.solutionOrientation}
        setOrientation={actions.setSolutionOrientation}
      />
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
      <option value="EOArrowBack">EOArrow (B)</option>
      <option value="EOArrowLeft">EOArrow (L)</option>
      <option value="EO222">EO222</option>
    </Select>
  );
}
