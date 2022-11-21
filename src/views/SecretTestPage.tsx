import { Cube } from "src/components/Cube/Cube"
import { Box } from "@chakra-ui/react"
import type { Move } from "src/lib/cubeDefs"
import { EOCROSS_MASK } from "src/lib/cube"

const sune: Array<Move> = ["R", "U", "R'", "U", "R", "U2", "R'"]
const scram = "R D F2 R F' D2 B L' U2 F2 R U2 L' B2 R' L2 U' D2".split(" ") as Array<Move>

export const SecretTestPage = () => (
  <Box h={400} w="100%">
    <Cube moves={scram} mask={EOCROSS_MASK} />
  </Box>
)