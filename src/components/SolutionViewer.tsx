import * as React from "react"
import { Box, Button, Card, Container, Heading, Icon, Text, VStack, Wrap } from "@chakra-ui/react"
import type { Move, Mask } from "src/lib/types"
import { VscCircleFilled } from "react-icons/vsc"

const Cube = React.lazy(() => import("src/components/Cube/Cube"))

interface SolutionMoveButtonProps {
  move: Move | null // null signals this move is the start
  isSelected?: boolean
  isPreviousMove?: boolean
  onClick?: React.MouseEventHandler<HTMLDivElement>
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>
}

function SolutionMoveButton({ move, isSelected, isPreviousMove, onClick, onMouseEnter, onMouseLeave }: SolutionMoveButtonProps) {
  return (
    <Box
      as="div"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      px="0.25rem"
      sx={{ cursor: "pointer" }}
    >
      <Button
        colorScheme={isSelected ? "purple" : "gray"}
        isActive={isPreviousMove}
        size={["sm", "md"]}
        width="2rem"
      >
        {move ?? <Icon as={VscCircleFilled} />}
      </Button>
    </Box>
  )
}

interface SolutionScrubberProps {
  solution: Array<Move> | null
  onScrub: (currentIndex: number) => void
}

function SolutionScrubber({ solution, onScrub }: SolutionScrubberProps) {
  const [selectedMoveIndex, setSelectedMoveIndex] = React.useState(-1) // -1 means the at the start before any moves
  const [hoveredMoveIndex, setHoveredMoveIndex] = React.useState<number | null>(null)
  const currentIndex = hoveredMoveIndex ?? selectedMoveIndex

  React.useEffect(() => {
    setSelectedMoveIndex(-1)
  }, [solution])

  React.useEffect(() => {
    onScrub(currentIndex)
  }, [currentIndex, onScrub])

  const onSelect = (i: number) => setSelectedMoveIndex(i)
  const onHover = (i: number | null) => setHoveredMoveIndex(i)
  
  if (solution === null) {
    return <SolutionMoveButton move={null} isSelected={true} />
  }

  return (
    <Wrap spacingX="0rem" sx={{ marginX: "-0.25rem !important" }}>
      <SolutionMoveButton
        move={null}
        onClick={() => onSelect(-1)}
        isSelected={selectedMoveIndex === -1}
        isPreviousMove={selectedMoveIndex > -1}
      />
      {solution.map((move, index) => (
        <SolutionMoveButton
          key={index}
          move={move}
          onClick={() => onSelect(index)}
          onMouseEnter={() => onHover(index)}
          onMouseLeave={() => onHover(null)}
          isSelected={selectedMoveIndex === index}
          isPreviousMove={selectedMoveIndex > index}
        />
      ))}
    </Wrap>
  )
}

interface SolutionViewerProps {
  scramble: Array<Move>
  solution: Array<Move> | null
  mask?: Mask
  showEO?: boolean
  children?: JSX.Element
}

export default function SolutionViewer({ scramble, solution, mask, showEO, children }: SolutionViewerProps) {
  const [solutionPartToShow, setSolutionPartToShow] = React.useState([] as Array<Move>)
  const onScrub = React.useCallback((currentIndex: number) => {
    setSolutionPartToShow(solution ? [...solution].splice(0, currentIndex + 1) : [])
  }, [solution])

  return (
    <Container maxW="container.lg">
      <Card p="1.5rem" /* filter="blur(15px)" */>
        <VStack align="left">
          <Heading size="md">solution</Heading>
          {/* <Text>{ solution ? solution.join(" ") : "No solution found" }</Text> */}
          <SolutionScrubber
            solution={solution}
            onScrub={onScrub}
            />
          <React.Suspense fallback={<p>Loading...</p>}>
            <Box h={400} borderWidth="1px" borderRadius="lg">
              <Cube moves={scramble.concat(solutionPartToShow)} mask={mask} showEO={showEO} />
            </Box>
          </React.Suspense>
          {children}
        </VStack>
      </Card>
    </Container>
  )
}