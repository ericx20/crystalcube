import { Container, Heading, Link, Text, VStack } from "@chakra-ui/react";

export default function AboutPage() {
  return (
    <Container maxW="container.sm">
      <VStack align="left">
        <Heading size="lg" my={8} textAlign="center">
          about crystalcuber
        </Heading>
        <Text>
          Hi, I'm crystalcuber. Cuber and software engineer. I make speedcubing
          trainers and other resources.
        </Text>
        <Text>
          If you like this website, check out the project on{" "}
          <Link
            href="https://github.com/ericx20/crystalcube"
            textDecoration="underline"
          >
            GitHub
          </Link>
          . Feedback is welcome, feel free to open an issue. Star it while
          you're at it!
        </Text>
        <Heading size="md" my={4}>
          more stuff by crystalcuber
        </Heading>
        <Link
          href="https://www.youtube.com/@crystalcuber"
          textDecoration="underline"
        >
          YouTube channel
        </Link>
        <Link href="https://www.zzmethod.com/" textDecoration="underline">
          zzmethod.com
        </Link>
      </VStack>
    </Container>
  );
}
