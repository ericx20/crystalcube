import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  Link,
  Text,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

interface FallbackProps {
  error: unknown;
}

export default function Fallback({ error }: FallbackProps) {
  const errorMessage =
    error instanceof Error ? error.message : "an unknown error occurred :(";
  const stackTrace = error instanceof Error ? error.stack : "none";
  const url = new URL("https://github.com/ericx20/crystalcube/issues/new");
  url.searchParams.append("title", `Error: ${errorMessage}`);
  url.searchParams.append(
    "body",
    `Describe the problem:
Operating system and browser:

Stack trace:
\`\`\`
${stackTrace}
\`\`\`
`
  );
  url.searchParams.append("labels", "bug");
  return (
    <Alert status="error">
      <AlertIcon />
      <Box>
        <AlertTitle>something went wrong:</AlertTitle>
        <AlertDescription>{errorMessage}</AlertDescription>
        <Text>
          please open an issue on{" "}
          <Link href={url.toString()} isExternal color="teal.500">
            GitHub
            <ExternalLinkIcon mx="2px" />
          </Link>
        </Text>
      </Box>
    </Alert>
  );
}
