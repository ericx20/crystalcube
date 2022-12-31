import {
  Routes,
  Route,
} from "react-router-dom"
import {
  Container,
  Flex,
} from "@chakra-ui/react"
import NavBar from "./components/NavBar"
import { Home } from "./views/Home"
import Trainer from "./views/Trainer"
import { Tools } from "./views/Tools"
import SecretTestPage from "./views/SecretTestPage"

export default function App() {
  return (
  <Flex direction="column" height="100vh" fontSize="xl">
    <NavBar />
      <Container className="content" h="100%" marginTop="32px" maxW="100vw">
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
