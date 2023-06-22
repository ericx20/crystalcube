import { Puzzle } from "../types";
import { genPruningTable } from "./prune";

export interface SolverOptions {
  name: string; // must be unique
  depthLimit: number;
  pruningDepth: number;
  maxSolutionCount?: number;
}

export function solve<Move extends string>(
  puzzle: Puzzle<Move>, // a scrambled puzzle
  { name, depthLimit, pruningDepth, maxSolutionCount = 5 }: SolverOptions
): Move[][] {
  const pruningTable = genPruningTable(puzzle, { name, pruningDepth });

  const solutionsList: Move[][] = [];
  const isSolutionsListFull = () => solutionsList.length >= maxSolutionCount;
  const addSolution = (solutionToAdd: Move[]) => {
    if (solutionsList.some((s) => solutionsAreTooSimilar(s, solutionToAdd))) {
      return;
    }
    solutionsList.push(solutionToAdd);
  };

  const MAX_SEARCH_COUNT = 1000000;
  let searchCount = 0;

  const shouldStopSearch = () =>
    isSolutionsListFull() || searchCount >= MAX_SEARCH_COUNT;

  // Depth limited search
  function solveDepth(
    puzzleState: Puzzle<Move>,
    solution: Move[], // MUTATED
    depthRemaining: number
  ): boolean {
    if (shouldStopSearch()) return false;

    searchCount++;

    // the lower bound for the movecount of the optimal solution
    // if pruning table doesn't have the optimal movecount, the movecount must be more than the table's depth
    const lowerBound = pruningTable[puzzleState.encode()] ?? pruningDepth + 1;
    if (lowerBound > depthRemaining) return false;

    if (puzzleState.isSolved()) {
      addSolution([...solution]);
      return true;
    }

    // cube is unsolved but we still have some remaining depth
    for (const move of puzzleState.nextMoves) {
      // try every available move by recursively calling solveDepth
      solution.push(move);
      solveDepth(
        puzzleState.clone().applyMove(move),
        solution,
        depthRemaining - 1
      );
      solution.pop(); // remove the move we tried, in order to try another
    }
    return false; // no solutions found
  }

  for (let depth = 0; depth <= depthLimit; depth++) {
    solveDepth(puzzle, [], depth);
    if (shouldStopSearch()) break;
  }

  return trimBadSolutions(solutionsList);
}

// heuristic that eliminates a lot of solutions that are functionally the same
// counts the number of moves that are the same
function solutionsAreTooSimilar<Move>(solA: Move[], solB: Move[]): boolean {
  const length = Math.min(solA.length, solB.length);
  const MAX_SIMILAR_COUNT = 3;
  let numOfSimilarMoves = 0;
  for (let i = 0; i < length; i++) {
    if (solA[i] === solB[i]) numOfSimilarMoves++;
    if (numOfSimilarMoves >= MAX_SIMILAR_COUNT) return true;
  }
  return false;
}

// removes solutions that are much worse than the best one
// the list of solutions must be sorted in increasing order of length
function trimBadSolutions<Move>(solutionsList: Move[][]): Move[][] {
  if (!solutionsList.length) return [];
  const MAX_SUBOPTIMALITY = 2;
  const optimalMovecount = solutionsList[0].length;
  const maxAcceptableMovecount = optimalMovecount + MAX_SUBOPTIMALITY;
  return solutionsList.filter(
    (solution) => solution.length <= maxAcceptableMovecount
  );
}
