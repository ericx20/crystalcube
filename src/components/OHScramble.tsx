import * as React from "react"
import {
  Box,
  Button,
  Center,
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
  useClipboard,
  useColorModeValue,
  useDisclosure,
  Grid,
} from "@chakra-ui/react"
import { IoHandLeft, IoHandRight } from "react-icons/io5"
import { Handedness } from "../shared/handedness";
import { Alg } from "cubing/alg";
import { randomScrambleForEvent } from "cubing/scramble"
import { translateToOH } from "../utils/translateToOH"
import { CubeViewer } from "./CubeViewer";

export const OHScramble = () => {
  const [rawScramble, setRawScramble] = React.useState(new Alg(""))
  const [scramble, setScramble] = React.useState(new Alg(""))
  const [isLoading, setLoading] = React.useState(false)
  const [isLefty, setIsLefty] = React.useState(true)
  const [isLowercaseWide, setLowercaseWide] = React.useState(false)

  const { hasCopied, onCopy } = useClipboard(rawScramble.toString())
  const { isOpen: showSettings, onToggle: toggleShowSettings } = useDisclosure()

  const getNewScramble = React.useCallback(async () => {
    // promise to generate/translate OH scramble
    // resolves to false and stops the loading spinner
    const getTranslatedScramble = new Promise<false>(async (res) => {
      setRawScramble(await randomScrambleForEvent("333"))
      setLoading(false)
      res(false)
    })
    // promise to resolve to true after 200 ms
    const loadingTimeout = new Promise<true>((res) => setTimeout(() => res(true), 200))
    // show the loading spinner only if scramble takes more than 200 ms to generate
    const showLoading = await Promise.race([getTranslatedScramble, loadingTimeout])
    setLoading(showLoading)
  }, [])

  React.useEffect(() => {
    setScramble(translateToOH(rawScramble, isLefty, isLowercaseWide))
  }, [rawScramble, isLefty, isLowercaseWide])


  const keyDownHandler = React.useCallback((event: KeyboardEvent) => {
    if (event.key === " ") {
      event.preventDefault()
      getNewScramble()
    }
  }, [getNewScramble])

  React.useEffect(() => {
    getNewScramble()
    window.addEventListener("keydown", keyDownHandler)
    return () => {
      window.removeEventListener("keydown", keyDownHandler)
    }
  }, [getNewScramble, keyDownHandler])

  return (
      <VStack>
        <Heading textAlign="center">one handed scrambles</Heading>
        <CubeViewer alg={scramble.toString()} mode="2D" />
        <Skeleton isLoaded={!isLoading}>
          <Text textAlign="center" fontSize={isLowercaseWide ? "2xl" : "lg"}>{scramble.toString()}</Text>
        </Skeleton>
        <Flex w="100%">
          <Tooltip label="copied!" isOpen={hasCopied} hasArrow>
            <Button onClick={onCopy}>copy</Button>
          </Tooltip>
          <Spacer />
          <Button 
            onClick={() => getNewScramble()}
            isLoading={isLoading}
            tabIndex={0}
            // bg="cyan.500"
            colorScheme="blue"
            // _hover={{ bg: "cyan.400" }}
          >next</Button>
          <Spacer />
          <Button
            onClick={toggleShowSettings}
            // bg={showSettings ? "purple.500" : undefined}
            colorScheme={showSettings ? "purple" : undefined}
            // _hover={{ bg: showSettings ? "purple.400" : undefined }}
          >settings</Button>
        </Flex>
        <Collapse in={showSettings} animateOpacity>
          <Container w="100vh">
            <Flex w="100%" bg={useColorModeValue("#EDF2F7", "#2C313D")} rounded="md">
              {/* TODO: add lefty/righty icons, then separate scramble generate and translate so that changing handedness translates the same scramble differently without new scramble */}
              <Spacer />
              <HStack>
                <Icon as={IoHandLeft}/>
                <Switch isChecked={!isLefty} onChange={() => setIsLefty(!isLefty)} />
                <Icon as={IoHandRight}/>
              </HStack>
              <Spacer />
              <HStack>
                <Text>Rw</Text>
                <Switch isChecked={isLowercaseWide} onChange={() => setLowercaseWide(!isLowercaseWide)} />
                <Text>r</Text>
              </HStack>
              <Spacer />
            </Flex>
          </Container>
        </Collapse>

      </VStack>
  )
}