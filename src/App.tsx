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
import Trainer from "./views/Trainer"
import { Tools } from "./views/Tools"

export const App = () => (
  <ChakraProvider theme={theme}>
    <Flex direction="column" height="100vh" fontSize="xl">
      <NavBar />
        <Container className="content" h="100%" marginTop="32px" maxW="100vw">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="trainer/*" element={<Trainer />} />
            <Route path="tools/*" element={<Tools />} />
            <Route path="secrettestpage/*" element={<p>Hello</p>} />
          </Routes>
        </Container>
    </Flex>
  </ChakraProvider>
)
