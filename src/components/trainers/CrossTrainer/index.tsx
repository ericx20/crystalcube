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
  isCubeRotation,
  isFaceMove,
  Layer,
  layerOfLayerMove,
  MASKS,
  Move3x3,
  MOVECOUNT_METRICS,
  RotationMove,
  translateMoves,
} from "src/lib/puzzles/cube3x3";

import useScrambleAndSolutions from "../common/useScrambleAndSolutions";
import ScrambleEditor from "../common/ScrambleEditor";
import { Cube3x3 } from "src/lib/puzzles/cube3x3";

import { useCrossOptions, useActions, useUIOptions } from "./store";

import scrambler from "./scrambler";
import solver from "./solver";

import SolutionsViewer, { DisplayedSolution } from "../common/SolutionsViewer";
import CrossLevelSelect from "./cards/CrossLevelSelect";
import PreferenceSelect from "./cards/PreferenceSelect";
import { useHotkeys } from "react-hotkeys-hook";
import KeyboardControls from "./cards/KeyboardControls";
import { plausible } from "src/App";
import { CrossSolution, CrossStep } from "./types";
import { NUM_OF_MOVES_CONFIGS } from "./constants";
import ScrambleSettings from "./cards/ScrambleSettings";

export default function CrossTrainer() {
  const [areSolutionsHidden, setSolutionsHidden] = useState(true);
  const hideSolutions = () => setSolutionsHidden(true);
  const showSolutions = () => setSolutionsHidden(false);

  // if any of the options change, this component will re-render
  // that's what we want for now, but if not then make selectors for the parts of the state we care about
  const crossOptions = useCrossOptions();
  const uiOptions = useUIOptions();
  const actions = useActions();

  const {
    scramble,
    scrambleFailed,
    setScramble,
    solutions,
    isLoading,
    getNext,
  } = useScrambleAndSolutions(scrambler, solver, crossOptions, hideSolutions);

  const mainAction = areSolutionsHidden
    ? showSolutions
    : () => {
        plausible.trackEvent("trainer-generate", {
          props: { method: "Cross" },
        });
        getNext();
      };

  const copyText = generateCopyText(scramble, solutions);

  const displayedSolutions: DisplayedSolution<Move3x3, RotationMove>[] =
    solutions.map(({ preRotation, solution, xcrossSlot }) => ({
      preRotation,
      solution: uiOptions.chooseExecutionAngle
        ? optimizeSolutionByYRotation(solution)
        : solution,
      label: xcrossSlot,
    }));

  // hotkeys (note, more hotkeys are implemented in children)
  useHotkeys(" ", mainAction, [areSolutionsHidden], {
    enabled: uiOptions.enableHotkeys && !isLoading,
    preventDefault: true,
  });
  useHotkeys("Backspace", hideSolutions, { enabled: uiOptions.enableHotkeys });

  const { min: minNumOfMoves, max: maxNumOfMoves } =
    NUM_OF_MOVES_CONFIGS[crossOptions.crossStep];

  return (
    <Container maxW="container.lg">
      <VStack spacing={4} my={4}>
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
            mask={MASKS[crossOptions.crossStep]}
            scramble={scramble}
            solutions={displayedSolutions}
            isLoading={isLoading}
            hideSolutions={areSolutionsHidden || isLoading}
            onRevealSolutions={showSolutions}
            enableHotkeys={!areSolutionsHidden && uiOptions.enableHotkeys}
            movecountMetric={MOVECOUNT_METRICS.HTM}
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
            <CrossLevelSelect
              levelMode={crossOptions.levelMode}
              setLevelMode={actions.setLevelMode}
              numOfMoves={crossOptions.numOfMoves}
              setNumOfMoves={actions.setLevelNumOfMoves}
              minNumOfMoves={minNumOfMoves}
              maxNumOfMoves={maxNumOfMoves}
            />
          </Card>
          <Card p="1.5rem">
            <ScrambleSettings
              crossStep={crossOptions.crossStep}
              setCrossStep={actions.setCrossStep}
              colorNeutrality={crossOptions.colorNeutrality}
              setColorNeutrality={actions.setColorNeutrality}
              solutionOrientations={crossOptions.solutionOrientations}
              setSolutionOrientations={actions.setSolutionOrientations}
              // TODO:
              // shortScrambles={crossOptions.shortScrambles}
              // setShortScrambles={actions.setShortScrambles}
              // chooseExecutionAngle={uiOptions.chooseExecutionAngle}
              // setChooseExecutionAngle={actions.setChooseExecutionAngle}
            />
          </Card>
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={4}
            w="100%"
            maxW="container.lg"
          >
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

const scrambleParser = (input: string) => {
  const parsed = Cube3x3.parseNotation(input);
  return parsed?.every(isFaceMove) ? parsed : null;
};

// TODO: make this common
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

// TODO: update
function generateCopyText(
  scramble: Move3x3[],
  solutions: CrossSolution[]
): string {
  const scrambleText = `scramble: ${scramble.join(" ")}`;

  const solutionText = [
    "cross solutions:",
    ...solutions.map(({ preRotation, solution }, index) => {
      const prefixText = `${index + 1}.`;
      const movecountText = `(${solution.length} HTM)`;
      const solutionText = [...preRotation, ...solution].join(" ");
      return [prefixText, movecountText, solutionText].join(" ").trimEnd();
    }),
  ].join("\n");

  const linkText = "generated by https://crystalcuber.com";

  return [scrambleText, solutionText, linkText].join("\n\n");
}

function optimizeSolutionByYRotation(solution: Move3x3[]): Move3x3[] {
  const yRotations: RotationMove[][] = [[], ["y"], ["y'"], ["y2"]];
  const options: Move3x3[][] = yRotations.map((rotation) => [
    ...rotation,
    ...translateMoves(solution, rotation),
  ]);

  // choose y rotations that reduce the number of F or B moves, especially B moves
  // higher score is worse
  let bestOption = options[0];
  let bestScore = Infinity;
  options.forEach((option) => {
    const score = option.reduce((totalScore, currentMove) => {
      if (isCubeRotation(currentMove)) return totalScore;
      const layerScores: { [layer in Layer]?: number } = {
        F: 1,
        B: 2,
      };
      const moveScore = layerScores[layerOfLayerMove(currentMove)] ?? 0;
      return totalScore + moveScore;
    }, 0);
    if (score < bestScore) {
      bestScore = score;
      bestOption = option;
    }
  });
  return bestOption;
}
