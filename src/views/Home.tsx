import { Button, Center, Container, Heading, SlideFade, Text, VStack } from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"

export const Home = () => (
  <SlideFade in>
    <Center>
      <Container maxW="container.md">
        <VStack>
          <Heading>crystalcube</Heading>
          <Text>
            err0r's online cubing tools
          </Text>
          <RouterLink to="secrettestpage/">
            <Button>enter if you dare</Button>
          </RouterLink>
          {/* <RouterLink to="tools/firststep/">
            <Button>first step trainer</Button>
          </RouterLink>
          <RouterLink to="tools/ohscramble/">
            <Button>one handed scrambles</Button>
          </RouterLink> */}
          </VStack>
      </Container>
    </Center>
  </SlideFade>
)