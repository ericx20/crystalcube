import { Heading, Select, HStack, VStack } from "@chakra-ui/react";
import type { LevelMode } from "../types";
import { SelectNumOfMoves } from "../../common/SelectNumOfMoves";

export interface CrossLevelSelectProps {
  levelMode: LevelMode;
  setLevelMode: (mode: LevelMode) => void;
  numOfMoves: number;
  setNumOfMoves: (num: number) => void;
  minNumOfMoves: number;
  maxNumOfMoves: number;
}

export default function CrossLevelSelect({
  levelMode,
  setLevelMode,
  numOfMoves,
  setNumOfMoves,
  minNumOfMoves,
  maxNumOfMoves,
}: CrossLevelSelectProps) {
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
          minNumOfMoves={minNumOfMoves}
          maxNumOfMoves={maxNumOfMoves}
        />
      )}
    </VStack>
  );
}
