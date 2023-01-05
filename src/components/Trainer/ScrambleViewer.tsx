import { Badge, Card, Container, Heading, Text } from "@chakra-ui/react"
import type { MoveSeq } from "src/lib/types"
import TrainerCard from "./TrainerCard"

interface ScrambleViewerProps {
  scramble: MoveSeq,
  nFlip?: number,
}

export default function ScrambleViewer({ scramble, nFlip }: ScrambleViewerProps) {
  return (
    <TrainerCard>
      <Heading size="md">
        scramble
        {nFlip !== undefined && (
          <Badge ml={2} bg="#9b23eb" variant="solid">
            {nFlip} bad edges
          </Badge>
        )}
      </Heading>
      <Text>{ scramble.join(" ") }</Text>
    </TrainerCard>
  )
}
