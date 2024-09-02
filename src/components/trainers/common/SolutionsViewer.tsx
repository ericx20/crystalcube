import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Badge,
  Button,
  Heading,
  HStack,
  useColorModeValue,
  Text,
  SimpleGrid,
  Stack,
  IconButton,
  Tooltip,
  useClipboard,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import SolutionPlayer from "./SolutionPlayer";
import { RotationMove, Move3x3, Cube3x3Mask } from "src/lib/puzzles/cube3x3";
import { getEOSolutionAnnotation } from "../EOStepTrainer/utils";
import { CopyIcon } from "@chakra-ui/icons";

export interface SolutionWithPrerotation {
  solution: Move3x3[];
  preRotation: RotationMove[];
}

interface SolutionsViewerProps {
  scramble: Move3x3[];
  solutions: SolutionWithPrerotation[];
  mask?: Cube3x3Mask;
  showEO?: boolean;
  isLoading?: boolean;
  hideSolutions?: boolean;
  onRevealSolutions?: () => void;
  enableHotkeys?: boolean;
  children?: React.ReactNode;
}

export default function SolutionsViewer({
  scramble,
  /** The list of solutions, should be sorted by length starting with shortest */
  solutions,
  // make mask and showEO part of a PuzzleDisplayOptions type
  // then make cubeviewer a prop as well
  mask,
  showEO,
  isLoading = false,
  hideSolutions = false,
  onRevealSolutions = () => {
    /* noop */
  },
  enableHotkeys = false,
  children,
}: SolutionsViewerProps) {
  const [selectedSolutionIndex, setSelectedSolutionIndex] = useState(0);
  useEffect(() => {
    setSelectedSolutionIndex(0);
  }, [solutions]);
  const selectedSolution = solutions.at(selectedSolutionIndex);
  // TODO: add functions that calculate metrics, since we shouldn't assume the length of a solution is its HTM metric (slice moves, rotations etc.)
  // make metrics a prop of the form { name: string, calculateMetric: (moves: MoveType[]) => number }
  const badgeText = solutions.length
    ? `best: ${solutions[0].solution.length} HTM`
    : "";
  const eoSolutionAnnotation = useMemo(
    () =>
      selectedSolution
        ? getEOSolutionAnnotation(
            scramble,
            selectedSolution.preRotation,
            selectedSolution.solution
          )
        : undefined,
    [scramble, selectedSolution?.preRotation, selectedSolution?.solution]
  );

  return (
    <VStack align="left">
      <Heading size="md">
        solutions
        <Badge ml={4} colorScheme="blue" variant="solid">
          {badgeText}
        </Badge>
      </Heading>
      <Stack direction={{ base: "column", md: "row" }}>
        <Spoiler
          isLoading={isLoading}
          hide={solutions.length ? hideSolutions : false}
          onReveal={onRevealSolutions}
        >
          <Box minW={["14rem", "20rem"]}>
            <SelectSolution
              inactive={hideSolutions}
              solutions={solutions}
              selectedSolutionIndex={selectedSolutionIndex}
              onSelectSolution={setSelectedSolutionIndex}
            />
          </Box>
        </Spoiler>
        {/* set minWidth to 0 to force 3D cube canvas to resize properly */}
        <Box w="100%" minW={0}>
          <SolutionPlayer
            scramble={scramble}
            preRotation={selectedSolution?.preRotation ?? []}
            solution={selectedSolution?.solution ?? []}
            solutionAnnotation={showEO ? eoSolutionAnnotation : undefined}
            mask={mask}
            showEO={showEO}
            hideSolution={hideSolutions}
            isLoading={isLoading}
            enableHotkeys={enableHotkeys}
          />
        </Box>
      </Stack>
      {children}
    </VStack>
  );
}

interface SelectSolutionProps {
  /** When `inactive` is true, the buttons receive no keyboard focus and there is no selected solution */
  inactive?: boolean;
  solutions: SolutionWithPrerotation[];
  selectedSolutionIndex: number;
  onSelectSolution: (index: number) => void;
}

function SelectSolution({
  inactive = false,
  solutions,
  selectedSolutionIndex,
  onSelectSolution,
}: SelectSolutionProps) {
  const badgeColorScheme = useColorModeValue(undefined, "gray");
  const badgeSelectedColorScheme = useColorModeValue("blackAlpha", "blue");
  return (
    <SimpleGrid spacing={2} minChildWidth="17rem">
      {solutions.map(({ solution, preRotation }, index) => {
        const solutionDisplayString = [...preRotation, ...solution].join(" ");
        const movecount = solution.length;
        const isSelected = !inactive && selectedSolutionIndex === index;

        return (
          <HStack key={solutionDisplayString}>
            <Button
              size={["sm", "md"]}
              onClick={() => onSelectSolution(index)}
              w="100%"
              justifyContent="left"
              colorScheme={isSelected ? "blue" : undefined}
              tabIndex={inactive ? -1 : undefined}
            >
              <HStack>
                <Badge
                  colorScheme={
                    isSelected ? badgeSelectedColorScheme : badgeColorScheme
                  }
                  variant="solid"
                >
                  {movecount} HTM
                </Badge>
                <Text fontWeight={500}>{solutionDisplayString}</Text>
              </HStack>
            </Button>
            {isSelected && (
              <CopySolutionButton solutionText={solutionDisplayString} />
            )}
          </HStack>
        );
      })}
    </SimpleGrid>
  );
}

interface SpoilerProps {
  isLoading?: boolean;
  hide: boolean;
  onReveal: () => void;
  children: JSX.Element;
}

function Spoiler({
  isLoading = false,
  hide,
  onReveal,
  children,
}: SpoilerProps) {
  const coverColor = useColorModeValue("gray.100", "gray.800");
  const badgeColor = useColorModeValue("gray.500", "gray.700");

  return (
    <Box
      onClick={isLoading ? undefined : onReveal}
      bg={hide ? coverColor : undefined}
      borderRadius="md"
      cursor={isLoading ? "not-allowed" : hide ? "pointer" : "cursor"}
      position="relative"
    >
      <Box
        pointerEvents={hide ? "none" : undefined}
        filter={hide ? "blur(8px)" : undefined}
        tabIndex={-1}
      >
        {children}
      </Box>
      {hide &&
        (isLoading ? (
          <Spinner
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            margin="auto"
            opacity={0.5}
          />
        ) : (
          <Badge
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            fontSize="md"
            bg={badgeColor}
            color="white"
          >
            click to reveal
          </Badge>
        ))}
    </Box>
  );
}

function CopySolutionButton({ solutionText }: { solutionText: string }) {
  const { onCopy, hasCopied, setValue } = useClipboard(solutionText);
  useEffect(() => {
    setValue(solutionText);
  }, [solutionText]);

  return (
    <Tooltip label="copied solution!" isOpen={hasCopied} hasArrow>
      <IconButton
        onClick={onCopy}
        icon={<CopyIcon />}
        aria-label="copy solution"
        size={["sm", "md"]}
        colorScheme="blue"
      />
    </Tooltip>
  );
}
