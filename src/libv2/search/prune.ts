import { Puzzle } from "../types";

export type PruningTable = { [encodedState: string]: number };

export function genPruningTable(solved: Puzzle): PruningTable {
  let previousFrontier: Array<Puzzle> = [solved];
  const pruningTable: PruningTable = {
    [solved.encode()]: 0,
  };

  const STATE_LIMIT = 30000;

  let counter = 1;
  let depth = 1;
  while (true) {
    const frontier: Array<Puzzle> = [];
    let addedState = false;
    for (const puzzle of previousFrontier) {
      // for every previous state: try all possible moves on it
      for (const move of puzzle.nextMoves) {
        if (counter >= STATE_LIMIT) {
          return pruningTable;
        }
        const newPuzzle = puzzle.clone().applyMove(move);
        const key = newPuzzle.encode();

        if (pruningTable[key] === undefined) {
          pruningTable[key] = depth; // add this state to pruning table
          frontier.push(newPuzzle); // add this to frontier so it can then become previousFrontier
          counter++;
          addedState = true;
        }
      }
    }
    if (!addedState) {
      // if no states were added to pruning table, it means pruning table already contains all states
      return pruningTable;
    }
    previousFrontier = [...frontier];
    depth++;
  }
}
