import { Badge, Card, Container, Heading, Text } from "@chakra-ui/react"
import type { MoveSeq } from "src/lib/types"
import TrainerCard from "./TrainerCard"

interface ScrambleViewerProps {
  scramble: MoveSeq,
}

// TODO: show "Failed to generate scramble" message if scramble === null
export default function ScrambleViewer({ scramble }: ScrambleViewerProps) {
  return (
    <TrainerCard>
      <Text><b>scramble:</b> { scramble.join(" ") }</Text>
    </TrainerCard>
  )
}
