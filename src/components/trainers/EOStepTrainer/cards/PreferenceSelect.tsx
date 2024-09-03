import {
  Box,
  Heading,
  HStack,
  Stack,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";
import OrientationSelect from "../../common/OrientationSelect";
import { CubeOrientation } from "src/lib/puzzles/cube3x3";
import HelpButton from "../../common/HelpButton";
import { EOStep } from "../eoStepTypes";

export interface PreferenceSelectProps {
  eoStep: EOStep;
  orientation: CubeOrientation;
  setOrientation: (orientation: CubeOrientation) => void;
  shortScrambles: boolean;
  setShortScrambles: (shortScrambles: boolean) => void;
}

const eoStepFriendlyNames: { [name in EOStep]: string } = {
  EO: "EO",
  EOLine: "EOLine",
  EOCross: "EOCross",
  EOArrowBack: "EOArrow",
  EOArrowLeft: "EOArrow",
  EO222: "",
};

export default function PreferenceSelect({
  eoStep,
  orientation,
  setOrientation,
  shortScrambles,
  setShortScrambles,
}: PreferenceSelectProps) {
  const eoStepName = eoStepFriendlyNames[eoStep];
  return (
    <VStack align="left" gap={4}>
      <Heading size="md">preferences</Heading>
      <Box>
        <Text mb={2}>solution orientation:</Text>
        <Stack direction={{ base: "column", sm: "row" }}>
          <OrientationSelect
            orientation={orientation}
            setOrientation={setOrientation}
          />
        </Stack>
      </Box>
      <HStack>
        <Switch
          isChecked={!shortScrambles}
          onChange={() => setShortScrambles(!shortScrambles)}
        />
        <Text whiteSpace="nowrap">scramble all pieces</Text>
        <HelpButton
          modalTitle="scramble all pieces"
          buttonAriaLabel="info about scrambling all pieces"
        >
          <Stack>
            <Text>
              by default, the scrambles are conveniently short but do not
              properly scramble the entire cube. only{" "}
              {eoStep === "EO"
                ? "the orientation of edges is random."
                : `the solved ${eoStepName} pieces and the orientation of unsolved edges are random.`}
            </Text>
            <Text>
              if this option is enabled, scrambles will scramble the entire
              cube. useful for planning beyond {eoStepName}.
            </Text>
          </Stack>
        </HelpButton>
      </HStack>
    </VStack>
  );
}
