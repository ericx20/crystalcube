import * as React from "react"
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Box,
  Center,
  Container,
  Collapse,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Radio,
  RadioGroup,
  SlideFade,
  Spacer,
  Stack,
  Switch,
  Text,
  VStack,
  useClipboard,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import { Alg } from "cubing/alg";
import { randomScrambleForEvent } from "cubing/scramble"
import { solve_eocross, solve_eoline, isValidHTM } from "src/utils/solver"
import { CubeViewer } from "./CubeViewer";

enum Mode {
  EOCross = "EOCross",
  EOLine = "EOLine",
}

const solverMap: Record<Mode, (scram: string) => Promise<string>> = {
  EOCross: solve_eocross,
  EOLine: solve_eoline,
}

// const scrambleIsValid = (scram: string) => {
//   const tokens = scram.trim().split(" ")
//   return scram === "" || tokens.every((token) => token.match(/[RULDFB]['2]?$/g));
// }

export const EOCross = () => {
  const [scramble, setScramble] = React.useState("")
  const [solution, setSolution] = React.useState("")
  const [mode, setMode] = React.useState(Mode.EOCross)

  const generateSolution = async (scram: string) => {
    const solver = solverMap[mode]
    setSolution(await solver(scram))
  }

  const isValid = isValidHTM(scramble)

  React.useEffect(() => {
    if (isValid) {
      generateSolution(scramble)
    }
  }, [scramble, mode])

  return (
    <SlideFade in>
      <Center>
        <VStack spacing={3} maxW="lg">
          <Heading>EOCross solver</Heading>
          <Alert status="info">
            <AlertIcon />
            <AlertTitle>Work in progress!</AlertTitle>
            <AlertDescription>Will be turned into a trainer</AlertDescription>
          </Alert>
          <FormControl isInvalid={!isValid}>
            <Input
              value={scramble}
              placeholder="Insert scramble"
              _placeholder={{ opacity: 1, color: "gray.500" }}
              onChange={(e) => setScramble(e.target.value)}
              type="search"
            />
            {!isValid && (
              <FormErrorMessage>
                Invalid scramble
              </FormErrorMessage>
            )}
          </FormControl>
          <RadioGroup onChange={(e: Mode) => setMode(e)} value={mode}>
            <Stack direction='row' spacing={5}>
              <Radio value={Mode.EOCross}>EOCross</Radio>
              <Radio value={Mode.EOLine}>EOLine</Radio>
            </Stack>
          </RadioGroup>
          <Text>Solution: { solution }</Text>
        </VStack>
      </Center>
    </SlideFade>
  )
}