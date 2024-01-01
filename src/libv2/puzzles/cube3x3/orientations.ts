export const COLORS = ["W", "O", "G", "R", "B", "Y"] as const;

export type Color = (typeof COLORS)[number]

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


const ADJACENT_COLOR_MAP: { [c in Color]: Color[]} = {
  "W": ["O", "G", "R", "B"],
  "O": ["W", "G", "B", "Y"],
  "G": ["W", "O", "R", "Y"],
  "R": ["W", "G", "B", "Y"],
  "B": ["W", "O", "R", "Y"],
  "Y": ["O", "G", "R", "B"],
}

export function getAdjacentColors(color: Color) {
  return ADJACENT_COLOR_MAP[color];
}
