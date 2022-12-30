import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { Routes, Route, Outlet, Link } from "react-router-dom";

import { random333State } from "cubing/search"
import { experimentalSolve3x3x3IgnoringCenters } from "cubing/search";
import { KState } from "cubing/kpuzzle"

import { Button } from "@chakra-ui/react"

async function generateEOSolvedScramble() {
  const { kpuzzle, stateData } = await random333State()
  const newStateData = {
    ...stateData,
    EDGES: {
      // TODO: make this an n-flip array
      orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      pieces: stateData.EDGES.pieces
    }
  }
  const newPuzzle = new KState(kpuzzle, newStateData)
  const solution = await experimentalSolve3x3x3IgnoringCenters(newPuzzle)
  return solution.invert()
}

export default function App() {
  const [scramble, setScramble] = useState("")
  const generateScramble = async () => {
    const scram = (await generateEOSolvedScramble()).toString()
    setScramble(scram)
  }
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <a href="https://vitejs.dev" target="_blank">
        <img src="/vite.svg" className="logo" alt="Vite logo" />
      </a>
      <a href="https://reactjs.org" target="_blank">
        <img src={reactLogo} className="logo react" alt="React logo" />
      </a>
      <Button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </Button>
      <Button onClick={generateScramble}>Get scramble!</Button>
      <p>scramble: {scramble}</p>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </div>
  )
}

function Layout() {
  return (
    <div>
      {/* A "layout route" is a good place to put markup you want to
          share across all the pages on your site, like navigation. */}
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/nothing-here">Nothing Here</Link>
          </li>
        </ul>
      </nav>

      <hr />

      {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
      <Outlet />
    </div>
  );
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}
