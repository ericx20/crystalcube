import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons"
import { FormControl, FormErrorMessage, Heading, HStack, IconButton, Input, Stack, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { isFaceMove, moveSeqToString, parseNotation, replaceBadApostrophes } from "src/lib"
import type { Move, MoveSeq } from "src/lib/types"
import TrainerCard from "./common/TrainerCard"

interface ScrambleViewerProps {
  scramble: MoveSeq
  setScramble: (newScramble: MoveSeq) => void
}

// TODO: show "Failed to generate scramble" message if scramble === null
export default function ScrambleEditor({ scramble, setScramble }: ScrambleViewerProps) {
  const [isEditing, setEditing] = useState(false)
  const [inputScramble, setInputScramble] = useState("")
  // const inputIsInvalid = !isValidNotation(inputScramble)
  // TODO: make solver handle scrambles that change cube orientation
  // for now, only HTM scrambles are ok
  const inputIsInvalid = inputScramble !== "" && !inputScramble.trim().split(" ").every(token => isFaceMove(token as Move))

  // reset the input whenever a new scramble is set
  useEffect(() => {
    setInputScramble("")
  }, [scramble])

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    const filteredInputScramble = replaceBadApostrophes(e.target.value)
    setInputScramble(filteredInputScramble)
  }

  const submitScramble = () => {
    if (!inputIsInvalid) {
      setScramble(parseNotation(inputScramble))
      setEditing(false)
    }
  }

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault()
    submitScramble()
  }

  return (
    <TrainerCard>
      <Stack
        direction={{ base: "column", md: "row" }}
        alignItems={{ base: "flex-start", md: "center" }}
      >
        <Heading size="md">scramble</Heading>
        {isEditing ? (
          <HStack>
            <form onSubmit={handleFormSubmit}>
              <FormControl isInvalid={inputIsInvalid}>
                <Input
                  value={inputScramble}
                  onChange={handleInputChange}
                  autoFocus
                />
                {inputIsInvalid && (
                  <FormErrorMessage
                    position="absolute"
                    mt="0.25rem"
                  >
                    invalid scramble
                  </FormErrorMessage>
                )}
              </FormControl>
            </form>
            <IconButton onClick={submitScramble} size="sm" icon={<CheckIcon />} aria-label="submit scramble" />
            <IconButton onClick={() => setEditing(false)} size="sm" icon={<CloseIcon />} aria-label="cancel editing scramble" />
          </HStack>
        ) : (
          <HStack>
            <Text>{moveSeqToString(scramble)}</Text>
            <IconButton
              onClick={() => setEditing(true)}
              size="sm"
              icon={<EditIcon />}
              aria-label="edit scramble"
            />
          </HStack>
        )}
      </Stack>
    </TrainerCard>
  )
}

