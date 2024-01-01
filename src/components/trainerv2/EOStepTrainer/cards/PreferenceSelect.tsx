import TrainerCard from "../../common/TrainerCard";
import { Heading, HStack } from "@chakra-ui/react";
import OrientationSelect from "../../common/OrientationSelect";
import { CubeOrientation } from "src/libv2/puzzles/cube3x3";

export interface PreferenceSelectProps {
  orientation: CubeOrientation;
  setOrientation: (orientation: CubeOrientation) => void;
}

export default function PreferenceSelect({
  orientation,
  setOrientation,
}: PreferenceSelectProps) {

  return (
    <TrainerCard>
      <HStack spacing={4}>
        <Heading>solution orientation</Heading>
        <OrientationSelect orientation={orientation} setOrientation={setOrientation} />
      </HStack>
    </TrainerCard>
  );
}
