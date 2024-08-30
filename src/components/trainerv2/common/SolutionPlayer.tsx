import {
  lazy,
  MouseEventHandler,
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Box,
  Button,
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
  Wrap,
} from "@chakra-ui/react";
import { VscCircleFilled } from "react-icons/vsc";
import { IoCube, IoCubeOutline } from "react-icons/io5";
import {
  Cube3x3,
  Cube3x3Mask,
  CubeRotation,
  Move3x3,
  invertMoves,
} from "src/libv2/puzzles/cube3x3";
const CubeV2 = lazy(() => import("src/components/CubeV2/Cube"));

interface SolutionPlayerProps {
  scramble: Move3x3[];
  preRotation: CubeRotation[];
  solution: Move3x3[];
  mask?: Cube3x3Mask;
  showEO?: boolean;
  hideSolution?: boolean;
}

export default function SolutionPlayer({
  scramble,
  preRotation,
  solution,
  mask,
  showEO,
  hideSolution,
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

  // TODO: cache this with useMemo??
  const eoAnnotation = useMemo(
    () => getEOSolutionAnnotation(scramble, preRotation, solution),
    [scramble, preRotation, solution]
  );

  const cubeBackground = useColorModeValue("gray.200", undefined);

  const scrubber = (
    <Box pt={8} px={2}>
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
        {solution.map((move, index) => {
          const isSelected = currentMoveIndex === index;
          const isPreviousMove =
            currentMoveIndex !== null && currentMoveIndex > index;
          const hideMove = hideSolution && !isSelected && !isPreviousMove;
          return (
            <SliderMark key={index} value={index} ml="-0.75rem" mt="-3.3rem">
              <SolutionMoveLabel
                label={move}
                moveAnnotation={eoAnnotation[index]}
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
  );

  return (
    <VStack align="left">
      {scrubber}
      <Center
        h={[200, 250, 350]}
        borderWidth="1px"
        borderRadius="lg"
        cursor="move"
        bg={cubeBackground}
      >
        <Suspense fallback={<Spinner />}>
          <CubeV2 cube={cubeToShow} showEO={showEO} />
        </Suspense>
      </Center>
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
  return (
    <Box w={6} h={6}>
      <Center
        visibility={showMoveAnnotation ? "visible" : "hidden"}
        w={6}
        h={3}
        bg="#9b23eb"
        color="white"
        borderRadius="md"
      >
        <Text fontSize="xs">{moveAnnotation}</Text>
      </Center>
      <Text
        colorScheme={isSelected ? "blue" : "gray"}
        fontSize="md"
        textAlign="center"
        whiteSpace="nowrap"
        fontWeight={isSelected ? "bold" : "normal"}
        opacity={isSelected || isPreviousMove ? 1 : 0.7}
      >
        {hide ? "?" : label ?? <Icon as={VscCircleFilled} />}
      </Text>
    </Box>
  );
}

function countBadEdges(cube: Cube3x3): number {
  return cube.EO.filter((eo) => eo === false).length;
}

const EO_CHANGING_MOVES: Array<Move3x3> = ["F", "F'", "B", "B'"];

/**
 * Generates an "EO Solution Annotation": a list of labels for each move in a given EO solution
 * We're only interested in seeing how the EO changes for F/F' and B/B' moves
 * Note: we assume the EO solution only contains outer layer moves. No slices, wide moves or rotations.
 */
function getEOSolutionAnnotation(
  scramble: Move3x3[],
  preRotation: CubeRotation[],
  solution: Move3x3[]
): Array<string> {
  const cube = new Cube3x3().applyMoves(scramble).applyMoves(preRotation);
  const annotation = [];

  for (const move of solution) {
    const prevBadEdgeCount = countBadEdges(cube);
    cube.applyMove(move);
    const newBadEdgeCount = countBadEdges(cube);
    const change = newBadEdgeCount - prevBadEdgeCount;

    if (!EO_CHANGING_MOVES.includes(move)) {
      annotation.push("");
    } else if (change < 0) {
      // There are fewer bad edges now
      annotation.push(`${change}`);
    } else if (change === 0) {
      // -0 is our convention to indicate an "edge exchange": the EO has changed but the number of bad edges is the same, none were reduced in total.
    } else {
      // There are more bad edges now. + sign is our convention
      annotation.push(`+${change}`);
    }
  }

  return annotation;
}
