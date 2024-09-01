import { genPruningTable, PruningTable, solve } from "src/lib/search";
import { Move3x3, RotationMove } from "..";
import { PUZZLE_CONFIGS, PuzzleConfigName, invertMoves, Cube3x3 } from "..";

import * as Comlink from "comlink";

export const Cube3x3Solver = {
  pruningTableCache: {} as Record<string, PruningTable>,
  getPruningTable(
    puzzle: Cube3x3,
    name: string,
    pruningDepth: number
  ): PruningTable {
    const cached: PruningTable | undefined = this.pruningTableCache[name];
    if (cached) return cached;
    const table = genPruningTable(puzzle, { name, pruningDepth });
    this.pruningTableCache[name] = table;
    return table;
  },
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

    const pruningTable = this.getPruningTable(puzzle, configName, pruningDepth);

    const solutions = solve(puzzle, pruningTable, {
      pruningDepth,
      depthLimit,
      maxSolutionCount,
    });

    return solutions;
  },
};

Comlink.expose(Cube3x3Solver);
