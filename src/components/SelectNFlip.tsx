import { useEffect, useState } from "react"
import {
  Box,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Text,
} from '@chakra-ui/react'
import { isValidNFlip } from "src/lib/cubeLib"

interface SelectNFlipProps {
  nFlip: number
  onSelectNFlip: (nFlip: number) => void
}

const N_FLIPS = [0, 2, 4, 6, 8, 10, 12] as const

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
          <SliderMark key={n} value={n} w={6} ml={-3} mt={1}>
            <Text align="center" fontSize="md">{n}</Text>
          </SliderMark>
        ))}
        <SliderTrack>
          <SliderFilledTrack/>
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </Box>
  )
}
