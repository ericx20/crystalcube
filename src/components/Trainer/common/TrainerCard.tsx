import { Container, Card, VStack } from "@chakra-ui/react";

interface TrainerCardProps {
  children: React.ReactNode
}

export default function TrainerCard({ children }: TrainerCardProps) {
  return (
    <Container maxW="container.lg">
      <Card p="1.5rem">
        <VStack align="left">
          {children}
        </VStack>
      </Card>
    </Container>
  )
}
