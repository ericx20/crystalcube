import TrainerCard from "../common/TrainerCard";
import { Heading, Select } from "@chakra-ui/react";

export default function EOStepOptionsSelect() {
  return (
    <TrainerCard>
      <Heading size="md">level</Heading>
      <Select variant="filled" maxWidth="12rem">
        <option>random</option>
        <option># of bad edges</option>
        <option># of moves</option>
      </Select>
    </TrainerCard>
  );
}
