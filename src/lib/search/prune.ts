import { Puzzle } from "../types";

export type PruningTable = { [encodedState: string]: number };

export interface PrunerOptions {
  // TODO: pruning tables are now cached somewhere else, don't need the name key here
  name: string; // must be unique
  pruningDepth: number;
}

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

// A "setup" is a representation of a cube state.
// It's a sequence of moves that takes a solved cube to a specific state.
type Setup<Move> = Move[];

/**
 * Given a cube state, a pruning table tells you the number of moves to solve it optimally
 * A "reverse" pruning table is the opposite: given a number, the reverse table gives you all cube states optimally solvable in exactly that number of moves
 */
export type ReversePruningTable<Move> = Setup<Move>[][];

export function genReversePruningTable<Move extends string>(
  puzzle: Puzzle<Move>,
  prunerOptions: PrunerOptions
): ReversePruningTable<Move> {
  const solved = puzzle.clone().resetToSolved();
  let previousFrontier: Puzzle<Move>[] = [solved];
  const visitedTable: { [encodedState: string]: true } = {
    [solved.encode()]: true,
  };
  const reversePruningTable: ReversePruningTable<Move> = Array.from(
    Array(prunerOptions.pruningDepth + 1),
    () => []
  );
  reversePruningTable[0] = [[]]; // the only state solvable in 0 moves is of course the solved state, the setup is an 0-move sequence

  for (let depth = 1; depth <= prunerOptions.pruningDepth; depth++) {
    const frontier: Puzzle<Move>[] = [];
    for (const puzzleState of previousFrontier) {
      // for every previous state: try all possible moves on it
      for (const move of puzzleState.nextMoves) {
        const newPuzzleState = puzzleState.clone().applyMove(move);
        const key = newPuzzleState.encode();
        if (visitedTable[key] === undefined) {
          visitedTable[key] = true; // we visited this state
          frontier.push(newPuzzleState); // add this to frontier so it can then become previousFrontier
          reversePruningTable[depth].push(newPuzzleState.history);
        }
      }
    }
    previousFrontier = [...frontier];
  }

  return reversePruningTable;
}
