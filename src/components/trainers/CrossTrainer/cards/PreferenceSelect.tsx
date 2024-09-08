import {
  Box,
  Heading,
  HStack,
  Select,
  Spacer,
  Stack,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";
import { CubeOrientation } from "src/lib/puzzles/cube3x3";
import HelpButton from "../../common/HelpButton";

export interface PreferenceSelectProps {
  orientation: CubeOrientation;
  setOrientation: (orientation: CubeOrientation) => void;
  shortScrambles: boolean;
  setShortScrambles: (shortScrambles: boolean) => void;
  chooseExecutionAngle: boolean;
  setChooseExecutionAngle: (chooseExecutionAngle: boolean) => void;
}

export default function PreferenceSelect({
  orientation,
  setOrientation,
  shortScrambles,
  setShortScrambles,
  chooseExecutionAngle,
  setChooseExecutionAngle,
}: PreferenceSelectProps) {
  return (
    <VStack align="left" gap={4}>
      <Heading size="md">preferences</Heading>
      <Stack
        direction={{ base: "column", sm: "row" }}
        alignItems={{ sm: "center " }}
      >
        <Text>cross color:</Text>
        <CrossOrientationSelect
          orientation={orientation}
          setOrientation={setOrientation}
        />
      </Stack>
      <Box w="min-content">
        <HStack>
          <Switch
            isChecked={!shortScrambles}
            onChange={() => setShortScrambles(!shortScrambles)}
          />
          <Text whiteSpace="nowrap">scramble all pieces</Text>
          <Spacer />
          <HelpButton
            modalTitle="scramble all pieces"
            buttonAriaLabel="info about scrambling all pieces"
          >
            <Stack>
              <Text>
                by default, the scrambles are conveniently short but only
                scramble the cross pieces.
              </Text>
              <Text>
                if this option is enabled, scrambles will scramble the entire
                cube. useful for planning cross + 1 pair, xcross and more!
              </Text>
            </Stack>
          </HelpButton>
        </HStack>
        <HStack>
          <Switch
            isChecked={chooseExecutionAngle}
            onChange={() => setChooseExecutionAngle(!chooseExecutionAngle)}
          />
          <Text whiteSpace="nowrap">choose best angle</Text>
          <Spacer />
          <HelpButton
            modalTitle="choose best angle"
            buttonAriaLabel="info about the 'choose best angle' setting"
          >
            <Stack>
              <Text>
                there are four different angles we can execute a cross solution.
                with the cross on bottom, we can face one of four different
                sides.
              </Text>
              <Text>
                when this option is enabled, crystalcube will choose the angle
                it thinks is faster to execute. it minimizes F and B moves in
                the solution.
              </Text>
              <Text>
                turn off this option if focusing only on efficiency rather than
                execution.
              </Text>
            </Stack>
          </HelpButton>
        </HStack>
      </Box>
    </VStack>
  );
}

interface CrossOrientationSelectProps {
  orientation: CubeOrientation;
  setOrientation: (orientation: CubeOrientation) => void;
}

// TODO: remove
function CrossOrientationSelect({
  orientation,
  setOrientation,
}: CrossOrientationSelectProps) {
  return (
    <Select
      value={orientation}
      onChange={(e) => setOrientation(e.target.value as CubeOrientation)}
      variant="filled"
      maxWidth="12rem"
    >
      <option value="YB">white cross</option>
      <option value="WG">yellow cross</option>
      <option value="GY">blue cross</option>
      <option value="BW">green cross</option>
      <option value="RG">orange cross</option>
      <option value="OG">red cross</option>
    </Select>
  );
}
