import {
  Heading,
  HStack,
  Select,
  Stack,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Color, CubeOrientation } from "src/lib/puzzles/cube3x3";
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
    <VStack align="left" gap={4}>
      <Heading size="md">preferences</Heading>
      <Stack
        direction={{ base: "column", sm: "row" }}
        alignItems={{ sm: "center " }}
      >
        <Text mb={2}>solution orientation:</Text>
        <CrossOrientationSelect
          orientation={orientation}
          setOrientation={setOrientation}
        />
      </Stack>
      <HStack>
        <Switch
          isChecked={shortScrambles}
          onChange={() => setShortScrambles(!shortScrambles)}
        />
        <Text>short scrambles</Text>
        <HelpButton
          title="short scrambles"
          ariaLabel="info about short scrambles"
        >
          <Stack>
            <Text>
              short scrambles only scramble the cross pieces. other pieces are
              not scrambled well.
            </Text>
            <Text>
              use short scrambles for convenience when practicing just cross.
            </Text>
            <Text>
              turn off this option when practicing cross plus other pieces. for
              example, cross plus planning 1st pair
            </Text>
          </Stack>
        </HelpButton>
      </HStack>
    </VStack>
  );
}

interface CrossOrientationSelectProps {
  orientation: CubeOrientation;
  setOrientation: (orientation: CubeOrientation) => void;
}

function CrossOrientationSelect({
  orientation,
  setOrientation,
}: CrossOrientationSelectProps) {
  const topColor = orientation[0] as Color;
  const frontColor = orientation[1] as Color;

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
