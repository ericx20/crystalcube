import type { NMoveScrambleConfig } from 'src/lib/types'
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
import range from "lodash/range"

interface SelectNMoveProps {
  nMove: number
  onSelectNMove: (nMove: number) => void
  nMoveScrambleConfig: NMoveScrambleConfig
}

export default function SelectNMove({
  nMove,
  onSelectNMove,
  nMoveScrambleConfig: { min, max }
}: SelectNMoveProps) {
  return (
    <Box mb="1rem !important">
      <Slider
        value={nMove}
        onChange={onSelectNMove}
        min={min}
        max={max}
        step={1}
      >
        {/* TODO */}
        {range(min, max + 1).map(n => (
          <SliderMark key={n} value={n} w={6} ml={-3} mt={2}>
            <Text align="center" fontSize={["md", "lg"]}>{n}</Text>
          </SliderMark>
        ))}
        <SliderTrack>
          <SliderFilledTrack bg={useColorModeValue("blue.500", "blue.200")} />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </Box>
  )
}
