import { Button, Center, Container, Heading, SlideFade, Text, VStack } from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"

export default function Home() {
  return (
    <SlideFade in>
    <Center>
      <Container maxW="container.md">
        <VStack>
          <Heading>crystalcube</Heading>
          <Text>
            err0r's online cubing tools
          </Text>
          <RouterLink to="trainer/">
            <Button>trainer</Button>
          </RouterLink>
          </VStack>
      </Container>
    </Center>
  </SlideFade>
  )
}
