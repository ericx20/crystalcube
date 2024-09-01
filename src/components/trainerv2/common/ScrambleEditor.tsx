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
  Tooltip,
  useClipboard,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import TrainerCard from "./TrainerCard";
import { debounce } from "lodash";

interface ScrambleViewerProps<Move> {
  isScrambleLoading?: boolean;
  scramble: Move[];
  setScramble: (newScramble: Move[]) => void;
  /** A function that parses a string into move notation, or if invalid, returns null */
  notationParser: (input: string) => Move[] | null;
}

// TODO: show "Failed to generate scramble" message if scramble === null
export default function ScrambleEditor<Move extends string>({
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
    <TrainerCard>
      <Stack
        direction={{ base: "column", md: "row" }}
        alignItems={{ base: "flex-start", md: "center" }}
      >
        <Heading size="md">scramble</Heading>
        <HStack width="100%">
          <Skeleton isLoaded={!debouncedLoading} minWidth="10rem" width="100%">
            <FormControl isInvalid={inputIsInvalid}>
              <Editable value={inputScramble}>
                <EditablePreview />
                <EditableInput
                  value={inputScramble}
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
          <Tooltip label="copied scramble!" isOpen={hasCopied} hasArrow>
            <IconButton
              onClick={onCopy}
              size="sm"
              icon={<CopyIcon />}
              aria-label="copy scramble"
            />
          </Tooltip>
        </HStack>
      </Stack>
    </TrainerCard>
  );
}
