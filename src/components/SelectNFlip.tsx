import { useEffect, useState } from "react"
import {
  Box,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
} from '@chakra-ui/react'
import { isValidNFlip } from "src/lib/cubeLib"

interface SelectNFlipProps {
  nFlip: number | null
  onSelectNFlip: (nflip: number | null) => void
}

const N_FLIPS = [0, 2, 4, 6, 8, 10, 12] as const

export default function SelectNFlip({ nFlip, onSelectNFlip }: SelectNFlipProps) {
  // const [sliderValue, setSliderValue] = useState(nFlip ?? -2)
  if (nFlip && !isValidNFlip(nFlip)) {
    console.error("<SelectNFlip />: nFlip must be even integer from 0 to 12 inclusive", nFlip)
  }
  const sliderValue = nFlip ?? -2
  const onSliderChange = (value: number) => onSelectNFlip(value === -2 ? null : value)

  return (
    <Slider
      value={sliderValue}
      onChange={onSliderChange}
      min={-2}
      max={12}
      step={2}
    >
      {N_FLIPS.map(n => (
        <SliderMark key={n} value={n}>{n}</SliderMark>
      ))}
      <SliderTrack>
        <SliderFilledTrack/>
      </SliderTrack>
      <SliderThumb boxSize={6} />
    </Slider>
  )
}
