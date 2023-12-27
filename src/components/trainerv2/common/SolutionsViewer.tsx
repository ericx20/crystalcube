import { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import type { MoveSeq, Mask } from "src/lib/types";
import SolutionPlayer from "./SolutionPlayer";
import { moveSeqToString } from "src/lib";
import TrainerCard from "./TrainerCard";

interface SolutionsViewerProps {
  scramble: MoveSeq;
  solutions: Array<MoveSeq>;
  mask?: Mask;
  showEO?: boolean;
  areSolutionsHidden?: boolean;
  onRevealSolutions?: () => void;
  children?: React.ReactNode;
}

export default function SolutionsViewer({
  scramble,
  solutions,
  // make mask and showEO part of a PuzzleDisplayOptions type
  // then make cubeviewer a prop as well
  mask,
  showEO,
  areSolutionsHidden = false,
  onRevealSolutions = () => {
    /* noop */
  },
  children,
}: SolutionsViewerProps) {
  const [selectedSolutionIndex, setSelectedSolutionIndex] = useState(0);
  useEffect(() => {
    setSelectedSolutionIndex(0);
  }, [solutions]);
  const selectedSolution = solutions.at(selectedSolutionIndex);
  // TODO: add functions that calculate metrics, since we shouldn't assume the length of a solution is its HTM metric (slice moves, rotations etc.)
  // make metrics a prop of the form { name: string, calculateMetric: (moves: MoveType[]) => number }
  const badgeText = solutions.length ? `best: ${solutions[0].length} HTM` : "";
  return (
    <TrainerCard>
      <Heading size="md">
        solutions
        <Badge ml={2} colorScheme="blue" variant="solid">
          {badgeText}
        </Badge>
      </Heading>
      <Stack direction={{ base: "column", md: "row" }}>
        <Spoiler
          hide={solutions.length ? areSolutionsHidden : false}
          onReveal={onRevealSolutions}
        >
          <Box minW="17rem">
            <SelectSolution
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
            solution={selectedSolution ?? []}
            mask={mask}
            showEO={showEO}
            hideSolution={areSolutionsHidden}
          />
        </Box>
      </Stack>
      {children}
    </TrainerCard>
  );
}

interface SelectSolutionProps {
  solutions: Array<MoveSeq>;
  selectedSolutionIndex: number;
  onSelectSolution: (index: number) => void;
}

function SelectSolution({
  solutions,
  selectedSolutionIndex,
  onSelectSolution,
}: SelectSolutionProps) {
  const badgeColorScheme = useColorModeValue(undefined, "gray");
  const badgeSelectedColorScheme = useColorModeValue("blackAlpha", "blue");
  return (
    <SimpleGrid spacing={2} minChildWidth="17rem">
      {solutions.map((solution, index) => {
        const solutionString = moveSeqToString(solution);
        const movecount = solution.length;
        const isSelected = selectedSolutionIndex === index;
        return (
          <Button
            key={solutionString}
            size={["sm", "md"]}
            onClick={() => onSelectSolution(index)}
            w="100%"
            justifyContent="left"
            colorScheme={isSelected ? "blue" : undefined}
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
              {/* TODO: REMOVE HARDCODE */}
              <Text fontWeight={500}>x2 {solutionString}</Text>
            </HStack>
          </Button>
        );
      })}
    </SimpleGrid>
  );
}

interface SpoilerProps {
  hide: boolean;
  onReveal: () => void;
  children: JSX.Element;
}

function Spoiler({ hide, onReveal, children }: SpoilerProps) {
  const styles = {
    opacity: hide ? "0" : "1",
    visibility: hide ? "hidden" : "visible",
    transition: "opacity 0.12s linear",
  };
  const coverColor = useColorModeValue("gray.200", "gray.800");
  const badgeColor = useColorModeValue("gray.500", "gray.700");
  return (
    <Box
      onClick={onReveal}
      bg={hide ? coverColor : undefined}
      borderRadius="md"
      cursor={hide ? "pointer" : "cursor"}
      position="relative"
    >
      {hide && (
        <Badge
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          fontSize="lg"
          bg={badgeColor}
          color="white"
        >
          click to reveal
        </Badge>
      )}
      <Box sx={styles}>{children}</Box>
    </Box>
  );
}
