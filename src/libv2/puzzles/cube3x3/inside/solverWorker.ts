import { solve } from "src/libv2/search";
import { Move3x3, CubeRotation } from "../types";
import {
  PUZZLE_CONFIGS,
  PuzzleConfigName,
  invertMoves,
  Cube3x3,
  getMaskedFaceletCube,
} from "..";

import * as Comlink from "comlink";

// TODO: include prerotation as part of the solution
export type Cube3x3SolverResult = {
  solution: Move3x3[];
  preRotation: CubeRotation[];
}[];

export const Cube3x3Solver = {
  // WAIT NVM RrUMDFB is the same whether x, x' or x2
  // that prerotation is just a way to choose better ergonomics for the same solution?
  // so this is not actually needed
  // TODO: puzzle config: add an option for a list of cube orientations to try
  // for example in Roux FB we should try starting an x, x' or x2 away from scrambled to find cool solutions
  // this is slightly different from colour neutrality, because for this the solve state is still the same
  // while in CN you have multiple solved states e.g. white cross, green cross...
  solve(
    scramble: Move3x3[],
    configName: PuzzleConfigName,
    preRotation: CubeRotation[] = [],
    maxSolutionCount?: number
  ): Cube3x3SolverResult {
    const { moveSet, mask, pruningDepth, depthLimit } =
      PUZZLE_CONFIGS[configName].solverConfig;
    const maskedCubeState = getMaskedFaceletCube(mask);
    const translatedScramble = [
      ...invertMoves(preRotation),
      ...scramble,
      ...preRotation,
    ];
    const puzzle = new Cube3x3(moveSet, maskedCubeState);
    puzzle.applyMoves(translatedScramble).print();

    const solutions = solve(puzzle, {
      name: configName,
      pruningDepth,
      depthLimit,
      maxSolutionCount,
    });
    
    return solutions.map((solution) => ({
      solution,
      preRotation,
    }));
  }
};

Comlink.expose(Cube3x3Solver);
