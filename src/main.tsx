import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react"
import { BrowserRouter } from "react-router-dom";
import theme from "./theme"
import "@fontsource/roboto/400.css"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </StrictMode>
)
