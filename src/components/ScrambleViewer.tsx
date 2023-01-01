import { Badge, Card, Container, Heading, Text } from "@chakra-ui/react"
import type { Move, MoveSeq } from "src/lib/types"

interface ScrambleViewerProps {
  scramble: MoveSeq,
  nFlip?: number,
}

export default function ScrambleViewer({ scramble, nFlip }: ScrambleViewerProps) {
  return (
    <Container maxW="container.lg">
      <Card p="1.5rem">
        <Heading size="md">
          scramble
          {nFlip !== undefined && (
            <Badge ml={2} bg="#9b23eb" variant="solid">
              {nFlip} bad edges
            </Badge>
          )}
        </Heading>
        
        <Text>{ scramble.join(" ") }</Text>
        {/* <FormControl isInvalid={!isValid}>
          <Input
            value={inputScram}
            _placeholder={{ opacity: 1, color: "gray.500" }}
            onChange={(e) => setInputScram(e.target.value)}
          />
          {!isValid && (
            <FormErrorMessage>
              Invalid scramble
            </FormErrorMessage>
          )}
        </FormControl> */}
      </Card>
    </Container>
  )
}
