import { solve as oldSolve } from "src/lib";
import {
  EOCROSS_MASK,
  HTM_MOVESET_BIASED_RUF,
  getMaskedFaceletCube,
} from "src/libv2/puzzles/cube3x3";
import { Cube3x3 } from "src/libv2";
import { solve } from "src/libv2/search";

const scramble = "R' F U' L' D L2 B' F D' F2 L'".split(" ") as any;

// OLD LIB:
console.time("old");
const oldSolutions = oldSolve([...scramble], "EOCross", [], 5);
console.log(oldSolutions);
console.timeEnd("old");

// NEW LIB:
console.time("new");
const eoCrossPuzzle = new Cube3x3(
  HTM_MOVESET_BIASED_RUF,
  getMaskedFaceletCube(EOCROSS_MASK)
);
eoCrossPuzzle.applyMoves([...scramble]);

const solutions = solve(eoCrossPuzzle, {
  name: "EOCross",
  depthLimit: 10,
  pruningDepth: 4,
  maxSolutionCount: 5,
});
console.log(solutions.map((solution) => solution.join(" ")));
console.timeEnd("new");

export default function TestPage() {
  return <p>hello it's test page</p>;
}
