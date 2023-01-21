import type { MoveSeq, FaceletCube, PruningTable, SolverConfigName, CubeRotation, SolverConfig } from "../types"
import { SOLVER_CONFIGS, SOLVED_INDEXED_FACELET_CUBE } from "../constants"
import { faceletCubeToString, getMaskedFaceletCube } from "../cubeState"
import { endsWithUselessParallelMoves, movesAreParallel, invertMoves, applyMoves, moveSeqsAreIdentical, layerOfMove, applyMove } from "../moves"
import { getPruningTable } from "./prune"


// NOTE: solve() is fixed orientation
// Pre-rotation sets the desired cube orientation
// TODO: add pre-rotation to the output, along with move annotations maybe
// will be an object comprising of the solution and some "metadata" like pre-rotation etc
export function solve(scram: MoveSeq, configName: SolverConfigName, preRotation: Array<CubeRotation> = [], maxNumberOfSolutions = 5): Array<MoveSeq> {
  const config = SOLVER_CONFIGS[configName]

  const translatedScramble = invertMoves(preRotation).concat(scram).concat(preRotation)
  const scrambledCube = applyMoves(SOLVED_INDEXED_FACELET_CUBE, translatedScramble)
  const maskedCube = getMaskedFaceletCube(scrambledCube, config.mask)

  const pruningTable = getPruningTable(configName)

  const solutionsList: Array<MoveSeq> = []
  const isSolutionsListFull = () => solutionsList.length >= maxNumberOfSolutions
  const addSolution = (solutionToAdd: MoveSeq) => {
    const sortedSolution = sortSimulMoves(solutionToAdd)
    // check for duplicate/similar solutions
    if (solutionsList.some(solution => solutionsAreTooSimilar(solution, sortedSolution))) {
      return
    }
    solutionsList.push(sortedSolution)
  }

  const MAX_SEARCH_COUNT = 1000000
  let searchCount = 0

  const shouldStopSearch = () => isSolutionsListFull() || searchCount >= MAX_SEARCH_COUNT

  // Depth limited search
  // NOTE: MUTATES THE SOLUTION ARRAY
  function solveDepth(
    config: SolverConfig,
    pruningTable: PruningTable,
    cube: FaceletCube,
    solution: MoveSeq,
    depthRemaining: number,
  ): boolean {

    // if the accumulator is full or we reached state limit, return false immediately
    if (shouldStopSearch()) {
      return false
    }

    searchCount++

    // pruning
    let lowerBound: number | undefined = pruningTable[faceletCubeToString(cube)] // least # moves needed to solve this scram
  
    if (lowerBound === undefined) {
      // if the pruning depth was 4 and it doesn't have our cube state,
      // then we need 5 or more moves to solve the cube
      lowerBound = config.pruningDepth + 1
    }

    if (lowerBound > depthRemaining) {
      return false
    }

    if (isSolved(cube, pruningTable)) {
      addSolution([...solution])
      return true
    }

    // cube is unsolved but we still have some remaining depth
    for (const move of config.moveSet) {
      // optimization: never use the same layer in consecutive moves
      if (solution.length && layerOfMove(move) === layerOfMove(solution[solution.length - 1])) {
        continue
      }

      // prevent exploring further if the solution has a redundant segment like R L R', guaranteed a better one would be found
      if (endsWithUselessParallelMoves(solution.concat(move))) {
        continue
      }

      // try every available move by recursively calling solveDepth
      solution.push(move)
      solveDepth(
        config,
        pruningTable,
        applyMove(cube, move), // copy of cube + the move done
        solution,
        depthRemaining - 1,
      )
      // if a recursive call found a solution, then propagate the fact that a solution was found
      // if (result) return true
      solution.pop() // otherwise, remove the move we tried and try another move
    }
    // ok we tried everything but nothing was found
    return false
  }


  for (let depth = 0; depth <= config.depthLimit; depth++) {
    solveDepth(config, pruningTable, maskedCube, [], depth)
    if (shouldStopSearch()) {
      break
    }
  }

  // eliminate solutions that are way longer than the shortest one we found
  const MAX_SUBOPTIMALITY = 2
  if (solutionsList.length) {
    // by nature of this algorithm, solutionsList is always sorted by length (best solutions first)
    const bestSolutionLength = solutionsList[0].length
    const maxSolutionLength = bestSolutionLength + MAX_SUBOPTIMALITY
    return solutionsList.filter(solution => solution.length <= maxSolutionLength)
  }

  return solutionsList
}

function isSolved(cube: FaceletCube, pruningTable: PruningTable): boolean {
  return pruningTable[faceletCubeToString(cube)] === 0
}

// solution post-processing
function sortSimulMoves(solution: MoveSeq): MoveSeq {
  const sortedSolution: MoveSeq = [...solution]
  let i = 0
  while (i < solution.length - 1) {
    const currentMove = solution[i]
    const nextMove = solution[i + 1]
    if (movesAreParallel(currentMove, nextMove)) {
      // sort moves lexicographically (in reverse)
      if (currentMove > nextMove) {
        sortedSolution[i] = currentMove
        sortedSolution[i + 1] = nextMove
      } else {
        sortedSolution[i] = nextMove
        sortedSolution[i + 1] = currentMove
      }
      i += 2
    } else {
      i++
    }
  }
  return sortedSolution
}

// heuristic that eliminates a lot of solutions that are functionally the same
function solutionsAreTooSimilar(solA: MoveSeq, solB: MoveSeq): boolean {
  if (moveSeqsAreIdentical(solA, solB)) {
    return true
  }

  const length = Math.min(solA.length, solB.length)

  let numOfSimilarMoves = 0
  for (let i = 0; i < length; i++) {
    const moveA = solA[i]
    const moveB = solB[i]
    if (layerOfMove(moveA) === layerOfMove(moveB)) {
      numOfSimilarMoves++
    }
    if (numOfSimilarMoves >= 3) {
      return true
    }
  }

  return false
}
