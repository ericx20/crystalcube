import * as React from "react"
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Center,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Skeleton,
  SlideFade,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react"
// import { Alg } from "cubing/alg";
// import { randomScrambleForEvent } from "cubing/scramble"
import { solve_eocross, solve_eoline, isValidHTM } from "src/utils/solver"
// import { CubeViewer } from "./CubeViewer";

enum Mode {
  EOCross = "EOCross",
  EOLine = "EOLine",
}

const solverMap: Record<Mode, (scram: string) => Promise<string>> = {
  EOCross: solve_eocross,
  EOLine: solve_eoline,
}

export const FirstStepTrainer = () => {
  const [scramble, setScramble] = React.useState("")
  const [solution, setSolution] = React.useState("")
  const [isLoading, setLoading] = React.useState(false)
  const [mode, setMode] = React.useState(Mode.EOCross)

  const isValid = isValidHTM(scramble)

  React.useEffect(() => {
    const generateSolution = async (scram: string) => {
      setLoading(true)
      const solver = solverMap[mode]
      // TODO: ASYNC IS NOT WORKING!
      const solution = await solver(scram)
      setSolution(solution)
      setLoading(false)
    }
    if (isValid) {
      generateSolution(scramble)
    }
  }, [scramble, mode, isValid])

  return (
    <SlideFade in>
      <Center>
        <VStack spacing={3} maxW="lg">
          <Heading>first step solver</Heading>
          <Alert status="info">
            <AlertIcon />
            <AlertTitle>work in progress!</AlertTitle>
            <AlertDescription>will be turned into a trainer</AlertDescription>
          </Alert>
          <FormControl isInvalid={!isValid}>
            <Input
              value={scramble}
              placeholder="insert scramble"
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
          <Skeleton isLoaded={!isLoading}>
            <Text>solution: { solution }</Text>
          </Skeleton>
        </VStack>
      </Center>
    </SlideFade>
  )
}