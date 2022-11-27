import { Card, Container, Heading, Text } from "@chakra-ui/react"
import type { Move } from "src/lib/cubeDefs"

interface ScrambleViewerProps {
  scramble: Array<Move>,
}

export default function ScrambleViewer({ scramble }: ScrambleViewerProps) {
  return (
    <Container maxW="container.lg">
      <Card p="1.5rem">
        <Heading size="md">scramble</Heading>
        <Text>{ scramble.join(" ") }</Text>
      </Card>
    </Container>
  )
}