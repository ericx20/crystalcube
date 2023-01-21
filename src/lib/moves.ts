import type { Cube, Layer, Move, MoveSeq } from "./types";
import { AXES, HTM_MOVESET, LAYERS_ALONG_AXES, MOVE_PERMS } from "./constants";
import sample from "lodash/sample"

export function applyMove<C extends Cube>(cube: C, move: Move): C {
  const newCube = [...cube] as C;
  const perms = MOVE_PERMS[move];
  perms.forEach(([src, dst]) => newCube[dst] = cube[src]);
  return newCube;
}

export function applyMoves<C extends Cube>(cube: C, moves: MoveSeq): C {
  return moves.reduce(applyMove, cube);
}

export function invertMove(move: Move): Move {
  if (move.includes("2"))
    return move;
  // This is not type-safe, TODO: find a better way
  if (move.includes("'"))
    return move[0] as Move;
  return move[0] + "'" as Move;
}

export function invertMoves(moves: MoveSeq): MoveSeq {
  return [...moves].reverse().map(move => invertMove(move));
}

export function layerOfMove(move: Move): Layer {
  // This is not type-safe, TODO: find a better way
  return move[0] as Layer;
}

export function moveSeqToString(moveSeq: MoveSeq) {
  return moveSeq.join(" ")
}

export function movesAreSameLayer(a: Move, b: Move): boolean {
  return layerOfMove(a) === layerOfMove(b)
}

export function moveSeqsAreIdentical(a: MoveSeq, b: MoveSeq): boolean {
  if (a.length !== b.length) {
    return false
  }
  return a.every((move, index) => move === b[index])
}

export function movesAreParallel(a: Move, b: Move): boolean {
  const layerA = layerOfMove(a)
  const layerB = layerOfMove(b)
  return AXES.some(axis => {
    const parallelLayers = LAYERS_ALONG_AXES[axis]
    return parallelLayers.includes(layerA) && parallelLayers.includes(layerB)
  })
}

export function endsWithUselessParallelMoves(solution: MoveSeq): boolean {
  if (solution.length < 3) {
    return false
  }
  const [thirdLast, secondLast, last] = solution.slice(-3)
  return movesAreSameLayer(thirdLast, last) && movesAreParallel(thirdLast, secondLast)
}

export function randomMoves(length: number, moveSet = HTM_MOVESET): MoveSeq {
  const moves: MoveSeq = []
  for (let i = 0; i < length; i++) {
    appendRandomMove(moves, moveSet)
  }
  return moves
}

// NOTE: mutates the `moves` array!
export function appendRandomMove(moves: MoveSeq, moveSet = HTM_MOVESET): void {
  const lastMove = moves.at(moves.length - 1)
  const secondLastMove = moves.at(moves.length - 2)
  const choiceIsValid = (choice: Move) => (
    !lastMove // if there is no last move, we can choose any move as valid
    || (
      !movesAreSameLayer(choice, lastMove)
      && (!secondLastMove || !endsWithUselessParallelMoves([secondLastMove, lastMove, choice]))
    )
  )
  const validChoices = moveSet.filter(choiceIsValid)
  const move = sample(validChoices)
  move && moves.push(move)
}
