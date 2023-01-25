import { Badge, Box, Card, Container, Heading, Text } from "@chakra-ui/react"
import type { MoveSeq } from "src/lib/types"
import TrainerCard from "./TrainerCard"

interface ScrambleViewerProps {
  scramble: MoveSeq,
}

// TODO: show "Failed to generate scramble" message if scramble === null
export default function ScrambleViewer({ scramble }: ScrambleViewerProps) {
  return (
    <TrainerCard>
      {/* mobile layout */}
      <Text display={{ base: "none", sm: "block"}}><b>scramble:</b> {scramble.join(" ")}</Text>
      {/* desktop layout */}
      <Box display={{ base: "block", sm: "none"}}>
        <Heading size="md">scramble</Heading>
        <Text>{scramble.join(" ")}</Text>
      </Box>
    </TrainerCard>
  )
}
