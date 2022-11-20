import { Box, Button, Center, Container, Heading, SlideFade, Text, VStack } from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"
import { Cube } from "src/components/Cube/Cube"
export const Home = () => (
  <SlideFade in>
    <Center>
      <Container maxW='container.md'>
        <VStack>
          <Heading>crystalcube</Heading>
          <Box h={300}>
            <Cube />
          </Box>
          {/* <Text>
            err0r's online cubing tools
          </Text> */}
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