import {
  Routes,
  Route,
} from "react-router-dom"
import {
  ChakraProvider,
  Container,
  Flex,
} from "@chakra-ui/react"
import theme from "./theme"
import NavBar from "./components/NavBar"
import { Home } from "./views/Home"
import { Algs } from "./views/Algs"
import { Tools } from "./views/Tools"
import { Resources } from "./views/Resources"

export const App = () => (
  <ChakraProvider theme={theme}>
    <Flex direction="column" height="100vh" fontSize="xl">
      <NavBar />
      <Container className="content" h="100%" marginTop="32px" maxW="100vw">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="algs/*" element={<Algs />} />
          <Route path="tools/*" element={<Tools />} />
          <Route path="resources/*" element={<Resources />} />
        </Routes>
      </Container>
    </Flex>
  </ChakraProvider>
)
