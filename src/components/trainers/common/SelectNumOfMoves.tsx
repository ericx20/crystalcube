import {
  Box,
  Slider,
  SliderMark,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  Icon,
} from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/system";
import { range } from "lodash";
import { VscCircleFilled } from "react-icons/vsc";

export interface SelectNumOfMovesProps {
  numOfMoves: number;
  setNumOfMoves: (nMove: number) => void;
  minNumOfMoves: number;
  maxNumOfMoves: number;
}

export function SelectNumOfMoves({
  numOfMoves,
  setNumOfMoves,
  minNumOfMoves,
  maxNumOfMoves,
}: SelectNumOfMovesProps) {
  return (
    <Box mb="1rem !important">
      <Slider
        value={numOfMoves}
        onChange={setNumOfMoves}
        min={minNumOfMoves}
        max={maxNumOfMoves}
        step={1}
      >
        {range(minNumOfMoves, maxNumOfMoves + 1).map((n) => (
          <SliderMark key={n} value={n} w={6} ml={-3} mt={2}>
            <Text align="center" fontSize={["md", "lg"]}>
              {n}
            </Text>
          </SliderMark>
        ))}
        <SliderTrack>
          <SliderFilledTrack bg={useColorModeValue("blue.500", "blue.200")} />
        </SliderTrack>
        <SliderThumb boxSize={5}>
          <Icon as={VscCircleFilled} boxSize={4} color="blue.500" />
        </SliderThumb>
      </Slider>
    </Box>
  );
}
