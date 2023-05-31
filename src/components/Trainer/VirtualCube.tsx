import { CheckIcon, CloseIcon, EditIcon, CopyIcon, TriangleUpIcon, TriangleDownIcon } from "@chakra-ui/icons"
import { Box, Button, FormControl, FormErrorMessage, Heading, IconButton, Input, Stack, Spinner, Text, Center, useColorModeValue, Spacer, Flex, Container } from "@chakra-ui/react"
import { Suspense, useEffect, useState } from "react"
import { isFaceMove, moveSeqToString, parseNotation, replaceBadApostrophes } from "src/lib"
import type { Mask, Move, MoveSeq } from "src/lib/types"
import Cube from "../Cube/Cube"
import TrainerCard from "./common/TrainerCard"

interface VirtualCubeProps {
  scramble: MoveSeq
  solution: MoveSeq
  setSolution: (newSolution: MoveSeq) => void
  mask?: Mask
  showEO?: boolean
}

// TODO: show "Failed to generate solution" message if solution === null
export default function VirtualCube({ scramble, solution, setSolution, mask, showEO }: VirtualCubeProps) {
  const [isEditing, setEditing] = useState(false)
  const [inputSolution, setInputSolution] = useState("")
  const [showCube, setShowCube] = useState(false)
  // const inputIsInvalid = !isValidNotation(inputSolution)
  // TODO: make solver handle solutions that change cube orientation
  // for now, only HTM solutions are ok
  const inputIsInvalid = inputSolution !== "" && !inputSolution.trim().split(" ").every(token => isFaceMove(token as Move))

  const cubeBackground = useColorModeValue("gray.200", undefined)

  // reset the input whenever a new solution is set
  useEffect(() => {
    setInputSolution("")
  }, [solution])

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    const filteredInputSolution = replaceBadApostrophes(e.target.value)
    setInputSolution(filteredInputSolution)
  }

  const submitSolution = () => {
    if (!inputIsInvalid) {
      setSolution(parseNotation(inputSolution))
      setEditing(false)
    }
  }

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault()
    submitSolution()
  }

  const copySolution = () => {
    navigator.clipboard.writeText(solution.join(" "))
  }

  return (
    <TrainerCard>
      <Flex minWidth='max-content' direction="row" alignItems='center' gap='2'>
        <Heading size="md">virtual cube</Heading>
        <Text>x2</Text>
        {isEditing ? (
          <>
            <form onSubmit={handleFormSubmit}>
              <FormControl isInvalid={inputIsInvalid}>
                <Input
                  value={inputSolution}
                  onChange={handleInputChange}
                  autoFocus
                />
                {inputIsInvalid && (
                  <FormErrorMessage
                    position="absolute"
                    mt="0.25rem"
                  >
                    invalid solution
                  </FormErrorMessage>
                )}
              </FormControl>
            </form>
            <IconButton onClick={submitSolution} size="sm" icon={<CheckIcon />} aria-label="submit solution" />
            <IconButton onClick={() => setEditing(false)} size="sm" icon={<CloseIcon />} aria-label="cancel editing solution" />
            <Spacer />
            <Button
              onClick={() => setShowCube(!showCube)}
              size="sm"
            >
              {showCube ? "hide " : "show "} cube &nbsp;
              {showCube ? <TriangleUpIcon /> : <TriangleDownIcon />}
            </Button></>
        ) : (
          <>
            <Box><Text>{moveSeqToString(solution)}</Text></Box>
            <IconButton
              onClick={() => setEditing(true)}
              size="sm"
              icon={<EditIcon />}
              aria-label="edit solution"
            />
            <IconButton
              onClick={() => copySolution()}
              size="sm"
              icon={<CopyIcon />}
              aria-label="copy solution"
            />
            <Spacer />
            <Button
              onClick={() => setShowCube(!showCube)}
              size="sm"
            >
              {showCube ? "hide " : "show "} cube &nbsp;
              {showCube ? <TriangleUpIcon /> : <TriangleDownIcon />}
            </Button></>
        )}
      </Flex>
      {showCube ?
        (
          <Center
            h={[200, 250, 350]}
            borderWidth="1px"
            borderRadius="lg"
            cursor="move"
            bg={cubeBackground}
          >
            <Suspense fallback={<Spinner />}>
              <Cube
                moves={scramble.concat("x2").concat(solution)}
                mask={mask}
                showEO={showEO}
                preRotation={["x2"]} />
            </Suspense>
          </Center>
        ) : (<></>)}
    </TrainerCard>
  )
}

