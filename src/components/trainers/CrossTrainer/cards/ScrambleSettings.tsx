import {
  Checkbox,
  FormLabel,
  Heading,
  HStack,
  Select,
  VStack,
} from "@chakra-ui/react";
import { CubeOrientation } from "src/lib/puzzles/cube3x3";
import { ColorNeutrality, CrossStep, LevelMode } from "../types";

export interface ScrambleSettingsProps {
  crossStep: CrossStep;
  setCrossStep: (step: CrossStep) => void;
  colorNeutrality: ColorNeutrality;
  setColorNeutrality: (colorNeutrality: ColorNeutrality) => void;

  // levelMode: LevelMode;
  // setLevelMode: (mode: LevelMode) => void;
  // numOfMoves: number;
  // setNumOfMoves: (num: number) => void;
  // minNumOfMoves: number;
  // maxNumOfMoves: number;
  solutionOrientations: CubeOrientation[];
  setSolutionOrientations: (orientations: CubeOrientation[]) => void;
}

export default function ScrambleSettings({
  crossStep,
  setCrossStep,
  colorNeutrality,
  setColorNeutrality,
  solutionOrientations,
  setSolutionOrientations,
}: ScrambleSettingsProps) {
  const isXCross = crossStep === "XCross";
  return (
    <VStack align="left" gap={4}>
      <Heading size="md">scramble settings</Heading>
      <Checkbox
        isChecked={isXCross}
        onChange={() => setCrossStep(isXCross ? "Cross" : "XCross")}
      >
        XCross
      </Checkbox>
      <HStack>
        <FormLabel htmlFor="select-color-neutrality">
          color neutrality
        </FormLabel>
        <Select
          id="select-color-neutrality"
          value={colorNeutrality}
          onChange={(e) =>
            setColorNeutrality(e.target.value as ColorNeutrality)
          }
          variant="filled"
          width="12rem"
        >
          <option value="fixed">fixed</option>
          <option value="dual">dual</option>
          <option value="full">full</option>
        </Select>
      </HStack>
      <HStack>
        {/* TODO: only show this for fixed color neutrality */}
        <FormLabel htmlFor="select-fixed-cross-color">cross color</FormLabel>
        <Select
          id="select-fixed-cross-color"
          value={solutionOrientations[0]}
          onChange={(e) =>
            setSolutionOrientations([e.target.value as CubeOrientation])
          }
          variant="filled"
          width="12rem"
        >
          <option value="YB">white cross</option>
          <option value="WG">yellow cross</option>
          <option value="GY">blue cross</option>
          <option value="BW">green cross</option>
          <option value="RG">orange cross</option>
          <option value="OG">red cross</option>
        </Select>
      </HStack>
    </VStack>
  );
}
