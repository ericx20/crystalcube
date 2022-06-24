import * as React from "react"
import { Box, Grid, Heading, HStack, Text} from "@chakra-ui/react"
import { CubeViewer } from "../components/CubeViewer";
import { ExperimentalStickering, PuzzleID } from "cubing/twisty"
// Currently a work in progress, just testing a lot of things

type AlgString = string;

// let's define some types
interface AlgSheet {
  name: string;
  // id: string; // unique ID
  description?: string;
  algSet: AlgSet;
  puzzle: PuzzleID;
}

interface AlgSet {
  name: string;
  // id: string;
  description?: string;
  items: AlgCase[] | AlgSet[];
  // TODO: actually we don't need this | "image" part, just make it so whenever an alg case has an imageUrl defined, that will override the visualcube
  // also make it optional, so if no stickering specified just use "full"
  stickering: ExperimentalStickering | "image"; // need to figure this out, basically its the set of pieces/stickers that the algset concerns with
  // if it's pll, it's the whole cube. if it's oll, it's all f2l pieces and top face stickers
}

interface AlgCase {
  name: string;
  // id: string;
  imageUrl?: string;
  setup: AlgString;
  algs: AlgString[];
}

const AA_PERM: AlgCase = {
  name: "Aa",
  setup: "x R' U R' D2 R U' R' D2 R2 x'",
  algs: ["x R' U R' D2 R U' R' D2 R2 x'", "y x' R2 D2 R' U' R D2 R' U R' x"]
}

const AB_PERM: AlgCase = {
  name: "Ab",
  setup: "x R2 D2 R U R' D2 R U' R x'",
  algs: ["x R2 D2 R U R' D2 R U' R x'", "y' x L U' L D2 L' U L D2 L2"],
}

const CMLL_L2: AlgCase = {
  name: "Front Commutator",
  setup: "R U2 R D R' U2 R D' R2'",
  algs: ["R U2 R D R' U2 R D' R2'"],
}

const FTO_TEST: AlgCase = {
  name: "FTO Test",
  setup: "R BR F U",
  algs: ["R BR F U"],
}

const KING: AlgCase = {
  name: "King",
  setup: "",
  algs: ["meowmeowmeow"],
  imageUrl: "https://cdn.discordapp.com/icons/885148842411036712/23980a8503cca7b29db4a5241550ec59.webp?size=240",
}

const HARLEY: AlgCase = {
  name: "Harley",
  setup: "",
  algs: ["mrrp"],
  imageUrl: "https://cdn.discordapp.com/attachments/977827257106198578/985611390238744596/IMG-20210912-WA0004.jpg",
}

const COSMO: AlgCase = {
  name: "Cosmo",
  setup: "",
  algs: ["handsome"],
  imageUrl: "https://cdn.discordapp.com/attachments/455708462870167556/986771938938589224/Snapchat-766518111.jpg",
}


const ThreeCornerCycles: AlgSet = {
  name: "3-corner cycles",
  description: "I'm ugli!",
  items: [AA_PERM, AB_PERM],
  stickering: "full",
}

const UgliSheet: AlgSheet = {
  name: "PLL",
  puzzle: "3x3x3",
  description: "only A perms so far",
  algSet: ThreeCornerCycles,
}

const AlgCaseViewer = ({ puzzle, algCase, stickering, mode }: { puzzle: PuzzleID, algCase: AlgCase, stickering: ExperimentalStickering | "image", mode: "2D" | "3D" | "experimental-2D-LL" }) => {
  return (
    <Box
      bg='white'
      rounded='12px'
      shadow='base'
      p='20px'
      _dark={{ bg: 'gray.700' }}
    >
      <HStack spacing="24px">
        <Box boxSize="120px">
          <CubeViewer puzzle={puzzle} alg={algCase.setup} isSetup={true} stickering={stickering} mode={mode} imageUrl={algCase.imageUrl}/>
        </Box>
        <Box>
          <Heading size="md">{algCase.name}</Heading>
          {algCase.algs.map((alg: AlgString) => {
            return <Text fontSize="md" key={alg}>{alg}</Text>
          })}
        </Box>
      </HStack>

    </Box>
  )
}
export const Algs = () => (
  <>
    <Heading textAlign={"center"}>algs</Heading>
    {/* TODO: tweak the grid and make the layout of everything nicer */}
    <Grid
      templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
      gap={5}
      pt={5}
      px={{ md: 0 }}
    >
      <AlgCaseViewer puzzle="3x3x3" algCase={AA_PERM} stickering="full" mode="experimental-2D-LL" />
      <AlgCaseViewer puzzle="3x3x3" algCase={AB_PERM} stickering="full" mode="experimental-2D-LL" />
      <AlgCaseViewer puzzle="3x3x3" algCase={AA_PERM} stickering="PLL" mode="3D" />
      <AlgCaseViewer puzzle="3x3x3" algCase={AB_PERM} stickering="PLL" mode="3D" />
      <AlgCaseViewer puzzle="3x3x3" algCase={CMLL_L2} stickering="CMLL" mode="experimental-2D-LL" />
      <AlgCaseViewer puzzle="3x3x3" algCase={CMLL_L2} stickering="CMLL" mode="3D" />
      <AlgCaseViewer puzzle="fto" algCase={FTO_TEST} stickering="experimental-fto-f2t" mode="3D" />
      <AlgCaseViewer puzzle="3x3x3" algCase={KING} stickering="image" mode="2D" />
      <AlgCaseViewer puzzle="3x3x3" algCase={HARLEY} stickering="image" mode="2D" />
      <AlgCaseViewer puzzle="3x3x3" algCase={COSMO} stickering="image" mode="2D" />

    </Grid>

  </>
)