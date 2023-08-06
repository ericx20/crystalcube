import { Puzzle } from "../types";

export type PruningTable = { [encodedState: string]: number };

export interface PrunerOptions {
  name: string; // must be unique
  pruningDepth: number;
}

// note: for now, pruning tables are regenerated every time the solver runs
// it's not a problem, the eocross pruning table takes about 70 ms on err0rlaptop to generate
// but the `name` option in `PrunerOptions` is there in case you need a unique key to use for caching purposes

// the puzzle passed in may be scrambled, that's okay
// only the solved state will be used as the starting point for the pruner
// make sure to set a reasonable depth in the options, or else the pruning will be slow and use up memory!
export function genPruningTable(
  puzzle: Puzzle,
  prunerOptions: PrunerOptions
): PruningTable {
  const solved = puzzle.clone().resetToSolved();
  let previousFrontier: Puzzle[] = [solved];
  const pruningTable: PruningTable = {
    [solved.encode()]: 0,
  };

  for (let depth = 1; depth <= prunerOptions.pruningDepth; depth++) {
    const frontier: Puzzle[] = [];
    for (const puzzleState of previousFrontier) {
      // for every previous state: try all possible moves on it
      for (const move of puzzleState.nextMoves) {
        const newPuzzleState = puzzleState.clone().applyMove(move);
        const key = newPuzzleState.encode();
        if (pruningTable[key] === undefined) {
          pruningTable[key] = depth; // add this state to pruning table
          frontier.push(newPuzzleState); // add this to frontier so it can then become previousFrontier
        }
      }
    }
    previousFrontier = [...frontier];
  }
  return pruningTable;
}


export type PruningTableWithSetups<Move> = { [encodedState: string]: Move[] };

// pruning table except instead of the values being the optimal movecounts,
// the values are "setups": move sequences that bring the solved state to the scrambled state
export function genPruningTableWithSetups<Move extends string>(
  puzzle: Puzzle<Move>,
  prunerOptions: PrunerOptions
): PruningTableWithSetups<Move> {
  const solved = puzzle.clone().resetToSolved();
  let previousFrontier: Puzzle<Move>[] = [solved];
  const pruningTable: PruningTableWithSetups<Move> = {
    [solved.encode()]: solved.history,
  };

  for (let depth = 1; depth <= prunerOptions.pruningDepth; depth++) {
    const frontier: Puzzle<Move>[] = [];
    for (const puzzleState of previousFrontier) {
      // for every previous state: try all possible moves on it
      for (const move of puzzleState.nextMoves) {
        const newPuzzleState = puzzleState.clone().applyMove(move);
        const key = newPuzzleState.encode();
        if (pruningTable[key] === undefined) {
          pruningTable[key] = newPuzzleState.history; // add this history to pruning table
          frontier.push(newPuzzleState); // add this to frontier so it can then become previousFrontier
        }
      }
    }
    previousFrontier = [...frontier];
  }
  return pruningTable;
}
