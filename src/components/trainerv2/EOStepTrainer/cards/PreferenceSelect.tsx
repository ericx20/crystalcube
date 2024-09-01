import TrainerCard from "../../common/TrainerCard";
import {
  Box,
  Flex,
  Heading,
  HStack,
  Stack,
  Switch,
  Text,
} from "@chakra-ui/react";
import OrientationSelect from "../../common/OrientationSelect";
import { CubeOrientation } from "src/libv2/puzzles/cube3x3";
import HelpButton from "../../common/HelpButton";
import { EOStep } from "../eoStepTypes";

export interface PreferenceSelectProps {
  eoStep: EOStep;
  orientation: CubeOrientation;
  setOrientation: (orientation: CubeOrientation) => void;
  shortScrambles: boolean;
  setShortScrambles: (shortScrambles: boolean) => void;
}

export default function PreferenceSelect({
  eoStep,
  orientation,
  setOrientation,
  shortScrambles,
  setShortScrambles,
}: PreferenceSelectProps) {
  return (
    <TrainerCard>
      <Flex gap={6} flexDirection="column">
        <Heading size="md">preferences</Heading>
        <Box>
          <Text fontSize="lg" mb={2}>
            solution orientation:
          </Text>
          <Stack direction={{ base: "column", sm: "row" }}>
            <OrientationSelect
              orientation={orientation}
              setOrientation={setOrientation}
            />
          </Stack>
        </Box>
        <HStack>
          <Switch
            isChecked={shortScrambles}
            onChange={() => setShortScrambles(!shortScrambles)}
          />
          <Text fontSize="lg">short scrambles</Text>
          <HelpButton
            title="short scrambles"
            ariaLabel="info about short scrambles"
          >
            <Stack>
              <Text>
                short scrambles only scramble the {eoStep} pieces. other pieces
                are not scrambled well.
              </Text>
              <Text>
                use short scrambles for convenience when practicing just{" "}
                {eoStep}.
              </Text>
              <Text>
                turn off this option when practicing {eoStep} plus other pieces.
                for example, planning EOCross + first ZZF2L pair.
              </Text>
            </Stack>
          </HelpButton>
        </HStack>
      </Flex>
    </TrainerCard>
  );
}
