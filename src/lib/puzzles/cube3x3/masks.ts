import { FaceletIndex } from ".";

export interface Cube3x3Mask {
  solvedFaceletIndices: readonly FaceletIndex[];
  eoFaceletIndices?: readonly FaceletIndex[];
}

const CENTERS: FaceletIndex[] = [4, 22, 25, 28, 31, 49];
const EO_FACELETS: FaceletIndex[] = [
  1, 3, 5, 7, 24, 26, 30, 32, 46, 48, 50, 52,
];
const CROSS_FACELETS: FaceletIndex[] = [
  4, 22, 25, 28, 31, 34, 37, 40, 43, 46, 48, 49, 50, 52,
];
const FB_FACELETS: FaceletIndex[] = [
  21, 22, 23, 24, 32, 33, 34, 35, 36, 44, 45, 48, 51,
];
const SB_FACELETS: FaceletIndex[] = [
  26, 27, 28, 29, 30, 38, 39, 40, 41, 42, 47, 50, 53,
];
const BACK_ARROW_FACELETS: FaceletIndex[] = [
  4, 22, 25, 28, 31, 34, 40, 43, 48, 49, 50, 52,
];
const LEFT_ARROW_FACELETS: FaceletIndex[] = [
  4, 22, 25, 28, 31, 34, 37, 43, 46, 48, 49, 52,
];
const LINE_FACELETS: FaceletIndex[] = [4, 22, 25, 28, 31, 37, 43, 46, 49, 52];
const PETRUS_BLOCK_FACELETS: FaceletIndex[] = [
  4, 21, 22, 25, 28, 31, 32, 33, 34, 43, 44, 48, 49, 51, 52,
];

export const MASKS = {
  EO: {
    solvedFaceletIndices: CENTERS,
    eoFaceletIndices: EO_FACELETS,
  },
  EOLine: {
    solvedFaceletIndices: LINE_FACELETS,
    eoFaceletIndices: EO_FACELETS,
  },
  EOCross: {
    solvedFaceletIndices: CROSS_FACELETS,
    eoFaceletIndices: EO_FACELETS,
  },
  EOArrowBack: {
    solvedFaceletIndices: BACK_ARROW_FACELETS,
    eoFaceletIndices: EO_FACELETS,
  },
  EOArrowLeft: {
    solvedFaceletIndices: LEFT_ARROW_FACELETS,
    eoFaceletIndices: EO_FACELETS,
  },
  EO222: {
    solvedFaceletIndices: PETRUS_BLOCK_FACELETS,
    eoFaceletIndices: EO_FACELETS,
  },
  Cross: {
    solvedFaceletIndices: CROSS_FACELETS,
  },
  FB: {
    solvedFaceletIndices: FB_FACELETS,
  },
  F2B: {
    solvedFaceletIndices: [...FB_FACELETS, ...SB_FACELETS],
  },
} as const satisfies { [name: string]: Cube3x3Mask };
