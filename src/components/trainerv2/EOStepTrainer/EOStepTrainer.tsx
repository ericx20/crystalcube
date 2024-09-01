import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Tooltip,
  useClipboard,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import {
  cubeOrientationToRotations,
  isFaceMove,
  MASKS,
  Move3x3,
  PuzzleConfigName,
  RotationMove,
} from "src/libv2/puzzles/cube3x3";

import useScrambleAndSolutions from "../common/useScrambleAndSolutions";
import ScrambleEditor from "../common/ScrambleEditor";
import { Cube3x3 } from "src/libv2/puzzles/cube3x3";

import { useOptions, useActions } from "./eoStepOptions";
import type { EOStep } from "./eoStepTypes";

import scrambler from "./scrambler";
import solver from "./solver";

import SolutionsViewer from "../common/SolutionsViewer";
import EOStepLevelSelect from "./cards/EOStepLevelSelect";
import PreferenceSelect from "./cards/PreferenceSelect";
import { getEOSolutionAnnotation } from "./utils";

export default function EOStepTrainer() {
  const [areSolutionsHidden, setSolutionsHidden] = useState(true);
  const hideSolutions = () => setSolutionsHidden(true);
  const showSolutions = () => setSolutionsHidden(false);

  // if any of the options change, this component will re-render
  // that's what we want for now, but if not then make selectors for the parts of the state we care about
  const options = useOptions();
  const actions = useActions();

  const {
    scramble,
    setScramble,
    solutions,
    isScrambleLoading,
    isLoading,
    getNext,
  } = useScrambleAndSolutions(scrambler, solver, options, hideSolutions);
  const preRotation = cubeOrientationToRotations(options.solutionOrientation);

  const mainAction = areSolutionsHidden ? showSolutions : getNext;

  // TODO: add scroll to top and hotkeys

  const copyText = generateCopyText({
    solverName: options.eoStep,
    scramble,
    preRotation,
    solutions,
  });

  return (
    <VStack spacing={4} my={4}>
      <HStack spacing={4}>
        <Heading fontSize="xl">EO Trainer</Heading>
        <EOStepSelect eoStep={options.eoStep} setEOStep={actions.setEOStep} />
      </HStack>
      <ScrambleEditor
        isScrambleLoading={isScrambleLoading}
        scramble={scramble}
        setScramble={setScramble}
        notationParser={scrambleParser}
      />
      <SolutionsViewer
        mask={MASKS[options.eoStep]}
        scramble={scramble}
        preRotation={preRotation}
        solutions={solutions}
        showEO
        isLoading={isLoading}
        hideSolutions={areSolutionsHidden || isLoading}
        onRevealSolutions={showSolutions}
      >
        <HStack>
          {!areSolutionsHidden && !isLoading && <ShareButton text={copyText} />}
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

const scrambleParser = (input: string) => {
  const parsed = Cube3x3.parseNotation(input);
  return parsed?.every(isFaceMove) ? parsed : null;
};

function ShareButton({ text }: { text: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { onCopy, hasCopied, setValue } = useClipboard(text);
  useEffect(() => {
    setValue(text);
  }, [text]);
  return (
    <>
      <Button onClick={onOpen}>share</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>share solutions</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              whiteSpace="pre-line"
              backgroundColor="gray.100"
              borderRadius="lg"
              padding="4"
            >
              {text}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Tooltip label="copied!" isOpen={hasCopied} hasArrow>
              <Button onClick={onCopy} colorScheme="blue" mr={3}>
                copy
              </Button>
            </Tooltip>
            <Button variant="ghost" onClick={onClose}>
              close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function generateCopyText({
  solverName,
  scramble,
  preRotation,
  solutions,
}: {
  solverName: PuzzleConfigName;
  scramble: Move3x3[];
  preRotation: RotationMove[];
  solutions: Move3x3[][];
}): string {
  const scrambleText = `scramble: ${scramble.join(" ")}`;

  const solutionText = [
    `${solverName} solutions:`,
    ...solutions.map((solution, index) => {
      const prefixText = `${index + 1}.`;
      const movecountText = `(${solution.length} HTM)`; // TODO: compute HTM instead of checking length
      const solutionText = [...preRotation, ...solution].join(" ");
      const eoAnnotationText = `[${getEOSolutionAnnotation(
        scramble,
        preRotation,
        solution
      )
        .filter(Boolean)
        .join(" ")}]`;
      return [prefixText, movecountText, solutionText, eoAnnotationText]
        .join(" ")
        .trimEnd();
    }),
  ].join("\n");

  const linkText = "generated by https://crystalcube.app";

  return [scrambleText, solutionText, linkText].join("\n\n");
}
