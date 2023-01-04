import type { MoveSeq, FaceletCube, PruningTable, SolverConfigName, CubeRotation, SolverConfig } from "../types"
import { SOLVER_CONFIGS, SOLVED_INDEXED_FACELET_CUBE } from "../constants"
import { faceletCubeToString, getMaskedFaceletCube } from "../cubeState"
import { movesAreSameLayer, movesAreParallel, invertMoves, applyMoves, moveSeqsAreIdentical, layerOfMove, applyMove } from "../moves"
import { getPruningTable } from "../pruning"


// NOTE: solve() is fixed orientation
// Pre-rotation sets the desired cube orientation
export function solve(scram: MoveSeq, configName: SolverConfigName, preRotation: Array<CubeRotation> = [], maxNumberOfSolutions = 5): Array<MoveSeq> {
  const config = SOLVER_CONFIGS[configName]

  const translatedScramble = invertMoves(preRotation).concat(scram).concat(preRotation)
  const scrambledCube = applyMoves(SOLVED_INDEXED_FACELET_CUBE, translatedScramble)
  const maskedCube = getMaskedFaceletCube(scrambledCube, config.mask)

  const pruningTable = getPruningTable(configName)

  const solutionsList: Array<MoveSeq> = []
  const isSolutionsListFull = () => solutionsList.length >= maxNumberOfSolutions
  const addSolution = (solutionToAdd: MoveSeq) => {
    // check for duplicates
    if (solutionsList.some(solution => moveSeqsAreIdentical(solution, solutionToAdd))) {
      return
    }
    solutionsList.push(solutionToAdd)
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
    for (const move of config.moveset) {
      // optimization: never use the same layer in consecutive moves
      if (solution.length && layerOfMove(move) === layerOfMove(solution[solution.length - 1])) {
        continue
      }

      // prevent exploring any solutions that are like the sequence `R L R2 L'`
      // where the first and third moves are both the same layer
      // and also both parallel to the second move
      if (startsWithUselessParallelMoves(solution.concat(move))) {
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

function startsWithUselessParallelMoves(solution: MoveSeq): boolean {
  if (solution.length < 3) {
    return false
  }
  const firstMove = solution[0], secondMove = solution[1], thirdMove = solution[2]
  return movesAreSameLayer(firstMove, thirdMove) && movesAreParallel(firstMove, secondMove)
}

function isSolved(cube: FaceletCube, pruningTable: PruningTable): boolean {
  return pruningTable[faceletCubeToString(cube)] === 0
}
