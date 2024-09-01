import { RotationMove } from "./moves";

export const COLORS = ["W", "O", "G", "R", "B", "Y"] as const;

export type Color = (typeof COLORS)[number];

// prettier-ignore
// All cube orientations, 1st character is the top color and 2nd is the front color
// "WG" is the default for cube states
export const CUBE_ORIENTATIONS = [
  "WO", "WG", "WR", "WB",
  "OW", "OG", "OB", "OY",
  "GW", "GO", "GR", "GY",
  "RW", "RG", "RB", "RY",
  "BW", "BO", "BR", "BY",
  "YO", "YG", "YR", "YB",
] as const satisfies Readonly<`${Color}${Color}`[]>;

export type CubeOrientation = (typeof CUBE_ORIENTATIONS)[number];

// converts cube orientations to cube rotations relative to WG
// so it gives the cube rotations needed to bring the cube from white top green front to any other orientation
const CUBE_ORIENTATIONS_TO_ROTATIONS: {
  [k in CubeOrientation]: RotationMove[];
} = {
  WO: ["y'"],
  WG: [],
  WR: ["y"],
  WB: ["y2"],
  OW: ["x'", "z"],
  OG: ["z"],
  OB: ["x2", "z"],
  OY: ["x", "z"],
  GW: ["x'", "z2"],
  GO: ["x", "y'"],
  GR: ["x", "y"],
  GY: ["x"],
  RW: ["x'", "z'"],
  RG: ["z'"],
  RB: ["x2", "z'"],
  RY: ["x", "z'"],
  BW: ["x'"],
  BO: ["x'", "y'"],
  BR: ["x'", "y"],
  BY: ["x'", "y2"],
  YO: ["x2", "y'"],
  YG: ["z2"],
  YR: ["x2", "y"],
  YB: ["x2"],
};

export function cubeOrientationToRotations(
  orientation: CubeOrientation
): RotationMove[] {
  return CUBE_ORIENTATIONS_TO_ROTATIONS[orientation];
}

const ADJACENT_COLOR_MAP: { [c in Color]: Color[] } = {
  W: ["O", "G", "R", "B"],
  O: ["W", "G", "B", "Y"],
  G: ["W", "O", "R", "Y"],
  R: ["W", "G", "B", "Y"],
  B: ["W", "O", "R", "Y"],
  Y: ["O", "G", "R", "B"],
};

export function getAdjacentColors(color: Color) {
  return ADJACENT_COLOR_MAP[color];
}
