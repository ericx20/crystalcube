import { Button, Heading, Container } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function CfopPage() {
  return (
    <Container>
      <Heading as="h1">cfop page</Heading>
      <Heading as="h2">cross</Heading>
      <Link to="/cfop/cross">
        <Button>cross trainer</Button>
      </Link>
      <Heading as="h2">F2L</Heading>
      <Heading as="h2">OLL</Heading>
      <Link to="/cfop/2l-oll">
        <Button>2 look oll</Button>
      </Link>
      <Heading as="h2">PLL</Heading>
    </Container>
  );
}
