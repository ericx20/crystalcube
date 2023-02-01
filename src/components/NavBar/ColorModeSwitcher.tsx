import { IconButton, useColorMode, useColorModeValue } from "@chakra-ui/react"
import { IoMoon, IoSunny } from "react-icons/io5"

export const ColorModeSwitcher = () => {
  const { toggleColorMode } = useColorMode()
  const text = useColorModeValue("dark", "light")
  const SwitchIcon = useColorModeValue(IoMoon, IoSunny)

  return (
    <IconButton
      size="md"
      fontSize="lg"
      variant="ghost"
      color="current"
      marginLeft="2"
      onClick={toggleColorMode}
      icon={<SwitchIcon />}
      aria-label={`Switch to ${text} mode`}
    />
  )
}
