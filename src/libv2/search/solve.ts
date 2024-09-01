import { Puzzle } from "../types";
import { PruningTable, genPruningTable } from "./prune";

// TODO: rename `maxSolutionCount` to numSolutions
// and make it accept either number, or the string value "all-optimal"
// that would be very useful for e.g. EO+cross where find all optimal EO
// and then solve cross continuation, pick top 5

// TODO: allow passing in a pre-computed pruning table
// make it possible to access pruning table from outside the worker
// if the default behaviour is to copy the pruning table into the worker thread,
// then instead take in a proxy function that will get you the depth for you given a cube state hash

export interface SolverOptions {
  // name: string; // must be unique
  pruningDepth: number;
  depthLimit: number;
  maxSolutionCount?: number;
}

// this is an iterative deepening depth-first search
// the strat is to try doing DFS on depth 0, then depth 1, and so on
export function solve<Move extends string>(
  puzzleToSolve: Puzzle<Move>, // a scrambled puzzle
  pruningTable: PruningTable,
  { pruningDepth, depthLimit, maxSolutionCount = 5 }: SolverOptions
): Move[][] {
  const puzzle = puzzleToSolve.clone().resetHistory();
  const solutionsList: Move[][] = [];
  const isSolutionsListFull = () => solutionsList.length >= maxSolutionCount;
  // const isSolutionsListFull = () => {
  //   if (solutionsList.length === 0) return false;
  //   const bestSolution = solutionsList[0];
  //   const worstSolution = solutionsList.at(-1);
  //   if (!worstSolution) return false;
  //   return bestSolution.length !== worstSolution.length;

  // }

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
// also important to filter out duplicate solutions: the algorithm uses IDDFS
// so it may solve the same depth multiple times and find the same solution multiple times
function solutionsAreTooSimilar<Move>(solA: Move[], solB: Move[]): boolean {
  if (!solA.length && !solB.length) return true;

  const commonLength = Math.min(solA.length, solB.length);
  const maxSimilarMoves = Math.min(commonLength, 3);
  let numOfSimilarMoves = 0;
  for (let i = 0; i < commonLength; i++) {
    if (solA[i] === solB[i]) numOfSimilarMoves++;
    if (numOfSimilarMoves >= maxSimilarMoves) return true;
  }
  return false;
}

// removes solutions that are much worse than the best one
// the list of solutions must be sorted in increasing order of length
function trimBadSolutions<Move>(solutionsList: Move[][]): Move[][] {
  const MAX_SUBOPTIMALITY = 3;
  const optimalMovecount = solutionsList[0].length;
  const maxAcceptableMovecount = optimalMovecount + MAX_SUBOPTIMALITY;
  return solutionsList.filter(
    (solution) => solution.length <= maxAcceptableMovecount
  );
}
