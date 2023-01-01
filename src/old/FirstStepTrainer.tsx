// import * as React from "react"
// import {
//   Alert,
//   AlertIcon,
//   AlertTitle,
//   AlertDescription,
//   Center,
//   FormControl,
//   FormErrorMessage,
//   Heading,
//   Input,
//   Radio,
//   RadioGroup,
//   Skeleton,
//   SlideFade,
//   Stack,
//   Text,
//   VStack,
// } from "@chakra-ui/react"
// import { isValidNotation, solve } from "src/lib/cubeLib"
// import type { Move, MoveSeq } from "src/lib/types"
//
// enum Mode {
//   EOCross = "EOCross",
//   EOLine = "EOLine",
// }

export {}

/**
 * @deprecated
 */
// export const FirstStepTrainer = () => {
//   const [scramble, setScramble] = React.useState("")
//   const [solution, setSolution] = React.useState("")
//   const [isLoading, setLoading] = React.useState(false)
//   const [mode, setMode] = React.useState(Mode.EOCross)

//   const isValid = isValidNotation(scramble)

//   React.useEffect(() => {
//     const generateSolution = async (scram: string) => {
//       setLoading(true)
//       // TODO: ASYNC IS NOT WORKING!
//       const solution = scram === "" ? "" : solve(scram.split(" ").filter(m => m) as MoveSeq, mode)!.join(" ")
//       setSolution(solution)
//       setLoading(false)
//     }
//     if (isValid) {
//       generateSolution(scramble)
//     }
//   }, [scramble, mode, isValid])

//   return (
//     <SlideFade in>
//       <Center>
//         <VStack spacing={3} maxW="lg">
//           <Heading>first step solver</Heading>
//           <Alert status="info">
//             <AlertIcon />
//             <AlertTitle>work in progress!</AlertTitle>
//             <AlertDescription>will be turned into a trainer</AlertDescription>
//           </Alert>
//           <FormControl isInvalid={!isValid}>
//             <Input
//               value={scramble}
//               placeholder="insert scramble"
//               _placeholder={{ opacity: 1, color: "gray.500" }}
//               onChange={(e) => setScramble(e.target.value)}
//               type="search"
//             />
//             {!isValid && (
//               <FormErrorMessage>
//                 Invalid scramble
//               </FormErrorMessage>
//             )}
//           </FormControl>
//           <RadioGroup onChange={(e: Mode) => setMode(e)} value={mode}>
//             <Stack direction='row' spacing={5}>
//               <Radio value={Mode.EOCross}>EOCross</Radio>
//               <Radio value={Mode.EOLine}>EOLine</Radio>
//             </Stack>
//           </RadioGroup>
//           <Skeleton isLoaded={!isLoading}>
//             <Text>solution: { solution }</Text>
//           </Skeleton>
//         </VStack>
//       </Center>
//     </SlideFade>
//   )
// }