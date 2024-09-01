import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Box,
  Center,
  Icon,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Spinner,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { VscCircleFilled } from "react-icons/vsc";
import { IoCube, IoCubeOutline } from "react-icons/io5";
import {
  Cube3x3,
  Cube3x3Mask,
  RotationMove,
  Move3x3,
  invertMoves,
} from "src/lib/puzzles/cube3x3";
import { useHotkeys } from "react-hotkeys-hook";
const Cube = lazy(() => import("src/components/Cube"));

interface SolutionPlayerProps {
  scramble: Move3x3[];
  preRotation: RotationMove[];
  solution: Move3x3[];
  solutionAnnotation?: string[];
  mask?: Cube3x3Mask;
  showEO?: boolean;
  hideSolution?: boolean;
  isLoading?: boolean;
  enableHotkeys?: boolean;
}

export default function SolutionPlayer({
  scramble,
  preRotation,
  solution,
  solutionAnnotation,
  mask,
  showEO,
  hideSolution,
  isLoading,
  enableHotkeys,
}: SolutionPlayerProps) {
  // The full solution is `preRotation` then `solution`

  // null means no move is selected
  const [currentMoveIndex, setCurrentMoveIndex] = useState<number | null>(null);

  // Reset the slider to the beginning when the user looks at a different solution
  useEffect(() => {
    setCurrentMoveIndex(null);
  }, [solution]);

  const atSolutionEnd = currentMoveIndex === solution.length - 1;

  // The part of the solution up to and including the currently selected move
  const partialSolution =
    currentMoveIndex === null ? [] : solution.slice(0, currentMoveIndex + 1);

  // TODO: why couldn't we cache this with useMemo? weird issue where first render is wrong, was my dependency array incorrect?
  const cubeToShow = useMemo(() => {
    const cube = new Cube3x3();
    if (mask) {
      cube.applyMoves(preRotation);
      cube.applyMask(mask);
      cube.applyMoves(invertMoves(preRotation));
    }
    cube
      .applyMoves(scramble)
      .applyMoves(preRotation)
      .applyMoves(partialSolution);
    return cube;
  }, [mask, preRotation, scramble, partialSolution]);

  const selectPreviousMove = () =>
    setCurrentMoveIndex(
      currentMoveIndex === null
        ? null
        : currentMoveIndex === 0
        ? null
        : Math.max(currentMoveIndex - 1, 0)
    );
  const selectNextMove = () =>
    setCurrentMoveIndex(
      currentMoveIndex === null
        ? 0
        : Math.min(currentMoveIndex + 1, solution.length - 1)
    );

  const cubeBackground = useColorModeValue("gray.200", undefined);

  // hotkeys
  useHotkeys("left", selectPreviousMove, { enabled: enableHotkeys });
  useHotkeys("right", selectNextMove, { enabled: enableHotkeys });

  return (
    <VStack align="left">
      <Center
        h={[200, 250, 350]}
        borderWidth="1px"
        borderRadius="lg"
        cursor="move"
        bg={cubeBackground}
      >
        <Suspense fallback={<Spinner />}>
          <Cube cube={cubeToShow} showEO={showEO} />
        </Suspense>
      </Center>
      <Box pt={10} px={2}>
        <Slider
          value={currentMoveIndex ?? -1}
          min={-1}
          max={solution.length - 1}
          onChange={(e) => setCurrentMoveIndex(e)}
        >
          {/* TODO: dummy slider mark for the cube orientation, if no orientation then its just a dot */}
          <SliderMark key={-1} value={-1} ml="-0.75rem" mt="-3.3rem">
            <SolutionMoveLabel
              label={preRotation.length ? preRotation.join(" ") : null}
              isSelected={currentMoveIndex === null}
              isPreviousMove={currentMoveIndex !== null}
            />
          </SliderMark>
          {!isLoading &&
            solution.map((move, index) => {
              const isSelected = currentMoveIndex === index;
              const isPreviousMove =
                currentMoveIndex !== null && currentMoveIndex > index;
              const hideMove = hideSolution && !isSelected && !isPreviousMove;
              return (
                <SliderMark
                  key={index}
                  value={index}
                  ml="-0.75rem"
                  mt="-3.3rem"
                >
                  <SolutionMoveLabel
                    label={move}
                    moveAnnotation={
                      solutionAnnotation && solutionAnnotation[index]
                    }
                    isSelected={isSelected}
                    isPreviousMove={isPreviousMove}
                    hide={hideMove}
                  />
                </SliderMark>
              );
            })}
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb boxSize={6}>
            <Icon
              as={atSolutionEnd ? IoCube : IoCubeOutline}
              boxSize={5}
              color="blue.500"
            />
          </SliderThumb>
        </Slider>
      </Box>
    </VStack>
  );
}

interface SolutionMoveLabelProps {
  label: string | null; // null signals this move is the start
  moveAnnotation?: string;
  isSelected?: boolean;
  isPreviousMove?: boolean;
  hide?: boolean;
}

function SolutionMoveLabel({
  label,
  moveAnnotation,
  isSelected,
  isPreviousMove,
  hide = false,
}: SolutionMoveLabelProps) {
  const showMoveAnnotation = !!moveAnnotation && !hide;
  const opacity = isSelected || isPreviousMove ? 1 : 0.6;
  return (
    <Box w={6} h={6}>
      <Center
        visibility={showMoveAnnotation ? "visible" : "hidden"}
        w={6}
        h={4}
        bg="#9b23eb"
        color="white"
        borderRadius="md"
        opacity={opacity}
      >
        <Text fontSize="sm">{moveAnnotation}</Text>
      </Center>
      <Text
        colorScheme={isSelected ? "blue" : "gray"}
        textAlign="center"
        whiteSpace="nowrap"
        fontWeight={isSelected ? "bold" : "normal"}
        opacity={opacity}
      >
        {hide ? "?" : label ?? <Icon as={VscCircleFilled} />}
      </Text>
    </Box>
  );
}
