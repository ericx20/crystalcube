import { Alg } from "cubing/alg";
// import { cube3x3x3 } from "cubing/puzzles";
// import { experimental3x3x3KPuzzle } from "cubing/kpuzzle";
// import { KState } from "cubing/kpuzzle/KState";

// interface KStateOrbitData {
//   pieces: number[];
//   orientation: number[];
// }

// export function stateToString(state: KState): string {
//   return JSON.stringify(state, null, "  ")
//     .replace(/\n +(\d+),/g, "$1, ")
//     .replace(/\n +(\d+)\n +/g, "$1");
// }

// const pieceNames: Record<string, string[]> = {
//   EDGES: "UF UR UB UL DF DR DB DL FR FL BR BL".split(" "),
//   CORNERS: "UFR URB UBL ULF DRF DFL DLB DBR".split(" "),
//   CENTERS: "ULFRBD".split(""),
// };

// interface PieceInfo {
//   piece: number;
//   orientation: number;
// }

// function rotateLeft(s: string, i: number): string {
//   return s.slice(i) + s.slice(0, i);
// }

// const pieceMap: { [s: string]: PieceInfo } = {};
// // TODO: Condense the for loops.

// const orbits = Object.keys(experimental3x3x3KPuzzle.definition.orbits);
// for (const orbit of orbits) {
//   pieceNames[orbit].forEach((piece, idx) => {
//     const numOri =
//       orbit === "CENTERS"
//         ? 1
//         : experimental3x3x3KPuzzle.definition.orbits[orbit].numOrientations;
//     for (let i = 0; i < numOri; i++) {
//       const name = rotateLeft(piece, i);
//       pieceMap[name] = { piece: idx, orientation: i };
//       if (numOri === 3) {
//         const altName = name[0] + name[2] + name[1];
//         pieceMap[altName] = { piece: idx, orientation: i };
//       }
//     }
//   });
// }

// export function kpuzzleToReidString(state: KState): string {
//   const pieces: string[] = [];

//   const addOrbit = (orbitName: string): void => {
//     for (let i = 0; i < state.stateData[orbitName].pieces.length; i++) {
//       pieces.push(
//         rotateLeft(
//           pieceNames[orbitName][state.stateData[orbitName].pieces[i]],
//           state.stateData[orbitName].orientation[i],
//         ),
//       );
//     }
//   };

//   for (const orbit of orbits) {
//     addOrbit(orbit);
//   }

//   return pieces.join(" ");
// }

// const reidStringStickerIdx = Array.prototype.concat.apply(Array.prototype, [
//   [44, 6, 40, 9, 68, 3, 48, 0, 36], // end of U
//   [46, 10, 49, 34, 70, 28, 61, 22, 58], // end of L
//   [50, 1, 37, 27, 72, 24, 57, 13, 54], // end of F
//   [38, 4, 41, 25, 74, 31, 53, 16, 66], // end of R
//   [42, 7, 45, 30, 76, 33, 65, 19, 62], // end of B
//   [56, 12, 52, 21, 78, 15, 60, 18, 64], // end of D
// ]);

// export function reidStringToStickers(s: string): number[] {
//   const arr: number[] = [];
//   for (let i = 0; i < reidStringStickerIdx.length; i++) {
//     const stickerColorFaceName = s[reidStringStickerIdx[i]];
//     const stickerColorIdx = pieceNames["CENTERS"].indexOf(stickerColorFaceName);
//     arr.push(stickerColorIdx);
//   }
//   return arr;
// }

// export function stickersToReidString(stickers: number[]): string {
//   const reidStringChars = new Array(79).fill(" ");

//   for (let i = 0; i < reidStringStickerIdx.length; i++) {
//     const stickerColorIdx = stickers[i];
//     reidStringChars[reidStringStickerIdx[i]] =
//       pieceNames["CENTERS"][stickerColorIdx];
//   }
//   return reidStringChars.join("");
// }

// export function kpuzzleToStickers(state: KState): number[] {
//   return reidStringToStickers(kpuzzleToReidString(state));
// }

// export function stickersToKPuzzle(stickers: number[]): KState {
//   return reidStringToKState(stickersToReidString(stickers));
// }

// export function reidStringToKState(s: string): KState {
//   const pieces = s.split(" ");

//   const orbit = (pieces: string[]): KStateOrbitData => {
//     const orbitState: KStateOrbitData = {
//       pieces: [],
//       orientation: [],
//     };
//     for (const piece of pieces) {
//       orbitState.pieces.push(pieceMap[piece].piece);
//       orbitState.orientation.push(pieceMap[piece].orientation);
//     }
//     return orbitState;
//   };

//   const stateData = {
//     EDGES: orbit(pieces.slice(0, 12)),
//     CORNERS: orbit(pieces.slice(12, 20)),
//     CENTERS: orbit(pieces.slice(20, 26)),
//   };
//   return new KState(experimental3x3x3KPuzzle, stateData);
// }



// (async () => {
//   const kpuzzle = await cube3x3x3.kpuzzle();
//   const needsToSolve = kpuzzle
//     .algToTransformation(new Alg("R U R' l' U' L U R U' L' U l U' R'"))
//     .toKState();

//   function solvesCase(alg: string | Alg) {
//     const potentiallySolved = needsToSolve.applyAlg(alg);
//     kpuzzleToStickers(potentiallySolved)
//     const derp = potentiallySolved.stateData
//     return potentiallySolved.experimentalIs3x3x3Solved({
//       ignorePuzzleOrientation: true,
//       ignoreCenterOrientation: true,
//     });
//   }
//   console.log(solvesCase("y l' U R' D2 R U' R' D2 R2"))
//   console.log(solvesCase("L2 B2 L' F' L B2 L' F L'"))
//   console.log(solvesCase("R U R' U R U2' R'")) // Sune, nope
// })();
