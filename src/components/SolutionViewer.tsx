import * as React from "react"
import { Box, Button, Card, Container, Heading, Icon, Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack, VStack, Text, Wrap } from "@chakra-ui/react"
import type { Move, Mask } from "src/lib/types"
import { VscCircleFilled } from "react-icons/vsc"
import { IoCube, IoCubeOutline } from "react-icons/io5"

const Cube = React.lazy(() => import("src/components/Cube/Cube"))


interface SolutionMoveLabelProps {
  move: Move | null // null signals this move is the start
  isSelected?: boolean
  isPreviousMove?: boolean
}

function SolutionMoveLabel({ move, isSelected, isPreviousMove }: SolutionMoveLabelProps) {
  return (
    <Box w={6} h={6}>
      <Text
        colorScheme={isSelected ? "blue" : "gray"}
        fontSize="md"
        textAlign="center"
        fontWeight={isSelected ? "bold" : "normal"}
        opacity={isPreviousMove ? 0.7 : 1}
        >
        {move ?? <Icon as={VscCircleFilled} />}
      </Text>
    </Box>
  )
}


interface SolutionMoveButtonProps {
  move: Move | null // null signals this move is the start
  isSelected?: boolean
  isPreviousMove?: boolean
  onClick?: () => void
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>
}

// For desktop
function SolutionMoveButton({ move, isSelected, isPreviousMove, onClick, onMouseEnter, onMouseLeave }: SolutionMoveButtonProps) {
  return (
    <Box
      as="div"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      px="0.25rem"
      cursor="pointer"
    >
      <Button
        colorScheme={isSelected ? "blue" : "gray"}
        isActive={isPreviousMove}
        size={["xs", "sm", "md"]}
        width="1rem"
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
  const atSolutionEnd = !solution || selectedMoveIndex === solution.length - 1

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
    <>
      {/* Desktop version */}
      <Wrap spacingX="0rem" display={{ base: "none", sm: "flex" }} sx={{ marginX: "-0.25rem !important" }}>
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
      {/* Mobile version */}
      <Box pt={3} pb={6} px={2} display={{ sm: "none" }}>
        <Slider value={selectedMoveIndex} min={-1} max={solution.length - 1} onChange={(val) => setSelectedMoveIndex(val)}>
          <SliderMark value={-1} ml="-0.75rem" mt={3.5}>
            <SolutionMoveLabel
              move={null}
              isSelected={selectedMoveIndex === -1}
              isPreviousMove={selectedMoveIndex > -1}
            />
          </SliderMark>
          {solution.map((move, index) => (
            <SliderMark key={index} value={index} ml="-0.75rem" mt={3}>
              <SolutionMoveLabel
                move={move}
                isSelected={selectedMoveIndex === index}
                isPreviousMove={selectedMoveIndex > index}
              />
            </SliderMark>
          ))}
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb boxSize={6}>
            <Icon as={atSolutionEnd ? IoCube : IoCubeOutline} boxSize={5} color="blue.500" />
          </SliderThumb>
        </Slider>
      </Box>
    </>
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