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
  RotationMove,
  translateMoves,
} from "src/lib/puzzles/cube3x3";

import useScrambleAndSolutions from "../common/useScrambleAndSolutions";
import ScrambleEditor from "../common/ScrambleEditor";
import { Cube3x3 } from "src/lib/puzzles/cube3x3";

import { useCrossOptions, useActions, useUIOptions } from "./crossOptions";

import scrambler from "./scrambler";
import solver from "./solver";

import SolutionsViewer, {
  SolutionWithPrerotation,
} from "../common/SolutionsViewer";
import CrossLevelSelect from "./cards/CrossLevelSelect";
import PreferenceSelect from "./cards/PreferenceSelect";
import { useHotkeys } from "react-hotkeys-hook";
import KeyboardControls from "./cards/KeyboardControls";
import { plausible } from "src/App";

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
  const preRotation = cubeOrientationToRotations(
    crossOptions.solutionOrientation
  );

  const mainAction = areSolutionsHidden ? showSolutions : () => {
    plausible.trackEvent("trainer-generate", { props: { method: "Cross" } });
    getNext();
  };

  const copyText = generateCopyText({
    scramble,
    preRotation,
    solutions,
  });

  const solutionsWithPrerotations = solutions.map((solution) =>
    uiOptions.chooseExecutionAngle
      ? optimizePrerotationForCrossSolution(preRotation, solution)
      : {
          solution,
          preRotation,
        }
  );

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
          <Heading size="md">cross trainer</Heading>
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
            mask={MASKS.Cross}
            scramble={scramble}
            solutions={solutionsWithPrerotations}
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
            <CrossLevelSelect
              levelMode={crossOptions.levelMode}
              setLevelMode={actions.setLevelMode}
              numOfMoves={crossOptions.numOfMoves}
              setNumOfMoves={actions.setLevelNumOfMoves}
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
                orientation={crossOptions.solutionOrientation}
                setOrientation={actions.setSolutionOrientation}
                shortScrambles={crossOptions.shortScrambles}
                setShortScrambles={actions.setShortScrambles}
                chooseExecutionAngle={uiOptions.chooseExecutionAngle}
                setChooseExecutionAngle={actions.setChooseExecutionAngle}
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

function generateCopyText({
  scramble,
  preRotation,
  solutions,
}: {
  scramble: Move3x3[];
  preRotation: RotationMove[];
  solutions: Move3x3[][];
}): string {
  const scrambleText = `scramble: ${scramble.join(" ")}`;

  const solutionText = [
    "cross solutions:",
    ...solutions.map((solution, index) => {
      const prefixText = `${index + 1}.`;
      const movecountText = `(${solution.length} HTM)`;
      const solutionText = [...preRotation, ...solution].join(" ");
      return [prefixText, movecountText, solutionText].join(" ").trimEnd();
    }),
  ].join("\n");

  const linkText = "generated by https://crystalcuber.com";

  return [scrambleText, solutionText, linkText].join("\n\n");
}

function optimizePrerotationForCrossSolution(
  initialPrerotation: RotationMove[],
  solution: Move3x3[]
): SolutionWithPrerotation {
  const yRotations = [[], ["y"], ["y'"], ["y2"]] as const;
  const options: SolutionWithPrerotation[] = yRotations.map((rotation) => ({
    preRotation: [...initialPrerotation, ...rotation],
    solution: translateMoves(solution, rotation),
  }));

  // choose y rotations that reduce the number of F or B moves, especially B moves
  // higher score is worse
  let bestOption = options[0];
  let bestScore = Infinity;
  options.forEach((option) => {
    const score = option.solution.reduce((totalScore, currentMove) => {
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
