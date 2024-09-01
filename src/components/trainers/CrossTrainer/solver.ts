import { Move3x3, cubeOrientationToRotations } from "src/lib/puzzles/cube3x3";
import { solveCube3x3 } from "src/lib/puzzles/cube3x3/solvers";
import { CrossOptions } from "./crossOptions";

export default async function solver(
  scramble: Move3x3[],
  options: CrossOptions
) {
  const solutions = await solveCube3x3(
    scramble,
    "Cross",
    cubeOrientationToRotations(options.solutionOrientation),
    5
  );
  return solutions;
}
