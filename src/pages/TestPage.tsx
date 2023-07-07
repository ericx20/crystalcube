// import { solve } from "src/lib";
// import { solveCube3x3 } from "src/libv2/puzzles/cube3x3/solvers";
import { Button } from "@chakra-ui/react";
import { useState, useMemo } from "react";
import { solveCube3x3 } from "src/libv2";
import { Move3x3 } from "src/libv2/puzzles/cube3x3/types";

const scramble = "R' F U' L' D L2 B' F D' F2 L'".split(" ") as any;

export default function TestPage() {
  const [solutions, setSolutions] = useState([] as Move3x3[][]);

  async function handleClick() {
    console.time("test");
    const solutions = await solveCube3x3(scramble, "EOCross");
    // const [solutions, _] = await Promise.all([
    //   solveCube3x3(scramble, "EOCross"),
    //   solveCube3x3(scramble, "EOCross"),
    // ])
    console.timeEnd("test")
    setSolutions(solutions.map(({ solution }) => solution));
  }

  return (
    <>
      <p>hello it's test page</p>
      {solutions.map(solution => (
        <p key={solution.join("")}>{solution.join(" ")}</p>
      ))}
      <Button onClick={handleClick}>click me!</Button>
    </>
  );
}
