import { Cube } from "src/components/Cube/Cube"
import { Card, Container, Heading, Text } from "@chakra-ui/react"
import type { Move, Mask } from "src/lib/cubeDefs"

interface SolutionViewerProps {
  scramble: Array<Move>
  solution: Array<Move>
  mask?: Mask
  showEO?: boolean
}

export default function SolutionViewer({ scramble, solution, mask, showEO }: SolutionViewerProps) {
  return (
    <Container maxW="container.lg">
      <Card p="1.5rem" /* style={{ filter: "blur(15px)" }} */>
        <Heading size="lg">solution</Heading>
        <Text>{ solution.join(" ") }</Text>
        <Cube moves={scramble} mask={mask} showEO={showEO} />
      </Card>
    </Container>
  )
}