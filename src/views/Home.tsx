import { Button, Heading, SlideFade, Text, VStack } from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"
export const Home = () => (
  <SlideFade in>
    <VStack>
      <Heading>crystalcube</Heading>
      <Text>
        err0r's online cubing tools
      </Text>
      <RouterLink to="tools/ohscramble/">
        <Button>one handed scrambles</Button>
      </RouterLink>
    </VStack>
  </SlideFade>
)