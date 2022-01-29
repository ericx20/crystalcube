import * as React from "react"
import {
  Box,
  Button,
  Text,
} from "@chakra-ui/react"
import { Alg } from "cubing/alg";
import { randomScrambleForEvent } from "cubing/scramble"
import { translateToOH } from "./utils/translateToOH";

export const OHScramble = () => {
  const [scramble, setScramble] = React.useState(new Alg(""))

  const getNewScramble = React.useCallback(async () => {
    setScramble(translateToOH(await randomScrambleForEvent("333")))
  }, [])

  const keyDownHandler = (event: KeyboardEvent) => {
    if (event.key === " ") {
      getNewScramble()
    }
  };

  React.useEffect(() => {
    getNewScramble()
    window.addEventListener('keydown', keyDownHandler)
    return () => {
      window.removeEventListener('keydown', keyDownHandler)
    }
  }, [getNewScramble])

  return (
    <Box>
      <Text>{scramble.toString()}</Text>
      <Button onClick={() => getNewScramble()}>Generate!</Button>
    </Box>
  )
}