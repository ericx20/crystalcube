import {
  Routes,
  Route,
} from "react-router-dom"
import {
  Container,
  Flex,
} from "@chakra-ui/react"
import NavBar from "./components/NavBar"
import Home from "./pages/Home"
import Trainer from "./pages/Trainer"
import Tools from "./pages/Tools"
import SecretTestPage from "./pages/SecretTestPage"

export default function App() {
  return (
  <Flex direction="column" height="100vh" fontSize="xl">
    <NavBar />
      <Container className="content" h="100%" marginTop="16px" px={0} maxW="100vw">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="trainer/*" element={<Trainer />} />
          <Route path="tools/*" element={<Tools />} />
          <Route path="secrettestpage/*" element={<SecretTestPage />} />
        </Routes>
      </Container>
    </Flex>
  )
}
