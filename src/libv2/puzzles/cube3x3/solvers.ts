import { Move3x3, CubeRotation } from "./types";
import { PuzzleConfigName } from ".";

import * as Comlink from "comlink";

import type { Cube3x3Solver } from "./inside/solverWorker";

type Params = [Move3x3[], PuzzleConfigName, CubeRotation[]?, number?];
export async function solveCube3x3(...params: Params) {
  const worker = new Worker(
    new URL("./inside/solverWorker.ts", import.meta.url),
    { type: "module" }
  );
  const Solver = Comlink.wrap<typeof Cube3x3Solver>(worker);
  return await Solver.solve(...params);
}
