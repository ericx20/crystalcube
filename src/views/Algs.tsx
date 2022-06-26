import * as React from "react";
import { Heading, SlideFade } from "@chakra-ui/react";
import { FourLookLastLayer } from "src/algs/FourLookLastLayer";
import { AlgSheetViewer } from "src/components/AlgSheetViewer";
// const AlgCaseViewer = ({ puzzle, algCase, stickering, mode }: { puzzle: PuzzleID, algCase: AlgCase, stickering: ExperimentalStickering | "image", mode: "2D" | "3D" | "experimental-2D-LL" }) => {
//   return (
//     <Box
//       bg='white'
//       rounded='12px'
//       shadow='base'
//       p='20px'
//       _dark={{ bg: 'gray.700' }}
//     >
//       <HStack spacing="24px">
//         <Box boxSize="120px">
//           <CubeViewer puzzle={puzzle} alg={algCase.setup} isSetup={true} stickering={stickering} mode={mode} imageUrl={algCase.imageUrl}/>
//         </Box>
//         <Box>
//           <Heading size="md">{algCase.name}</Heading>
//           {algCase.algs.map((alg: AlgString) => {
//             return <Text fontSize="md" key={alg}>{alg}</Text>
//           })}
//         </Box>
//       </HStack>

//     </Box>
//   )
// }


export const Algs = () => (
  <SlideFade in>
    <Heading textAlign={"center"}>algs</Heading>
    {/* TODO: tweak the grid and make the layout of everything nicer */}
    <AlgSheetViewer algSheet={FourLookLastLayer} />
  </SlideFade>
)