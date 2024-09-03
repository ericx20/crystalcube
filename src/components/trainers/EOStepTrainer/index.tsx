import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  Container,
  Flex,
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
  Stack,
  Tooltip,
  useClipboard,
  useColorModeValue,
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
} from "src/lib/puzzles/cube3x3";

import useScrambleAndSolutions from "../common/useScrambleAndSolutions";
import ScrambleEditor from "../common/ScrambleEditor";
import { Cube3x3 } from "src/lib/puzzles/cube3x3";

import { useEOStepOptions, useActions, useUIOptions } from "./eoStepOptions";
import type { EOStep } from "./eoStepTypes";

import scrambler from "./scrambler";
import solver from "./solver";

import SolutionsViewer from "../common/SolutionsViewer";
import EOStepLevelSelect from "./cards/EOStepLevelSelect";
import PreferenceSelect from "./cards/PreferenceSelect";
import { getEOSolutionAnnotation } from "./utils";
import { useHotkeys } from "react-hotkeys-hook";
import KeyboardControls from "./cards/KeyboardControls";
import { plausible } from "src/App";

export default function EOStepTrainer() {
  const [areSolutionsHidden, setSolutionsHidden] = useState(true);
  const hideSolutions = () => setSolutionsHidden(true);
  const showSolutions = () => setSolutionsHidden(false);

  // if any of the options change, this component will re-render
  // that's what we want for now, but if not then make selectors for the parts of the state we care about
  const eoStepOptions = useEOStepOptions();
  const uiOptions = useUIOptions();
  const actions = useActions();

  const {
    scramble,
    scrambleFailed,
    setScramble,
    solutions,
    isLoading,
    getNext,
  } = useScrambleAndSolutions(scrambler, solver, eoStepOptions, hideSolutions);
  const preRotation = cubeOrientationToRotations(
    eoStepOptions.solutionOrientation
  );

  const mainAction = areSolutionsHidden ? showSolutions : () => {
    plausible.trackEvent("trainer-generate", { props: { method: eoStepOptions.eoStep } });
    getNext();
  };

  const copyText = generateCopyText({
    solverName: eoStepOptions.eoStep,
    scramble,
    preRotation,
    solutions,
  });

  const solutionsWithPrerotations = solutions.map((solution) => ({
    solution,
    preRotation,
  }));

  // hotkeys (note, more hotkeys are implemented in children)
  useHotkeys(" ", mainAction, [areSolutionsHidden], {
    enabled: uiOptions.enableHotkeys && !isLoading,
    preventDefault: true,
  });
  useHotkeys("Backspace", hideSolutions, { enabled: uiOptions.enableHotkeys });

  return (
    <Container maxW="container.lg">
      <VStack spacing={4} my={4}>
        <HStack spacing={4}>
          <Heading size="md">EO trainer</Heading>
          <EOStepSelect
            eoStep={eoStepOptions.eoStep}
            setEOStep={actions.setEOStep}
          />
        </HStack>
        <Card p="1.5rem" w="100%">
          <ScrambleEditor
            scrambleFailed={scrambleFailed}
            isLoading={isLoading}
            scramble={scramble}
            setScramble={setScramble}
            notationParser={scrambleParser}
          />
        </Card>
        <Card p="1.5rem" w="100%">
          <SolutionsViewer
            mask={MASKS[eoStepOptions.eoStep]}
            scramble={scramble}
            solutions={solutionsWithPrerotations}
            showEO
            isLoading={isLoading}
            hideSolutions={areSolutionsHidden || isLoading}
            onRevealSolutions={showSolutions}
            enableHotkeys={!areSolutionsHidden && uiOptions.enableHotkeys}
          >
            <HStack>
              {!areSolutionsHidden && !isLoading && (
                <ShareButton text={copyText} />
              )}
              <Button onClick={mainAction} isLoading={isLoading} w="100%">
                {areSolutionsHidden ? "reveal" : "next"}
              </Button>
              {!areSolutionsHidden && !isLoading && (
                <Button onClick={hideSolutions}>hide</Button>
              )}
            </HStack>
          </SolutionsViewer>
        </Card>
        <Flex direction="column" w="100%" gap={4}>
          <Card p="1.5rem">
            <EOStepLevelSelect
              levelMode={eoStepOptions.levelMode}
              setLevelMode={actions.setLevelMode}
              numOfBadEdges={eoStepOptions.numOfBadEdges}
              setNumOfBadEdges={actions.setLevelNumOfBadEdges}
              numOfMoves={eoStepOptions.numOfMoves}
              setNumOfMoves={actions.setLevelNumOfMoves}
              numOfMovesConfig={actions.getNumOfMovesConfig()}
            />
          </Card>
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={4}
            w="100%"
            maxW="container.lg"
          >
            <Card p="1.5rem" flex={1}>
              <PreferenceSelect
                eoStep={eoStepOptions.eoStep}
                orientation={eoStepOptions.solutionOrientation}
                setOrientation={actions.setSolutionOrientation}
                shortScrambles={eoStepOptions.shortScrambles}
                setShortScrambles={actions.setShortScrambles}
              />
            </Card>
            <Card p="1.5rem" flex={1} display={{ base: "none", sm: "flex" }}>
              <KeyboardControls
                enableHotkeys={uiOptions.enableHotkeys}
                setEnableHotkeys={actions.setEnableHotkeys}
              />
            </Card>
          </Stack>
        </Flex>
      </VStack>
    </Container>
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
  const boxColor = useColorModeValue("gray.100", "gray.600");
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
              bg={boxColor}
              whiteSpace="pre-line"
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
      const movecountText = `(${solution.length} HTM)`;
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

  const linkText = "generated by https://crystalcuber.com";

  return [scrambleText, solutionText, linkText].join("\n\n");
}
