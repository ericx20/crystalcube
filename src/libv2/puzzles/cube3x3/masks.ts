import { FaceletIndex, Cube3x3Mask } from "./types";

const CENTERS: Array<FaceletIndex> = [4, 22, 25, 28, 31, 49];
const EO_FACELETS: Array<FaceletIndex> = [
  1, 3, 5, 7, 24, 26, 30, 32, 46, 48, 50, 52,
];
const CROSS_FACELETS: Array<FaceletIndex> = [
  4, 22, 25, 28, 31, 34, 37, 40, 43, 46, 48, 49, 50, 52,
];
const BACK_ARROW_FACELETS: Array<FaceletIndex> = [
  4, 22, 25, 28, 31, 34, 40, 43, 48, 49, 50, 52,
];
const LEFT_ARROW_FACELETS: Array<FaceletIndex> = [
  4, 22, 25, 28, 31, 34, 37, 43, 46, 48, 49, 52,
];
const LINE_FACELETS: Array<FaceletIndex> = [
  4, 22, 25, 28, 31, 37, 43, 46, 49, 52,
];
const PETRUS_BLOCK_FACELETS: Array<FaceletIndex> = [
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
} as const satisfies { [name: string]: Cube3x3Mask };
