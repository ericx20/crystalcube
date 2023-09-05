import { Routes, Route } from "react-router-dom";
import { Container, Flex } from "@chakra-ui/react";
import NavBar from "./components/NavBar/NavBar";
import Home from "./pages/Home";
import Trainer from "./pages/Trainer";
import Tools from "./pages/Tools";
import { ErrorBoundary } from "react-error-boundary";
import Fallback from "./components/Fallback";

export default function App() {
  return (
    <ErrorBoundary fallbackRender={Fallback}>
      <Flex direction="column" h="100vh" fontSize="xl">
        <NavBar />
        <Container className="content" px={0} pt={14} maxW="100vw">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="trainer/*" element={<Trainer />} />
            <Route path="tools/*" element={<Tools />} />
          </Routes>
        </Container>
      </Flex>
    </ErrorBoundary>
  );
}
