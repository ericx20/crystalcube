import { Move3x3, CubeRotation } from "./types";
import { PuzzleConfigName } from ".";

import * as Comlink from "comlink";

import {
  Cube3x3Solver as Solver,
  Cube3x3SolverResult,
} from "./inside/solverWorker";

type Params = [Move3x3[], PuzzleConfigName, CubeRotation[]?, number?];
export async function solveCube3x3(
  ...params: Params
): Promise<Cube3x3SolverResult> {
  const worker = new Worker(
    new URL("./inside/solverWorker.ts", import.meta.url),
    { type: "module" }
  );
  const Solver = Comlink.wrap<Solver>(worker);
  return await Solver.solve(...params);
}
