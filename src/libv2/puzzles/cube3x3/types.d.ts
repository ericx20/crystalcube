import { FACES, LAYERS, AXES, SUFFIXES } from ".";

export type Face = (typeof FACES)[number];
export type Layer = (typeof LAYERS)[number];
export type Axis = (typeof AXES)[number];
export type Facelet = Face | "O" | "X"; // "O" is a facelet that identifies edge/corner orientation, X is a wildcard facelet
export type Facelet3x3 = Array<Facelet>;
export type FaceletIndex = number; // int from 0 to 53, represents a facelet's location

export type Suffix = (typeof SUFFIXES)[number];

export type LayerMove = `${Layer}${Suffix}`; // include slices and wide moves
export type CubeRotation = `${Axis}${Suffix}`;
// TODO: rename Move3x3 to Move, and update generics to be like <M extends Move> not <Move extends Move3x3>
export type Move3x3 = `${Layer | Axis}${Suffix}`;

export interface Cube3x3Mask {
  solvedFaceletIndices: readonly FaceletIndex[];
  eoFaceletIndices?: readonly FaceletIndex[];
}
