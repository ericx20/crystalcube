import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import ErrorPage from "./pages/ErrorPage";
import CfopPage from "./pages/cfop/CfopPage";
import ZZPage from "./pages/zz/ZzPage";
import ZZTrainer from "./components/Trainer/ZZTrainer";
import CrossTrainer from "./components/Trainer/CrossTrainer";
import TwoLookOllPage from "./pages/cfop/TwoLookOllPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<ErrorPage />}>
      <Route index element={<Home />} />
      <Route path="cfop">
        <Route index element={<CfopPage />} />
        <Route path="cross">
          {/* TODO */}
          <Route index element={<CrossTrainer />} />
        </Route>
        <Route path="2l-oll" element={<TwoLookOllPage />} />
      </Route>
      <Route path="zz">
        <Route index element={<ZZPage />} />
        <Route path="eocross">
          <Route index element={<ZZTrainer />} />
        </Route>
      </Route>
    </Route>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
