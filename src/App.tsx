import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import { Container, Flex } from "@chakra-ui/react";
import NavBar from "./components/NavBar/NavBar";
import Home from "./pages/Home";
import Trainer from "./pages/train/CrossTrainerPage";
import Tools from "./pages/Tools";
import ErrorPage from "./pages/ErrorPage";
import CrossTrainerPage from "./pages/train/CrossTrainerPage";
import EOStepTrainerPage from "./pages/train/EOStepTrainerPage";
import TrainerPage from "./pages/train";
import OHScramble from "./pages/OHScramble";
import { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
  return (
    <Flex direction="column" h="100vh">
      <NavBar />
      <Container className="content" px={0} pt={14} maxW="100vw">
        {children}
      </Container>
    </Flex>
  );
}

// TODO: add back OH scrambler

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={
        <Layout>
          <Outlet />
        </Layout>
      }
      errorElement={
        <Layout>
          <ErrorPage />
        </Layout>
      }
    >
      <Route index element={<Home />} />
      <Route path="train">
        <Route index element={<TrainerPage />} />
        <Route path="cross">
          <Route index element={<CrossTrainerPage />} />
        </Route>
        <Route path="eo" element={<EOStepTrainerPage />} />
      </Route>
      <Route path="tools">
        <Route path="ohscramble" element={<OHScramble />} />
      </Route>
    </Route>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
