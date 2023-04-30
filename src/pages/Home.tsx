import {
  Button,
  Center,
  Container,
  Heading,
  Image,
  SlideFade,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import Balancer from "react-wrap-balancer";

import MockupLight from "src/assets/mockup-light.webp";
import MockupDark from "src/assets/mockup-dark.webp";
import ZZTrainer from "src/components/Trainer/ZZTrainer";

export default function Home() {
  const mockupImage = useColorModeValue(MockupLight, MockupDark);
  return (
    <SlideFade in>
      <Container maxW="container.lg" py={12}>
        <VStack spacing={6}>
          <VStack>
            <Balancer>
              <Heading textAlign="center">crystalcube</Heading>
            </Balancer>
            <Balancer>
              <Text align="center">🚧 under construction 🚧</Text>
            </Balancer>
          </VStack>
          {/* <RouterLink to="trainer/">
            <Button colorScheme="blue">start training</Button>
          </RouterLink> */}
        </VStack>
        <Center>
          <Image
            src={mockupImage}
            fit="cover"
            w="100%"
            maxW="500px"
            draggable={false}
          />
        </Center>
      </Container>
    </SlideFade>
  );
}
