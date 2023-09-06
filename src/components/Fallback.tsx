import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Link,
  Text,
  Button,
  VStack,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

interface FallbackProps {
  error: unknown;
}

export default function Fallback({ error }: FallbackProps) {
  const errorMessage =
    error instanceof Error ? error.message : "an unknown error occurred :(";
  const stackTrace = error instanceof Error ? error.stack ?? "" : "none";

  const errorDetails = `error message: ${errorMessage}

stack trace: ${stackTrace}`;
  const onCopy = () => navigator.clipboard.writeText(errorDetails);

  return (
    <Alert status="error">
      <AlertIcon />
      <VStack align="flex-start">
        <AlertTitle>something went wrong!</AlertTitle>
        <AlertDescription>
          please fill this{" "}
          <Link
            href="https://docs.google.com/forms/d/e/1FAIpQLSdjq3LygpYhUmzPpwStSizGqOcPH3JYeQToezyp4qK9FtZl3w/viewform"
            isExternal
            color="teal.500"
          >
            form
            <ExternalLinkIcon mx="2px" />
          </Link>
          so we can fix it
        </AlertDescription>
        <Button onClick={onCopy}>copy error details</Button>
      </VStack>
    </Alert>
  );
}
