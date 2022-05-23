import { extendTheme } from "@chakra-ui/react"
// import "@fontsource/roboto-mono"

const config = {
    initialColorMode: "dark",
}

// const fonts = {
//     mono: "roboto-mono"
// }

// const components = {
//     Text: {
//         variants: {
//             "alg": {
//                 fontFamily: "Roboto Mono"
//             }
//         }
//     }
// }

const theme = extendTheme({ config })

export default theme