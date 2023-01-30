import type { Axis, Cube, RotationMove, LayerMove, Layer, Move, MoveSeq, FaceMove, SliceMove } from "./types";
import { AXES, FACE_MOVES, HTM_MOVESET, LAYERS_ALONG_AXES, MOVE_PERMS, ROTATIONS, SLICE_MOVES } from "./constants";
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

export function invertMove<M extends Move>(move: M): M {
  if (move.includes("2"))
    return move;
  // This is not type-safe, TODO: find a better way
  if (move.includes("'"))
    return move[0] as M;
  return move[0] + "'" as M;
}

// TODO: move to types.d.ts
type MovePower = 1 | 2 | 3

export function powerOfMove(move: Move): MovePower {
  const suffix = move[1]
  if (suffix === "'") {
    return 3
  }
  if (suffix === "2") {
    return 2
  }
  return 1
}

const SUFFIXES = {
  1: "",
  2: "2",
  3: "'",
} as const

export function movePowerToSuffix(power: MovePower): string {
  return SUFFIXES[power]
}


export function invertMoves<M extends Move>(moves: Array<M>): Array<M> {
  return [...moves].reverse().map(move => invertMove(move));
}

export function simplifyMoves<M extends Move>(movesToSimplify: Array<M>) {
  const moves = [...movesToSimplify]
  for (let i = 0; i < moves.length;) {
    const currentMove = moves[i] // guaranteed to exist
    const nextMove = moves.at(i + 1) // may not exist
    if (nextMove === undefined) {
      // we're at the last element, no cancelling is possible
      break
    }

    if (currentMove[0] === nextMove[0]) {
      const powerOfNewMove = (powerOfMove(currentMove) + powerOfMove(nextMove)) % 4 as MovePower | 0
      // cancel
      if (powerOfNewMove === 0) {
        // moves like R R' (1+3) or U2 U2 (2+2): cancel completely
        // delete the two moves
        moves.splice(i, 2)
        // move a step back if not at the start
        i && (i -= 1)
        continue
      }
      // otherwise, it's something like R R2
      const newMove = currentMove[0] + movePowerToSuffix(powerOfNewMove) as M
      // change the first move, delete the second
      moves[i] = newMove
      moves.splice(i + 1, 1)
      i++
    } else {
      // no cancel
      i++
    }
  }
  return moves
}

// This does not include rotations
export function layerOfLayerMove(faceTurn: LayerMove): Layer {
  // This is not type-safe, TODO: find a better way
  return faceTurn[0] as Layer
}

export function axisOfRotation(rotation: RotationMove): Axis {
  return rotation[0] as Axis
}

export function moveSeqToString(moveSeq: MoveSeq) {
  return moveSeq.join(" ")
}

export function movesAreSameLayer(a: Move, b: Move): boolean {
  if (isRotation(a) || isRotation(b)) {
    return false
  }
  return layerOfLayerMove(a) === layerOfLayerMove(b)
}

export function moveSeqsAreIdentical(a: MoveSeq, b: MoveSeq): boolean {
  if (a.length !== b.length) {
    return false
  }
  return a.every((move, index) => move === b[index])
}

export function layerMovesAreParallel(a: LayerMove, b: LayerMove): boolean {
  const layerA = layerOfLayerMove(a)
  const layerB = layerOfLayerMove(b)
  return AXES.some(axis => {
    const parallelLayers = LAYERS_ALONG_AXES[axis]
    return parallelLayers.includes(layerA) && parallelLayers.includes(layerB)
  })
}

export function isFaceMove(move: Move): move is FaceMove {
  return FACE_MOVES.includes(move as FaceMove)
}

// export function isSliceMove(move: Move): move is SliceMove {
//   return SLICE_MOVES.includes(move as SliceMove)
// }

export function isLayerMove(move: Move): move is LayerMove {
  // TODO: add slice move support
  return isFaceMove(move) // || isSliceMove(move)
}

