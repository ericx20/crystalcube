import {
  Box,
  Heading,
  HStack,
  Kbd,
  ListItem,
  Switch,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";

export interface KeyboardControlsProps {
  enableHotkeys: boolean;
  setEnableHotkeys: (enable: boolean) => void;
}

export default function KeyboardControls({
  enableHotkeys,
  setEnableHotkeys,
}: KeyboardControlsProps) {
  return (
    <VStack align="left" gap={4}>
      <Heading size="md">keyboard controls</Heading>
      <HStack>
        <Switch
          isChecked={enableHotkeys}
          onChange={() => setEnableHotkeys(!enableHotkeys)}
        />
        <Text>enable</Text>
      </HStack>
      <Box>
        <UnorderedList opacity={enableHotkeys ? 1 : 0.5}>
          <ListItem>
            <Kbd>space</Kbd>: reveal solution, next solution
          </ListItem>
          <ListItem>
            <Kbd>backspace</Kbd>: re-hide solution
          </ListItem>
          <ListItem>
            <Kbd>←</Kbd> and <Kbd>→</Kbd>: scrub through solution
          </ListItem>
        </UnorderedList>
      </Box>
    </VStack>
  );
}
