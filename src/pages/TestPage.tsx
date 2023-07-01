import { solve as oldSolve } from "src/lib";
import { solveCube3x3 } from "src/libv2/puzzles/cube3x3/solvers";

const scramble = "R' F U' L' D L2 B' F D' F2 L'".split(" ") as any;

// OLD LIB:
console.time("old");
const oldSolutions = oldSolve([...scramble], "EOCross", [], 5);
console.log(oldSolutions);
console.timeEnd("old");

// NEW LIB:
console.time("new");
const solutions = solveCube3x3(scramble, 'EOCross')

console.log(solutions.map((solution) => solution.preRotation.join(" ") + " " + solution.solution.join(" ")));
console.timeEnd("new");

export default function TestPage() {
  return <p>hello it's test page</p>;
}
