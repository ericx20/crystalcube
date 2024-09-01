import {
  Box,
  Heading,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Text,
  useColorModeValue,
  HStack,
  Icon,
  VStack,
} from "@chakra-ui/react";
import type { LevelMode } from "../crossTypes";
import range from "lodash/range";
import { VscCircleFilled } from "react-icons/vsc";
import { NumOfMovesConfig } from "../../EOStepTrainer/eoStepTypes";

export interface EOStepLevelSelectProps {
  levelMode: LevelMode;
  setLevelMode: (mode: LevelMode) => void;
  numOfMoves: number;
  setNumOfMoves: (num: number) => void;
}

export default function CrossLevelSelect({
  levelMode,
  setLevelMode,
  numOfMoves,
  setNumOfMoves,
}: EOStepLevelSelectProps) {
  return (
    <VStack align="left">
      <HStack spacing={4}>
        <Heading size="md">level</Heading>
        <Select
          value={levelMode}
          onChange={(e) => setLevelMode(e.target.value as LevelMode)}
          variant="filled"
          maxWidth="12rem"
        >
          <option value="random">random</option>
          <option value="num-of-moves"># of moves</option>
        </Select>
      </HStack>
      {levelMode === "num-of-moves" && (
        <SelectNumOfMoves
          numOfMoves={numOfMoves}
          setNumOfMoves={setNumOfMoves}
          numOfMovesConfig={{ min: 3, max: 8 }}
        />
      )}
    </VStack>
  );
}

interface SelectNumOfMovesProps {
  numOfMoves: number;
  setNumOfMoves: (nMove: number) => void;
  // hideous prop, TODO just make it min and max
  numOfMovesConfig: { min: number; max: number };
}

// TODO: refactor out, this is common
function SelectNumOfMoves({
  numOfMoves,
  setNumOfMoves,
  numOfMovesConfig: { min, max },
}: SelectNumOfMovesProps) {
  return (
    <Box mb="1rem !important">
      <Slider
        value={numOfMoves}
        onChange={setNumOfMoves}
        min={min}
        max={max}
        step={1}
      >
        {range(min, max + 1).map((n) => (
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
