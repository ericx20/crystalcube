import { Move3x3, CubeRotation } from ".";
import { PuzzleConfigName } from ".";

import * as Comlink from "comlink";

import type { Cube3x3Solver } from "./inside/solverWorker";

export async function solveCube3x3(
  scramble: Move3x3[],
  configName: PuzzleConfigName,
  preRotation: CubeRotation[] = [],
  maxSolutionCount?: number
) {
  const worker = new Worker(
    new URL("./inside/solverWorker.ts", import.meta.url),
    { type: "module" }
  );
  const Solver = Comlink.wrap<typeof Cube3x3Solver>(worker);
  return await Solver.solve(scramble, configName, preRotation, maxSolutionCount);
}
