import * as React from "react"
import { Box, Button, Card, Container, Heading, Icon, Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack, VStack, Text, Wrap } from "@chakra-ui/react"
import type { Move, Mask } from "src/lib/types"
import { VscCircleFilled } from "react-icons/vsc"
import { IoCube, IoCubeOutline } from "react-icons/io5"

const Cube = React.lazy(() => import("src/components/Cube/Cube"))

// TODO: move SolutionPlayer into separate file
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
        opacity={(isSelected || isPreviousMove) ? 1 : 0.7}
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

interface SolutionPlayerProps {
  scramble: Array<Move>
  solution: Array<Move> | null
  mask?: Mask
  showEO?: boolean
}

function SolutionPlayer({ scramble, solution, mask, showEO }: SolutionPlayerProps) {
  const [selectedMoveIndex, setSelectedMoveIndex] = React.useState(-1) // -1 means the at the start before any moves
  const [hoveredMoveIndex, setHoveredMoveIndex] = React.useState<number | null>(null)
  const currentIndex = hoveredMoveIndex ?? selectedMoveIndex
  const atSolutionEnd = !solution || selectedMoveIndex === solution.length - 1

  // Cache the scramble and solution, so they update at the same time as selectedMoveIndex
  // which prevents stateToShow from flickering
  const [delayedScramble, setDelayedScramble] = React.useState([] as Array<Move>)
  const [delayedSolution, setDelayedSolution] = React.useState([] as Array<Move>)
  const [stateToShow, setStateToShow] = React.useState([] as Array<Move>)

  React.useEffect(() => {
    setSelectedMoveIndex(-1)
    setDelayedScramble(scramble)
    setDelayedSolution(solution ?? [])
  }, [scramble, solution])

  React.useEffect(() => {
    const solutionToShow = [...delayedSolution].splice(0, currentIndex + 1)
    setStateToShow(delayedScramble.concat(solutionToShow))
  }, [currentIndex, delayedScramble, delayedSolution])

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
      <Box pt={7} px={2} display={{ sm: "none" }}>
        <Slider value={selectedMoveIndex} min={-1} max={solution.length - 1} onChange={onSelect}>
          {solution.length && (
            <SliderMark value={-1} ml="-0.75rem" mt="-2.35rem">
              <SolutionMoveLabel
                move={null}
                isSelected={selectedMoveIndex === -1}
                isPreviousMove={selectedMoveIndex > -1}
              />
            </SliderMark>
          )}
          {solution.map((move, index) => (
            <SliderMark key={index} value={index} ml="-0.75rem" mt="-2.5rem">
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
      <React.Suspense fallback={<p>Loading...</p>}>
        <Box h={[200, 300, 400]} borderWidth="1px" borderRadius="lg" cursor="move">
          <Cube moves={stateToShow} mask={mask} showEO={showEO} />
        </Box>
      </React.Suspense>
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
  return (
    <Container maxW="container.lg">
      <Card p="1.5rem" /* filter="blur(15px)" */>
        <VStack align="left">
          <Heading size="md">solution</Heading>
          <SolutionPlayer
            scramble={scramble}
            solution={solution}
            mask={mask}
            showEO={showEO}
          />
          {children}
        </VStack>
      </Card>
    </Container>
  )
}
