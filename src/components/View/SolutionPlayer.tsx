import { lazy, MouseEventHandler, Suspense, useEffect, useState } from "react"
import { Box, Button, Center, Icon, Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack, Spinner, Text, VStack, Wrap } from "@chakra-ui/react"
import type { Move, MoveSeq, Mask } from "src/lib/types"
import { VscCircleFilled } from "react-icons/vsc"
import { IoCube, IoCubeOutline } from "react-icons/io5"
import { getEOSolutionAnnotation } from "src/lib/cubeLib"
const Cube = lazy(() => import("src/components/Cube/Cube"))

interface SolutionPlayerProps {
  scramble: MoveSeq
  solution: MoveSeq | null
  mask?: Mask
  showEO?: boolean
}

export default function SolutionPlayer({ scramble, solution, mask, showEO }: SolutionPlayerProps) {
  const [selectedMoveIndex, setSelectedMoveIndex] = useState(-1) // -1 means the at the start before any moves
  const [hoveredMoveIndex, setHoveredMoveIndex] = useState<number | null>(null)
  const currentIndex = hoveredMoveIndex ?? selectedMoveIndex
  const atSolutionEnd = !solution || selectedMoveIndex === solution.length - 1

  // Cache the scramble and solution, so they update at the same time as selectedMoveIndex
  // which prevents stateToShow from flickering
  const [delayedScramble, setDelayedScramble] = useState([] as MoveSeq)
  const [delayedSolution, setDelayedSolution] = useState([] as MoveSeq)
  const [stateToShow, setStateToShow] = useState([] as MoveSeq)

  useEffect(() => {
    setSelectedMoveIndex(-1)
    setDelayedScramble(scramble)
    setDelayedSolution(solution ?? [])
  }, [scramble, solution])

  useEffect(() => {
    const solutionToShow = [...delayedSolution].splice(0, currentIndex + 1)
    setStateToShow(delayedScramble.concat(solutionToShow))
  }, [currentIndex, delayedScramble, delayedSolution])

  const onSelect = (i: number) => setSelectedMoveIndex(i)
  const onHover = (i: number | null) => setHoveredMoveIndex(i)
  
  if (solution === null) {
    return <SolutionMoveButton move={null} moveAnnotation={null} isSelected={true} />
  }

  const eoAnnotation = getEOSolutionAnnotation(scramble, solution)

  const desktopScrubber = (
    <Wrap
      spacingX="0rem"
      display={{ base: "none", md: "flex" }}
      mx="-0.25rem !important"
      overflow="visible"
    >
    <SolutionMoveButton
      move={null}
      moveAnnotation={null}
      onClick={() => onSelect(-1)}
      isSelected={selectedMoveIndex === -1}
      isPreviousMove={selectedMoveIndex > -1}
    />
    {solution.map((move, index) => (
      <SolutionMoveButton
        key={index}
        move={move}
        moveAnnotation={eoAnnotation[index]}
        onClick={() => onSelect(index)}
        onMouseEnter={() => onHover(index)}
        onMouseLeave={() => onHover(null)}
        isSelected={selectedMoveIndex === index}
        isPreviousMove={selectedMoveIndex > index}
      />
    ))}
    </Wrap>
  )

  const mobileScrubber = (
    <Box pt={8} px={2} display={{ md: "none" }}>
      <Slider value={selectedMoveIndex} min={-1} max={solution.length - 1} onChange={onSelect}>
        {solution.length && (
          <SliderMark value={-1} ml="-0.75rem" mt="-3.15rem">
            <SolutionMoveLabel
              move={null}
              moveAnnotation={null}
              isSelected={selectedMoveIndex === -1}
              isPreviousMove={selectedMoveIndex > -1}
            />
          </SliderMark>
        )}
        {solution.map((move, index) => (
          <SliderMark key={index} value={index} ml="-0.75rem" mt="-3.3rem">
            <SolutionMoveLabel
              move={move}
              moveAnnotation={eoAnnotation[index]}
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
  )

  return (
    <VStack align="left">
      {/* Desktop version */}
      {desktopScrubber}
      {/* Mobile version */}
      {mobileScrubber}
      <Center h={[200, 250, 350]} borderWidth="1px" borderRadius="lg" cursor="move">
        <Suspense fallback={<Spinner />}>
          <Cube moves={stateToShow} mask={mask} showEO={showEO} />
        </Suspense>
      </Center>
    </VStack>
  )
}

interface SolutionMoveLabelProps {
  move: Move | null // null signals this move is the start
  moveAnnotation: string | null
  isSelected?: boolean
  isPreviousMove?: boolean
}

function SolutionMoveLabel({ move, moveAnnotation, isSelected, isPreviousMove }: SolutionMoveLabelProps) {
  const showMoveAnnotation = moveAnnotation !== null
  return (
    <Box w={6} h={6}>
      <Center w={6} h={3} bg={showMoveAnnotation ? "#9b23eb" : undefined} color="white" borderRadius="md">
        <Text fontSize="xs">{moveAnnotation}</Text>
      </Center>
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
  moveAnnotation: string | null
  isSelected?: boolean
  isPreviousMove?: boolean
  onClick?: () => void
  onMouseEnter?: MouseEventHandler<HTMLDivElement>
  onMouseLeave?: MouseEventHandler<HTMLDivElement>
}

// For desktop
function SolutionMoveButton({ move, moveAnnotation, isSelected, isPreviousMove, onClick, onMouseEnter, onMouseLeave }: SolutionMoveButtonProps) {
  const showMoveAnnotation = moveAnnotation !== null
  return (
    <Box
      as="div"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      px="0.25rem"
      cursor="pointer"
    >
      <VStack spacing={0} position="relative">
        {showMoveAnnotation && (
          <Button
            position="absolute"
            transform="auto"
            translateY="-1rem"
            bg="#9b23eb !important"
            color="whiteAlpha.900"
            size={["xs", "xs", "sm", "md"]}
            width="1rem"
            height="1rem !important"
            fontSize="sm"
            borderBottomRadius={showMoveAnnotation ? 0 : undefined}
          >
            {moveAnnotation}
          </Button>
        )}
        <Button
          colorScheme={isSelected ? "blue" : "gray"}
          isActive={isPreviousMove}
          size={["xs", "xs", "sm", "md"]}
          width="1rem"
          borderTopRadius={showMoveAnnotation ? 0 : undefined}
        >
          {move ?? <Icon as={VscCircleFilled} />}
        </Button>
      </VStack>

    </Box>
  )
}
