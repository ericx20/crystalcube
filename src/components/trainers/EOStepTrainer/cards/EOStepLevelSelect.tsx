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
import type { LevelMode, NumOfMovesConfig } from "../eoStepTypes";
import range from "lodash/range";
import { VscCircleFilled } from "react-icons/vsc";

export interface EOStepLevelSelectProps {
  levelMode: LevelMode;
  setLevelMode: (mode: LevelMode) => void;
  numOfBadEdges: number;
  setNumOfBadEdges: (num: number) => void;
  numOfMoves: number;
  setNumOfMoves: (num: number) => void;
  numOfMovesConfig: NumOfMovesConfig;
}

export default function EOStepLevelSelect({
  levelMode,
  setLevelMode,
  numOfBadEdges,
  setNumOfBadEdges,
  numOfMoves,
  setNumOfMoves,
  numOfMovesConfig,
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
          <option value="num-of-bad-edges"># of bad edges</option>
          <option value="num-of-moves"># of moves</option>
        </Select>
      </HStack>
      {levelMode === "num-of-bad-edges" && (
        <SelectNumOfBadEdges
          numOfBadEdges={numOfBadEdges}
          setNumOfBadEdges={setNumOfBadEdges}
        />
      )}
      {levelMode === "num-of-moves" && (
        <SelectNumOfMoves
          numOfMoves={numOfMoves}
          setNumOfMoves={setNumOfMoves}
          numOfMovesConfig={numOfMovesConfig}
        />
      )}
    </VStack>
  );
}

interface SelectNumOfBadEdgesProps {
  numOfBadEdges: number;
  setNumOfBadEdges: (nFlip: number) => void;
}

function SelectNumOfBadEdges({
  numOfBadEdges,
  setNumOfBadEdges,
}: SelectNumOfBadEdgesProps) {
  const BAD_EDGE_OPTIONS = [0, 2, 4, 6, 8, 10, 12] as const;

  // generated with https://cssgradient.io/ and https://meyerweb.com/eric/tools/color-blend/#:::hex
  const sliderGradient =
    "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(238,218,252,1) 16.67%, rgba(222,182,248,1) 33.33%, rgba(155,35,235,1) 50%, rgba(188,108,242,1) 66.67%, rgba(172,72,238,1) 83.33%, rgba(205,145,245,1) 100%)";

  return (
    <Box mb="1rem !important">
      <Slider
        value={numOfBadEdges}
        onChange={setNumOfBadEdges}
        min={0}
        max={12}
        step={2}
      >
        {BAD_EDGE_OPTIONS.map((n) => (
          <SliderMark key={n} value={n} w={6} ml={-3} mt={2}>
            <Text align="center" fontSize={["md", "lg"]}>
              {n}
            </Text>
          </SliderMark>
        ))}
        <SliderTrack bgGradient={sliderGradient}>
          <SliderFilledTrack bg={useColorModeValue("blue.500", "blue.200")} />
        </SliderTrack>
        <SliderThumb boxSize={5}>
          <Icon as={VscCircleFilled} boxSize={4} color="blue.500" />
        </SliderThumb>
      </Slider>
    </Box>
  );
}

interface SelectNumOfMovesProps {
  numOfMoves: number;
  setNumOfMoves: (nMove: number) => void;
  numOfMovesConfig: NumOfMovesConfig;
}

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
