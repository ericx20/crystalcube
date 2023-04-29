import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import Trainer from "./pages/Trainer";
import Tools from "./pages/Tools";
import Page3x3 from "./pages/3x3/Page3x3";
import Layout from "./components/Layout";
import ErrorPage from "./pages/ErrorPage";
import PageCFOP from "./pages/3x3/cfop/PageCFOP";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<ErrorPage />}>
      <Route index element={<Home />} />
      <Route path="3x3">
        <Route index element={<Page3x3 />} />
        <Route path="cfop">
          <Route index element={<PageCFOP />} />
        </Route>
      </Route>
    </Route>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
