import {
  Box,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { isValidNFlip } from "src/lib/cubeLib"

interface SelectNFlipProps {
  nFlip: number
  onSelectNFlip: (nFlip: number) => void
}

const N_FLIPS = [0, 2, 4, 6, 8, 10, 12] as const

// generated with https://cssgradient.io/ and https://meyerweb.com/eric/tools/color-blend/#:::hex
const sliderGradient = "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(222,182,248,1) 16.6%, rgba(238,218,252,1) 33.3%, rgba(188,108,242,1) 50%, rgba(205,145,245,1) 66.6%, rgba(155,35,235,1) 83.3%)"

export default function SelectNFlip({ nFlip, onSelectNFlip }: SelectNFlipProps) {
  if (nFlip && !isValidNFlip(nFlip)) {
    console.error("<SelectNFlip />: nFlip must be an even integer from 0 to 12 inclusive", nFlip)
  }

  return (
    <Box mb="1rem !important">
      <Slider
        value={nFlip}
        onChange={onSelectNFlip}
        min={0}
        max={12}
        step={2}
      >
        {N_FLIPS.map(n => (
          <SliderMark key={n} value={n} w={6} ml={-3} mt={2}>
            <Text align="center" fontSize={["md", "lg"]}>{n}</Text>
          </SliderMark>
        ))}
        <SliderTrack bgGradient={sliderGradient}>
          <SliderFilledTrack bg={useColorModeValue("blue.500", "blue.200")} />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </Box>
  )
}
