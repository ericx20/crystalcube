import {
  Card,
  Container,
  Heading,
  Image,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function TrainerPage() {
  const artworkOpacity = useColorModeValue(1, 0.9);
  return (
    <Container maxW="container.md">
      <VStack>
        <Heading size="lg" textAlign="center" my={8}>
          crystalcube trainers
        </Heading>
        <Stack direction={{ base: "column", md: "row" }} gap={8}>
          <Card
            as={Link}
            to="/train/cross"
            p="1.5rem"
            flex={1}
            display="flex"
            alignItems="center"
          >
            <Heading size="md">CFOP cross trainer</Heading>
            <Image
              maxW="12rem"
              src="/assets/cross.svg"
              opacity={artworkOpacity}
              transition="filter 0.1s ease-in"
              _hover={{
                filter:
                  "drop-shadow(0 0 10px rgb(212, 131, 242)) saturate(1.15)",
              }}
              m={4}
            />
            <Text textAlign="center">
              improve your cross efficiency and cross-to-F2L transition
            </Text>
          </Card>
          <Card
            as={Link}
            to="/train/eo"
            p="1.5rem"
            flex={1}
            alignItems="center"
          >
            <Heading size="md">ZZ EO trainer</Heading>

            <Image
              maxW="12rem"
              src="/assets/eo.svg"
              opacity={artworkOpacity}
              transition="filter 0.1s ease-in"
              _hover={{
                filter:
                  "drop-shadow(0 0 10px rgb(212, 131, 242)) saturate(1.15)",
              }}
              m={4}
            />
            <Text textAlign="center">
              improve your EO step efficiency with powerful EO visualizer
            </Text>
          </Card>
        </Stack>
      </VStack>
    </Container>
  );
}
