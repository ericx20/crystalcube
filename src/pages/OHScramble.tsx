import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Container,
  Collapse,
  Flex,
  Heading,
  HStack,
  Icon,
  Text,
  Tooltip,
  Skeleton,
  Spacer,
  Switch,
  VStack,
  useColorModeValue,
  useDisclosure,
  useClipboard,
  FormLabel,
} from "@chakra-ui/react";
import { IoHandLeft, IoHandRight } from "react-icons/io5";
import { Alg } from "cubing/alg";
import { randomScrambleForEvent } from "cubing/scramble";
import { translateScrambleToOH } from "../utils/translateToOH";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useHotkeys } from "react-hotkeys-hook";
import { TwistyPlayer } from "src/components/TwistyPlayer";
import Balancer from "react-wrap-balancer";

const isLeftyAtom = atomWithStorage("isLefty", true);
const isLowercaseWideAtom = atomWithStorage("isLowercaseWide", true);

export default function OHScramble() {
  const [rawScramble, setRawScramble] = useState(new Alg(""));
  const [scramble, setScramble] = useState(new Alg(""));
  const [isLoading, setLoading] = useState(false);
  const [isLefty, setIsLefty] = useAtom(isLeftyAtom);
  const [isLowercaseWide, setLowercaseWide] = useAtom(isLowercaseWideAtom);

  const {
    onCopy,
    hasCopied,
    value: scrambleString,
    setValue: setScrambleString,
  } = useClipboard(scramble.toString());

  useEffect(() => {
    setScrambleString(scramble.toString());
  }, [scramble]);

  const { isOpen: showSettings, onToggle: toggleShowSettings } =
    useDisclosure();

  const getNewScramble = useCallback(async () => {
    // promise to generate/translate OH scramble
    // resolves to false and stops the loading spinner
    const getRawScramble = async (): Promise<false> => {
      setRawScramble(await randomScrambleForEvent("333"));
      setLoading(false);
      return false;
    };
    // promise to resolve to true after 200 ms
    const loadingTimeout = new Promise<true>((res) =>
      setTimeout(() => res(true), 200)
    );
    // show the loading spinner only if scramble takes more than 200 ms to generate
    const showLoading = await Promise.race([getRawScramble(), loadingTimeout]);
    setLoading(showLoading);
  }, []);

  useEffect(() => {
    setScramble(
      translateScrambleToOH(
        rawScramble,
        isLefty ? "left" : "right",
        isLowercaseWide
      )
    );
    console.log("original:", rawScramble.toString());
  }, [rawScramble, isLefty, isLowercaseWide]);

  useHotkeys(" ", getNewScramble, { preventDefault: true });

  useEffect(() => {
    getNewScramble();
  }, [getNewScramble]);

  const buttons = (
    <Flex w="100%">
      <Tooltip label="copied!" isOpen={hasCopied} hasArrow>
        <Button onClick={onCopy}>copy</Button>
      </Tooltip>
      <Spacer />
      <Button
        onClick={() => getNewScramble()}
        isLoading={isLoading}
        tabIndex={0}
        colorScheme="blue"
      >
        next
      </Button>
      <Spacer />
      <Button
        onClick={toggleShowSettings}
        colorScheme={showSettings ? "purple" : undefined}
      >
        settings
      </Button>
    </Flex>
  );

  const settings = (
    <Flex
      w="100%"
      bg={useColorModeValue("#EDF2F7", "#2C313D")}
      rounded="md"
      p={3}
    >
      <HStack spacing={10}>
        <HStack>
          <FormLabel htmlFor="toggle-lefty" m={0}>
            <Icon as={IoHandLeft} display="block" />
          </FormLabel>
          <Switch
            id="toggle-lefty"
            isChecked={!isLefty}
            onChange={() => setIsLefty(!isLefty)}
          />
          <FormLabel htmlFor="toggle-lefty" m={0}>
            <Icon as={IoHandRight} display="block" />
          </FormLabel>
        </HStack>
        <HStack>
          <FormLabel htmlFor="toggle-notation" m={0}>
            <Text>r</Text>
          </FormLabel>
          <Switch
            id="toggle-notation"
            isChecked={!isLowercaseWide}
            onChange={() => setLowercaseWide(!isLowercaseWide)}
          />
          <FormLabel htmlFor="toggle-notation" m={0}>
            <Text>Rw</Text>
          </FormLabel>
        </HStack>
      </HStack>
    </Flex>
  );

  return (
    <VStack spacing={3}>
      <Heading textAlign="center" size="lg" my={8}>
        one handed scrambles
      </Heading>
      <TwistyPlayer
        alg={scramble}
        visualization="2D"
        background="none"
        controlPanel="none"
      />
      <Skeleton isLoaded={!isLoading}>
        <Balancer>
          <Text
            textAlign="center"
            fontSize={isLowercaseWide ? "2xl" : { base: "lg", md: "xl" }}
          >
            {scrambleString}
          </Text>
        </Balancer>
      </Skeleton>
      <Container>{buttons}</Container>
      <Collapse in={showSettings} animateOpacity>
        {settings}
      </Collapse>
    </VStack>
  );
}
