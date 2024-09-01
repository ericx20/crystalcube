import { Move3x3, cubeOrientationToRotations } from "src/libv2/puzzles/cube3x3";
import { solveCube3x3 } from "src/libv2/puzzles/cube3x3/solvers";
import { EOStepOptions } from "./eoStepOptions";

export default async function solver(
  scramble: Move3x3[],
  options: EOStepOptions
) {
  const solutions = await solveCube3x3(
    scramble,
    options.eoStep,
    cubeOrientationToRotations(options.solutionOrientation),
    5
  );
  return solutions;
}
