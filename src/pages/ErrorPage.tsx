import { Button, Heading, VStack, Text } from "@chakra-ui/react";
import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <VStack h="100vh">
        <Heading mt={8} size="lg">
          page not found!
        </Heading>
        <Button as={Link} to="/" colorScheme="blue">
          go home
        </Button>
      </VStack>
    );
  } else if (error instanceof Error) {
    return (
      <VStack h="100vh">
        <Heading mt={8} size="lg">
          an error has occurred!
        </Heading>
        <Text>error: {error.message}</Text>
      </VStack>
    );
  } else {
    return null;
  }
}
