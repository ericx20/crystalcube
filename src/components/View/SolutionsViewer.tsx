import { useEffect, useState } from "react"
import { Box, Badge, Button, Card, Container, Flex, Heading, HStack, VStack, useColorModeValue, Text, SimpleGrid, Divider, StackDivider, Stack } from "@chakra-ui/react"
import type { MoveSeq, Mask } from "src/lib/types"
import SolutionPlayer from "./SolutionPlayer"
import { moveSeqToString } from "src/lib/cubeLib"

interface SolutionsViewerProps {
  scramble: MoveSeq
  solutions: Array<MoveSeq>
  mask?: Mask
  showEO?: boolean
  children?: JSX.Element
}

export default function SolutionsViewer({ scramble, solutions, mask, showEO, children }: SolutionsViewerProps) {
  const [selectedSolutionIndex, setSelectedSolutionIndex] = useState(0)
  useEffect(() => {
    setSelectedSolutionIndex(0)
  }, [solutions])
  const selectedSolution = solutions.at(selectedSolutionIndex)
  return (
    <Container maxW="container.lg">
      <Card p="1.5rem">
        <VStack align="left">
          <Heading size="md">solutions</Heading>
          <Stack direction={{ base: "column", md: "row" }} /* filter="blur(15px)" */>
            <Box minW="17rem">
              <SelectSolution solutions={solutions} selectedSolutionIndex={selectedSolutionIndex} onSelectSolution={setSelectedSolutionIndex} />
            </Box>          
            {/* set minWidth to 0 to force 3D cube canvas to resize properly */}
            <Box w="100%" minW={0}>
              <SolutionPlayer
                scramble={scramble}
                solution={selectedSolution ?? []}
                mask={mask}
                showEO={showEO}
              />
            </Box>
          </Stack>
          {children}
        </VStack>
      </Card>
    </Container>
  )
}

interface SelectSolutionProps {
  solutions: Array<MoveSeq>
  selectedSolutionIndex: number
  onSelectSolution: (index: number) => void
}

function SelectSolution({ solutions, selectedSolutionIndex, onSelectSolution }: SelectSolutionProps) {
  return (
    <SimpleGrid spacing={2} minChildWidth="17rem">
      {solutions.map((solution, index) => {
        const solutionString = moveSeqToString(solution)
        const movecount = solution.length
        const isSelected = selectedSolutionIndex === index
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
              <Badge colorScheme={isSelected ? "grey" : undefined}>{movecount} HTM</Badge>
              <Text>{solutionString}</Text>
            </HStack>
          </Button>
        )
      })}
    </SimpleGrid>
  )
}