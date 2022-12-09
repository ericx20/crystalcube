import * as React from "react"
import { Box, Button, Card, Container, Heading, Input, Text } from "@chakra-ui/react"
import type { Move, Mask } from "src/lib/types"

const Cube = React.lazy(() => import("src/components/Cube/Cube"))

interface SolutionViewerProps {
  scramble: Array<Move>
  solution: Array<Move> | null
  mask?: Mask
  showEO?: boolean
  children?: JSX.Element
}

export default function SolutionViewer({ scramble, solution, mask, showEO, children }: SolutionViewerProps) {
  return (
    <Container maxW="container.lg">
      <Card p="1.5rem" /* style={{ filter: "blur(15px)" }} */>
        <Heading size="md">solution</Heading>
        <Text>{ solution ? solution.join(" ") : "No solution found" }</Text>
        <React.Suspense fallback={<p>Loading...</p>}>
          <Box h={400} borderWidth="1px" borderRadius="lg">
            <Cube moves={scramble} mask={mask} showEO={showEO} />
          </Box>
        </React.Suspense>
        {children}
      </Card>
    </Container>
  )
}