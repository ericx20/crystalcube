import * as React from "react"
import {
  Button,
  Box,
  Container,
  Collapse,
  Flex,
  Heading,
  HStack,
  Icon,
  Text,
  Tooltip,
  Skeleton,
  SlideFade,
  Spacer,
  Switch,
  VStack,
  useClipboard,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import { IoHandLeft, IoHandRight } from "react-icons/io5"
import { Alg } from "cubing/alg";
import { randomScrambleForEvent } from "cubing/scramble"
import { translateToOH } from "../utils/translateToOH"
import CubeViewer from "../components/CubeViewer";
import useSpacebar from "src/hooks/useSpacebar";

export default function OHScramble() {
  const [rawScramble, setRawScramble] = React.useState(new Alg(""))
  const [scramble, setScramble] = React.useState(new Alg(""))
  const [isLoading, setLoading] = React.useState(false)
  const [isLefty, setIsLefty] = React.useState(true)
  const [isLowercaseWide, setLowercaseWide] = React.useState(true)

  const { hasCopied, onCopy } = useClipboard(scramble.toString())
  const { isOpen: showSettings, onToggle: toggleShowSettings } = useDisclosure()

  const getNewScramble = React.useCallback(async () => {
    // promise to generate/translate OH scramble
    // resolves to false and stops the loading spinner
    const getRawScramble = new Promise<false>(async (res) => {
      setRawScramble(await randomScrambleForEvent("333"))
      setLoading(false)
      res(false)
    })
    // promise to resolve to true after 200 ms
    const loadingTimeout = new Promise<true>((res) => setTimeout(() => res(true), 200))
    // show the loading spinner only if scramble takes more than 200 ms to generate
    const showLoading = await Promise.race([getRawScramble, loadingTimeout])
    setLoading(showLoading)
  }, [])

  React.useEffect(() => {
    setScramble(translateToOH(rawScramble, isLefty, isLowercaseWide))
    console.log("original:", rawScramble.toString())
  }, [rawScramble, isLefty, isLowercaseWide])

  useSpacebar(getNewScramble)

  React.useEffect(() => {
    getNewScramble()
  }, [getNewScramble])

  const Buttons = () => (
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
      >next</Button>
      <Spacer />
      <Button
        onClick={toggleShowSettings}
        colorScheme={showSettings ? "purple" : undefined}
      >settings</Button>
    </Flex>
  )

  const Settings = () => (
    <Flex w="100%" bg={useColorModeValue("#EDF2F7", "#2C313D")} rounded="md" p={3}>
      <HStack spacing={10}>
        <HStack>
          <Icon as={IoHandLeft}/>
          <Switch isChecked={!isLefty} onChange={() => setIsLefty(!isLefty)} />
          <Icon as={IoHandRight}/>
        </HStack>
        <HStack>
          <Text>r</Text>
          <Switch isChecked={!isLowercaseWide} onChange={() => setLowercaseWide(!isLowercaseWide)} />
          <Text>Rw</Text>
        </HStack>
      </HStack>
    </Flex>
  )

  return (
    <SlideFade in>
      <VStack spacing={3}>
        <Heading textAlign="center">one handed scrambles</Heading>
        <Box maxW="384px">
          <CubeViewer alg={scramble.toString()} mode="2D" />
        </Box>
        <Skeleton isLoaded={!isLoading}>
          <Text
            textAlign="center"
            fontSize={isLowercaseWide ? "2xl" : { base: "lg", md: "xl" }}
          >
            {scramble.toString()}
          </Text>
        </Skeleton>
        <Container>
          <Buttons />
        </Container>
        <Collapse in={showSettings} animateOpacity>
          <Settings />
        </Collapse>
      </VStack>
    </SlideFade>
  )
}