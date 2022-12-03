import * as React from "react"
import { Box, Card, Container, Heading, Input, Text } from "@chakra-ui/react"
import type { Move, Mask } from "src/lib/cubeDefs"

const Cube = React.lazy(() => import("src/components/Cube/Cube"))

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
        <Heading size="md">solution</Heading>
        <Text>{ solution.join(" ") }</Text>
        {/* TODO: fix suspense not working after first render */}
        {/* is it because <Cube> loads cube.ts? */}
        <React.Suspense fallback={<p>Loading</p>}>
          <Box h={400}>
            <Cube moves={scramble} mask={mask} showEO={showEO} />
          </Box>
        </React.Suspense>
      </Card>
    </Container>
  )
}