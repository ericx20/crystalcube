import { extendTheme } from "@chakra-ui/react"

const config = {
  initialColorMode: "dark",
  fonts: {
    heading: `'Roboto', sans-serif`,
    body: `'Roboto', sans-serif`,
  }
}

const theme = extendTheme(config)

export default theme
