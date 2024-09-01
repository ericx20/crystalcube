import * as Comlink from "comlink";
import { Alg } from "cubing/alg";
import { KState } from "cubing/kpuzzle";
import { cube3x3x3 } from "cubing/puzzles";
import { experimentalSolve3x3x3IgnoringCenters } from "cubing/search";

import { Move3x3, RotationMove } from ".";
import { PuzzleConfigName } from ".";

import type { Cube3x3Solver } from "./inside/solverWorker";

const worker = new Worker(
  new URL("./inside/solverWorker.ts", import.meta.url),
  { type: "module" }
);
const Solver = Comlink.wrap<typeof Cube3x3Solver>(worker);

export async function solveCube3x3(
  scramble: Move3x3[],
  configName: PuzzleConfigName,
  preRotation: RotationMove[] = [],
  maxSolutionCount?: number
) {
  return await Solver.solve(
    scramble,
    configName,
    preRotation,
    maxSolutionCount
  );
}

/**
 * The scramble cannot contain rotations
 */
export async function solveEntire3x3(scramble: Move3x3[]): Promise<Move3x3[]> {
  const scrambleAlg = new Alg(scramble.join(" "));
  const kpuzzle = await cube3x3x3.kpuzzle();
  const solvedState = kpuzzle.definition.startStateData;
  const scrambledState = new KState(kpuzzle, solvedState).applyAlg(scrambleAlg);
  const solutionAlg = await experimentalSolve3x3x3IgnoringCenters(
    scrambledState
  );
  const solution = solutionAlg.toString().split(" ") as Move3x3[];
  return solution;
}
