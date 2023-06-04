import { CheckIcon, CloseIcon, EditIcon, CopyIcon, TriangleUpIcon, TriangleDownIcon } from "@chakra-ui/icons"
import { Box, Button, FormControl, FormErrorMessage, Heading, IconButton, Input, Spinner, Text, Center, useColorModeValue, Spacer, Flex, Switch } from "@chakra-ui/react"
import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { Suspense, useEffect, useState } from "react"
import { isFaceMove, moveSeqToString, parseNotation, replaceBadApostrophes, simplifyMoves } from "src/lib"
import type { Mask, Move, MoveSeq } from "src/lib/types"
import Cube from "../Cube/Cube"
import TrainerCard from "./common/TrainerCard"

interface SolutionEditorProps {
  scramble: MoveSeq
  solution: MoveSeq
  setSolution: (newSolution: MoveSeq) => void
  mask?: Mask
  showEO?: boolean
}

const VCInputAtom = atomWithStorage<boolean>("vc-input", false)

export default function SolutionEditor({ scramble, solution, setSolution, mask, showEO }: SolutionEditorProps) {
  const [isEditing, setEditing] = useState(false)
  const [inputSolution, setInputSolution] = useState("")
  const [showCube, setShowCube] = useState(false)
  const inputIsInvalid = inputSolution !== "" && !inputSolution.trim().split(" ").every(token => isFaceMove(token as Move))

  const cubeBackground = useColorModeValue("gray.200", undefined)

  const [VCInput, setVCInput] = useAtom(VCInputAtom)

  useEffect(() => {
    setInputSolution(solution.join(' ') + (solution.length > 0?' ':''))
  }, [solution])

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    if(VCInput && inputSolution.length < e.target.value.length){
      const inputLength = e.target.value.length
      const normalNotation = e.target.value.substring(0, inputLength-1)
      const newChar = e.target.value.charAt(inputLength-1)
      const newMove = (parseVC(newChar)??"") + ((parseVC(newChar))?" ":"")
      setInputSolution(normalNotation + newMove)
    } else {
      const filteredInputSolution = replaceBadApostrophes(e.target.value)
      setInputSolution(filteredInputSolution)
    }
  }

  const submitSolution = () => {
    if (!inputIsInvalid) {
      setSolution(simplifyMoves(parseNotation(inputSolution)))
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
        <Heading size="md">solution editor</Heading>
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
          </>
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
          </>
        )}
        <Spacer />
        <Text>VC Input</Text>
        <Switch onChange={(e)=>{setVCInput(!VCInput)}} isChecked={VCInput}></Switch>
        <Button
          onClick={() => setShowCube(!showCube)}
          size="sm"
        >
          {showCube ? "hide " : "show "} cube &nbsp;
          {showCube ? <TriangleUpIcon /> : <TriangleDownIcon />}
        </Button>
      </Flex>
      {showCube && 
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
        }
    </TrainerCard>
  )
}

function parseVC(vc: string): Move {
  const moveTable: {[name: string]: Move} = {
    "w": "B",
    "e": "L'",
    "i": "R",
    "o": "B'",
    "s": "D",
    "d": "L",
    "f": "U'",
    "g": "F'",
    "h": "F",
    "j": "U",
    "k": "R'",
    "l": "D'"
  }
  return moveTable[vc]??null;
}