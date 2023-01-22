import { AXES, FACES, METHODS, METHOD_SOLVERS, SLICES, SOLVER_CONFIG_NAMES } from "./constants"


// ----- FACES  -----

export type Face = typeof FACES[number]
export type Slice = typeof SLICES[number]
export type Layer = Face | Slice
export type Facelet = Face | "O" | "X" // "O" is a facelet that identifies edge orientation, X is a wildcard facelet
export type IndexedFacelet = number // int from 0 to 53, represents a facelet
export type FaceletIndex = number // int from 0 to 53, represents a facelet's location
export type Axis = typeof AXES[number]
export type Perm<T = FaceletIndex> = [T, T]
export type Piece = Exclude<`${"U" | "D" | ""}${"F" | "B" | ""}${"R" | "L" | ""}`, "">

// ----- MOVES AND NOTATION -----

type Suffix = "" | "'" | "2"
export type FaceMove = `${Face}${Suffix}`
export type SliceMove = `${Slice}${Suffix}`
// TODO: once we support slices, add SliceMove to LayerMove
export type LayerMove = FaceMove // | SliceMove

export type RotationMove = `${Axis}${Suffix}`

export type Move = LayerMove | RotationMove
export type MoveSeq = Array<Move>
export type LayerMoveSeq = Array<LayerMove>
export type RotationSeq = Array<RotationMove>
export type MoveSet = Readonly<Array<LayerMove>>

// ----- CUBE STATE REPRESENTATIONS -----

// FaceletCube represents the state of the cube based on the coloured tiles
// (a.k.a. "facelets").
// FaceletCube is an array of 54 facelet colours.
// The order of the facelet colours is the same as reading a standard cube net
// from left to right
export type FaceletCube = Array<Facelet>

// IndexedFaceletCube is like FaceletCube, but we label each facelet not by its
// colour but by its solved position's index, which is unique
// This lets us distinguish between facelets of the same colour, and talk about
// specific facelet positions on the cube.
// IndexedFaceletCube is an array of 54 numbers, each number is within 0 to 53.
export type IndexedFaceletCube = Array<IndexedFacelet>

export type Cube = FaceletCube | IndexedFaceletCube

// The order of edges is the same as reading a standard cube net from left to right
// UB, UL, UR, UF, BL, FL, FR, BR, DF, DL, DR, DB
export type EO = Array<boolean>

export interface Mask {
  solvedFaceletIndices: Readonly<Array<IndexedFacelet>>
  eoFaceletIndices?: Readonly<Array<IndexedFacelet>>
}


// ----- SOLVER -----
export type SolverConfigName = typeof SOLVER_CONFIG_NAMES[number]

export interface SolverConfig {
  moveSet: MoveSet
  mask: Mask
  pruningDepth: number
  depthLimit: number
  nMoveScrambleConfig: NMoveScrambleConfig
  isEOStep?: boolean,
}

export interface NMoveScrambleConfig {
  min: number,
  max: number, // cannot exceed `depthLimit` from the solver config
  iterationLimit: number,
}

// Pruning table maps a FaceletCube (concatenated into a string) to its optimally solved movecount
export type PruningTable = { [k: string]: number }

// TODO
export interface SolutionWithPreRotation {
  preRotation: Array<RotationMove>
  solution: MoveSeq
}

export type Method = typeof METHODS[number]
export type ZZConfigName = typeof METHOD_SOLVERS.ZZ[number]
