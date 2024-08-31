import { solve } from "src/libv2/search";
import { Move3x3, RotationMove } from "..";
import { PUZZLE_CONFIGS, PuzzleConfigName, invertMoves, Cube3x3 } from "..";

import * as Comlink from "comlink";

export const Cube3x3Solver = {
  solve(
    scramble: Move3x3[],
    configName: PuzzleConfigName,
    preRotation: RotationMove[] = [],
    maxSolutionCount?: number
  ): Move3x3[][] {
    const { moveSet, mask, pruningDepth, depthLimit } =
      PUZZLE_CONFIGS[configName].solverConfig;
    const translatedScramble = [
      ...invertMoves(preRotation),
      ...scramble,
      ...preRotation,
    ];
    const puzzle = new Cube3x3(moveSet)
      .applyMask(mask)
      .applyMoves(translatedScramble);

    const solutions = solve(puzzle, {
      name: configName,
      pruningDepth,
      depthLimit,
      maxSolutionCount,
    });

    return solutions;
  },
};

Comlink.expose(Cube3x3Solver);