export function isRotation(move: Move): move is RotationMove {
  return ROTATIONS.includes(move as RotationMove)
}

export function endsWithRedundantParallelMoves(solution: MoveSeq): boolean {
  if (solution.length < 3) {
    return false
  }
  const [thirdLast, secondLast, last] = solution.slice(-3)
  if (isRotation(thirdLast) || isRotation(secondLast) || isRotation(last)) {
    return false
  }
  return movesAreSameLayer(thirdLast, last) && layerMovesAreParallel(thirdLast, secondLast)
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
      && (!secondLastMove || !endsWithRedundantParallelMoves([secondLastMove, lastMove, choice]))
    )
  )
  const validChoices = moveSet.filter(choiceIsValid)
  const move = sample(validChoices)
  move && moves.push(move)
}

// TODO: update OH scrambler
export function translateMoves(moves: MoveSeq, rotations: Array<RotationMove>): MoveSeq {
  return moves.map(move => translateMove(move, rotations))
}

function translateMove(move: Move, rotations: Array<RotationMove>): Move {
  let newMove = move
  rotations.forEach(rotation => {
    if (isRotation(newMove)) {
      newMove = translateRotation(newMove, rotation)
    } else {
      newMove = translateLayerMove(newMove, rotation)
    }
  })
  return newMove
}

type Cycle<T> = Array<T>

const ROTATION_TO_LAYER_CYCLES: Readonly<{ [rotation in RotationMove]: Array<Cycle<Layer>> }> = {
  "x":  [["U", "B", "D", "F"]],
  "x'": [["U", "F", "D", "B"]],
  "x2": [["U", "D"], ["F", "B"]],
  "y":  [["F", "L", "B", "R"]],
  "y'": [["F", "R", "B", "L"]],
  "y2": [["R", "L"], ["F", "B"]],
  "z":  [["U", "R", "D", "L"]],
  "z'": [["U", "L", "D", "R"]],
  "z2": [["U", "D"], ["F", "B"]],
}
function translateLayerMove(move: LayerMove, rotation: RotationMove): LayerMove {
  const layerCycles = ROTATION_TO_LAYER_CYCLES[rotation]
  for (const cycle of layerCycles) {
    const index = cycle.indexOf(layerOfLayerMove(move))
    if (index !== -1) {
      const newLayer = nextElement(cycle, index)
      const newSuffix = move[1] ?? ""
      return newLayer + newSuffix as LayerMove
    }
  }
  return move
}

type RotationMap = Readonly<{ [rotation in RotationMove]: RotationMove }>
const AXIS_TO_ROTATION_MAP: Readonly<{ [axis in Axis]: RotationMap }> = {
  x: {
    "x" : "x",
    "y" : "z'",
    "z" : "y",
    "x'": "x'",
    "y'": "z",
    "z'": "y'",
    "x2": "x2",
    "y2": "z2",
    "z2": "y2",
  },
  y: {
    "x" : "z",
    "y" : "y",
    "z" : "x'",
    "x'": "z'",
    "y'": "y'",
    "z'": "x",
    "x2": "z2",
    "y2": "y2",
    "z2": "x2",
  },
  z: {
    "x" : "y'",
    "y" : "x",
    "z" : "z",
    "x'": "y",
    "y'": "x'",
    "z'": "z'",
    "x2": "y2",
    "y2": "x2",
    "z2": "z2",
  },
}

function translateRotation(rotationToTranslate: RotationMove, rotation: RotationMove): RotationMove {
  const rotationPower = powerOfMove(rotation)
  const axis = axisOfRotation(rotation)
  const rotationMap = AXIS_TO_ROTATION_MAP[axis]
  let translatedRotation = rotationToTranslate
  for (let i = 0; i < rotationPower; i++) {
    translatedRotation = rotationMap[translatedRotation]
  }
  return translatedRotation
}

function nextElement<T>(arr: Array<T>, index: number): T {
  return arr[(index + 1) % arr.length]
}
