import { CopyIcon } from "@chakra-ui/icons";
import {
  Editable,
  EditableInput,
  EditablePreview,
  FormControl,
  FormErrorMessage,
  Heading,
  HStack,
  IconButton,
  Skeleton,
  Stack,
  Text,
  Tooltip,
  useClipboard,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import { IoWarning } from "react-icons/io5";

interface ScrambleViewerProps<Move> {
  scrambleFailed?: boolean;
  isScrambleLoading?: boolean;
  scramble: Move[];
  setScramble: (newScramble: Move[]) => void;
  /** A function that parses a string into move notation, or if invalid, returns null */
  notationParser: (input: string) => Move[] | null;
}

// TODO: show "Failed to generate scramble" message if scramble === null
export default function ScrambleEditor<Move extends string>({
  scrambleFailed = false,
  isScrambleLoading = false,
  scramble,
  setScramble,
  notationParser,
}: ScrambleViewerProps<Move>) {
  const [inputScramble, setInputScramble] = useState("");
  const parsedInput = notationParser(inputScramble);
  const inputIsInvalid = parsedInput === null;

  // set the input whenever a new scramble is set
  useEffect(() => {
    setInputScramble(scramble.join(" "));
  }, [scramble]);

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputScramble(e.target.value);
  };

  const submitScramble = () => {
    if (!inputIsInvalid) {
      setScramble(parsedInput);
    }
  };

  const scrambleText = scramble.join(" ");

  const { onCopy, hasCopied, setValue } = useClipboard(scrambleText);
  useEffect(() => {
    setValue(scrambleText);
  }, [scrambleText]);

  // Prevents the loading state from flickering too quickly for the user
  const TIMEOUT = 200;
  const [debouncedLoading, setDebouncedLoading] = useState(false);
  const setDebouncedLoadingTrue = useCallback(
    debounce(() => setDebouncedLoading(true), TIMEOUT),
    [setDebouncedLoading]
  );
  const setDebouncedLoadingFalse = useCallback(
    debounce(() => setDebouncedLoading(false), TIMEOUT),
    [setDebouncedLoading]
  );
  useEffect(() => {
    if (isScrambleLoading) {
      setDebouncedLoadingFalse.cancel();
      setDebouncedLoadingTrue();
    } else {
      setDebouncedLoadingTrue.cancel();
      setDebouncedLoadingFalse();
    }
  }, [isScrambleLoading]);

  return (
    <VStack align="left">
      <Stack
        direction={{ base: "column", md: "row" }}
        alignItems={{ base: "flex-start", md: "center" }}
        gap={4}
      >
        <Heading size="md">scramble</Heading>
        <HStack width="100%">
          <Skeleton isLoaded={!debouncedLoading} minWidth="10rem" width="100%">
            <FormControl isInvalid={inputIsInvalid}>
              <Editable value={inputScramble} fontSize="lg">
                <EditablePreview />
                <EditableInput
                  onChange={handleInputChange}
                  onBlur={submitScramble}
                />
              </Editable>
              {inputIsInvalid && (
                <FormErrorMessage position="absolute" mt="0.25rem">
                  invalid scramble
                </FormErrorMessage>
              )}
            </FormControl>
          </Skeleton>
          {!scrambleFailed && (
            <Tooltip label="copied scramble!" isOpen={hasCopied} hasArrow>
              <IconButton
                onClick={onCopy}
                size="sm"
                icon={<CopyIcon />}
                aria-label="copy scramble"
              />
            </Tooltip>
          )}
        </HStack>
      </Stack>
      {scrambleFailed && (
        <HStack>
          <IoWarning />
          <Text>failed to generate new scramble. please try again</Text>
        </HStack>
      )}
    </VStack>
  );
}
