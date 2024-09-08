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
import {
  RotationMove,
  Move3x3,
  Cube3x3Mask,
  MOVECOUNT_METRICS,
} from "src/lib/puzzles/cube3x3";
import { CopyIcon } from "@chakra-ui/icons";
import { MovecountMetric } from "src/lib/types";

// TODO: find better place to put this type?
export type DisplayedSolution<MoveType, RotationMoveType> = {
  preRotation: RotationMoveType[];
  solution: MoveType[];
  label?: string;
  annotation?: string[];
};

export interface SolutionsViewerProps<
  MoveType extends string,
  RotationMoveType extends string
> {
  scramble: MoveType[];
  /** The list of solutions, should be sorted by length starting with shortest */
  solutions: DisplayedSolution<MoveType, RotationMoveType>[];
  movecountMetric: MovecountMetric<MoveType>;
  // TODO: make cubeviewer a prop as well, so the parent will control things like how the puzzle is displayed.
  // mask and showEO should not be passed in here, but taken care of what the parent passes in as cubeviewer
  mask?: Cube3x3Mask;
  showEO?: boolean;
  isLoading?: boolean;
  hideSolutions?: boolean;
  onRevealSolutions?: () => void;
  enableHotkeys?: boolean;
  children?: React.ReactNode;
}

export default function SolutionsViewer<
  MoveType extends string,
  RotationMoveType extends string
>({
  scramble,
  solutions,
  movecountMetric,
  mask,
  showEO,
  isLoading = false,
  hideSolutions = false,
  onRevealSolutions = () => {
    /* noop */
  },
  enableHotkeys = false,
  children,
}: SolutionsViewerProps<MoveType, RotationMoveType>) {
  const [selectedSolutionIndex, setSelectedSolutionIndex] = useState(0);
  useEffect(() => {
    setSelectedSolutionIndex(0);
  }, [scramble]);
  const selectedSolution = solutions.at(selectedSolutionIndex);
  const badgeText = solutions.length
    ? `best: ${movecountMetric.metric(solutions[0].solution)} ${
        movecountMetric.name
      }`
    : "";

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
              movecountMetric={movecountMetric}
            />
          </Box>
        </Spoiler>
        {/* set minWidth to 0 to force 3D cube canvas to resize properly */}
        <Box w="100%" minW={0}>
          <SolutionPlayer
            scramble={scramble}
            solution={selectedSolution ?? { preRotation: [], solution: [] }}
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

interface SelectSolutionProps<MoveType, RotationMoveType> {
  /** When `inactive` is true, the buttons receive no keyboard focus and there is no selected solution */
  inactive?: boolean;
  solutions: DisplayedSolution<MoveType, RotationMoveType>[];
  selectedSolutionIndex: number;
  onSelectSolution: (index: number) => void;
  movecountMetric: MovecountMetric<MoveType>;
}

function SelectSolution<MoveType, RotationMoveType>({
  inactive = false,
  solutions,
  selectedSolutionIndex,
  onSelectSolution,
  movecountMetric,
}: SelectSolutionProps<MoveType, RotationMoveType>) {
  const badgeColorScheme = useColorModeValue(undefined, "gray");
  const badgeSelectedColorScheme = useColorModeValue("blackAlpha", "blue");
  return (
    <SimpleGrid spacing={2} minChildWidth="17rem">
      {solutions.map(({ preRotation, solution, label }, index) => {
        const solutionDisplayString = [...preRotation, ...solution].join(" ");
        const movecount = movecountMetric.metric(solution);
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
              {/* TODO: style to look better */}
              <p>{label}</p>
              <HStack>
                <Badge
                  colorScheme={
                    isSelected ? badgeSelectedColorScheme : badgeColorScheme
                  }
                  variant="solid"
                >
                  {movecount} {movecountMetric.name}
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
