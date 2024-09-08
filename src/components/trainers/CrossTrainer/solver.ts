import { Move3x3, cubeOrientationToRotations } from "src/lib/puzzles/cube3x3";
import { solveCube3x3 } from "src/lib/puzzles/cube3x3/solvers";
import { CrossOptions } from "./store";
import { CrossSolution } from "./types";

export default async function solver(
  scramble: Move3x3[],
  options: CrossOptions
): Promise<CrossSolution[]> {
  /*
    Cross:
    - fixed: best 5 solutions
    - dual: 6 solutions on both colours combined (generate 3 on white, 3 on yellow, put together)
    - full: 6 solutions, one for each cross colour
    XCross:
    - fixed: 4 solutions (4 slots)
    - dual: 8 solutions (4 slots * 2 cross colors)
    - full: not an option, default to dual

    TODO: we may have to limit the solutions to the 5 best, depending on how it looks on mobile
  */
  if (options.crossStep === "Cross") {
    switch (options.colorNeutrality) {
      case "fixed":
        const preRotation = cubeOrientationToRotations(
          options.solutionOrientations[0]
        );
        const solutions = await solveCube3x3(
          scramble,
          options.crossStep,
          preRotation,
          5
        );
        return solutions.map((solution) => ({
          preRotation,
          solution,
        }));
      case "dual":
      case "full":
        // TODO
        return [];
    }
  }

  if (options.colorNeutrality === "fixed") {
  }

  // TODO: XCross

  // TODO: dual color neutrality. dual:

  // full color neutrality
  // TODO: does Promise.all save any time? the solver worker is a singleton after all
  const solutions: CrossSolution[] = [];
  options.solutionOrientations.forEach(async (orientation) => {
    const preRotation = cubeOrientationToRotations(orientation);
    const solutionsForOrientation = await solveCube3x3(
      scramble,
      options.crossStep,
      preRotation
    );
  });

  return solutions;
}
