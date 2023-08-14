import { CheckIcon, CloseIcon, EditIcon, CopyIcon } from "@chakra-ui/icons";
import {
  FormControl,
  FormErrorMessage,
  Heading,
  HStack,
  IconButton,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import TrainerCard from "./common/TrainerCard";

interface ScrambleViewerProps<Move> {
  scramble: Move[];
  setScramble: (newScramble: Move[]) => void;
  notationParser: (input: string) => Move[] | null;
}

// TODO: show "Failed to generate scramble" message if scramble === null
export default function ScrambleEditor<Move extends string>({
  scramble,
  setScramble,
  notationParser,
}: ScrambleViewerProps<Move>) {
  const [isEditing, setEditing] = useState(false);
  const [inputScramble, setInputScramble] = useState("");
  const parsedInput = notationParser(inputScramble);
  const inputIsInvalid = parsedInput === null;

  // reset the input whenever a new scramble is set
  useEffect(() => {
    setInputScramble("");
  }, [scramble]);

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputScramble(e.target.value);
  };

  const submitScramble = () => {
    if (!inputIsInvalid) {
      setScramble(parsedInput);
      setEditing(false);
    }
  };

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    submitScramble();
  };

  const copyScramble = () => {
    navigator.clipboard.writeText(scramble.join(" "));
  };

  return (
    <TrainerCard>
      <Stack
        direction={{ base: "column", md: "row" }}
        alignItems={{ base: "flex-start", md: "center" }}
      >
        <Heading size="md">scramble</Heading>
        {isEditing ? (
          <HStack>
            <form onSubmit={handleFormSubmit}>
              <FormControl isInvalid={inputIsInvalid}>
                <Input
                  value={inputScramble}
                  onChange={handleInputChange}
                  autoFocus
                />
                {inputIsInvalid && (
                  <FormErrorMessage position="absolute" mt="0.25rem">
                    invalid scramble
                  </FormErrorMessage>
                )}
              </FormControl>
            </form>
            <IconButton
              onClick={submitScramble}
              size="sm"
              icon={<CheckIcon />}
              aria-label="submit scramble"
            />
            <IconButton
              onClick={() => setEditing(false)}
              size="sm"
              icon={<CloseIcon />}
              aria-label="cancel editing scramble"
            />
          </HStack>
        ) : (
          <HStack>
            <Text>{scramble.join(" ")}</Text>
            <IconButton
              onClick={() => setEditing(true)}
              size="sm"
              icon={<EditIcon />}
              aria-label="edit scramble"
            />
            <IconButton
              onClick={() => copyScramble()}
              size="sm"
              icon={<CopyIcon />}
              aria-label="copy scramble"
            />
          </HStack>
        )}
      </Stack>
    </TrainerCard>
  );
}
