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

export interface PreferenceSelectProps {
  orientation: CubeOrientation;
  setOrientation: (orientation: CubeOrientation) => void;
  shortScrambles: boolean;
  setShortScrambles: (shortScrambles: boolean) => void;
}

export default function PreferenceSelect({
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
                shorter scrambles are more convenient. however, they only
                scramble the pieces that will be solved. the other pieces are
                not scrambled randomly.
              </Text>
              <Text>
                turn off this option when other pieces matter (for example
                planning 1st pair after EOCross). longer scrambles will scramble
                all pieces randomly.
              </Text>
            </Stack>
          </HelpButton>
        </HStack>
      </Flex>
    </TrainerCard>
  );
}
