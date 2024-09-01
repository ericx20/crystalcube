import { Puzzle } from "../../types";
import { Move3x3, Facelet3x3, Cube3x3Mask, Facelet } from ".";
import {
  MOVESETS,
  SOLVED_FACELET_CUBE,
  MOVE_PERMS,
  sameLayerOrAxis,
  layerOfLayerMove,
  isLayerMove,
  isValidMove,
} from ".";

// TODO: make applyMove() return a brand new Cube3x3
// in most non-trivial usages of the Puzzles, things like solvers and pruners
// will be cloning states to perform separate things with them
// TODO: refactor to accept an optional TurningRestriction object that manages
// move history and what turns are/aren't allowed, and which can also be cloned
export class Cube3x3 implements Puzzle<Move3x3> {
  private state: Facelet3x3;
  private solvedState: Readonly<Facelet3x3>;
  private moveHistory: Move3x3[];
  constructor(
    private moveset: Readonly<Move3x3[]> = MOVESETS.Full,
    initialState: Readonly<Facelet3x3> = [...SOLVED_FACELET_CUBE], // can we shallow copy this
    solvedState: Readonly<Facelet3x3> = initialState,
    history: Move3x3[] = []
    // TODO: allow passing in history-based turning restrictions
  ) {
    this.state = [...initialState];
    this.solvedState = solvedState;
    this.moveHistory = [...history];
  }

  isSolved(): boolean {
    return this.state.every(
      (facelet, index) => facelet === this.solvedState[index]
    );
  }

  setSolved(): this {
    this.solvedState = [...this.state];
    this.resetHistory();
    return this;
  }

  resetToSolved(): this {
    this.state = [...this.solvedState];
    this.resetHistory();
    return this;
  }

  private isMoveAvailable(move: Move3x3): boolean {
    const lastMove = this.moveHistory.at(-1);
    // const secondLastMove = this.history.at(-2);
    if (lastMove && sameLayerOrAxis(move, lastMove)) {
      return false;
    }

    if (lastMove && isLayerMove(lastMove) && isLayerMove(move)) {
      // R L and L R are the same. To reduce redundant solutions, after L moves disallow R
      // same for U D and F B
      // follow convention of sorting these parallel moves as R L, F B, U D
      const lastMoveLayer = layerOfLayerMove(lastMove);
      const thisMoveLayer = layerOfLayerMove(move);
      if (
        (lastMoveLayer === "L" && thisMoveLayer === "R") ||
        (lastMoveLayer === "D" && thisMoveLayer === "U") ||
        (lastMoveLayer === "B" && thisMoveLayer === "F")
      ) {
        return false;
      }

      // very specific one for RrUM, where last move and this move are in [r, M, R]
      // - M and R moves must be sorted like M R not R M (after R moves, M not allowed)
      // - after M', R not allowed. after M, R' not allowed. after M2, R2 not allowed
      // - after M moves, r moves are not allowed
      // - after R/r moves, r/R moves are not allowed
      // TODO: this does not work sometimes for RrUM, also make this configurable
      if (lastMoveLayer === "R" && thisMoveLayer === "M") return false;
      if (
        (lastMove === "M'" && move === "R") ||
        (lastMove === "M" && move === "R'") ||
        (lastMove === "M2" && move === "R2")
      )
        return false;
      if (lastMoveLayer === "M" && thisMoveLayer === "R") return false;
      if (lastMoveLayer === "R" && thisMoveLayer === "r") return false;
      if (lastMoveLayer === "r" && thisMoveLayer === "R") return false;
    }
    return true;
  }

  get nextMoves(): readonly Move3x3[] {
    return this.moveset.filter((move) => this.isMoveAvailable(move));
  }

  get history(): Move3x3[] {
    return [...this.moveHistory];
  }

  get stateData(): Facelet3x3 {
    return [...this.state];
  }

  get EO(): boolean[] {
    return getEO(this.state);
  }

  encode(): string {
    return this.state.join("");
  }

  applyMove(move: Move3x3): this {
    const nextState = [...this.state];
    const perms = MOVE_PERMS[move];
    perms.forEach(([src, dst]) => {
      nextState[dst] = this.state[src];
    });
    this.state = nextState;
    this.moveHistory.push(move);
    return this;
  }

  applyMoves(moves: Move3x3[]): this {
    moves.forEach((move) => this.applyMove(move));
    return this;
  }

  applyMask(mask: Cube3x3Mask): this {
    this.state = getMaskedFaceletCube(mask, this.state);
    this.solvedState = getMaskedFaceletCube(mask, this.solvedState);
    return this;
  }

  print() {
    printFaceletCube(this.state);
  }

  clone() {
    return new Cube3x3(
      this.moveset,
      this.state,
      this.solvedState,
      this.moveHistory
    );
  }

  resetHistory(): this {
    this.moveHistory = [];
    return this;
  }

  static parseNotation(input: string): Move3x3[] | null {
    const moves: string[] = input
      .trim() // remove whitespace padding
      .replaceAll(/[’`]/g, "'") // replace incorrect apostrophes
      .split(/\s+/) // split the string by whitespace into an array of moves
      .filter((m) => m); // remove empty moves
    if (!moves.every(isValidMove)) return null;
    return moves;
  }
}

// apply a mask to facelet cube
function getMaskedFaceletCube(
  mask: Cube3x3Mask,
  stateData: Readonly<Facelet3x3> = SOLVED_FACELET_CUBE
): Facelet3x3 {
  return [...Array(54).keys()].map((faceletIdx) => {
    if (mask.solvedFaceletIndices.includes(faceletIdx)) {
      return stateData[faceletIdx];
    }
    if (mask.eoFaceletIndices?.includes(faceletIdx)) {
      return "O";
    }
    return "X";
  });
}

// To recognize edge orientation, we need to look at two "orbits" (sets of facelet locations) for edges.
// We call one of them the "primary orbit" and the other the "secondary orbit".
// Each edge has two facelets, one of them will always be in the primary orbit and the other in the secondary orbit.
// The edge facelets are indexed in the order [UB, UL, UR, UF, BL, FL, FR, BR, DF, DL, DR, DB] for these constants.
const PRIMARY_ORBIT: Readonly<number[]> = [
  1, 3, 5, 7, 32, 24, 26, 30, 46, 48, 50, 52,
];
const SECONDARY_ORBIT: Readonly<number[]> = [
  19, 10, 16, 13, 21, 23, 27, 29, 37, 34, 40, 43,
];

/**
 * Recognizes Edge Orientation (EO) with respect to the F/B axis. In other words, which edges may be solved using R, L, U, D moves.
 * @param stateData The state of a facelet cube
 * @param preRotation Rotations to apply before recognizing EO.
 * @returns whether each edge is good or bad, in the order [UB, UL, UR, UF, BL, FL, FR, BR, DF, DL, DR, DB]
 */
function getEO(facelets: Readonly<Facelet3x3>): boolean[] {
  const uCenterFacelet = facelets[4];
  const dCenterFacelet = facelets[49];
  const lCenterFacelet = facelets[22];
  const rCenterFacelet = facelets[28];
  const colorsBelongingInPrimaryOrbit: Array<Facelet> = [
    uCenterFacelet,
    dCenterFacelet,
    "O",
  ];
  const colorsBelongingInSecondaryOrbit: Array<Facelet> = [
    lCenterFacelet,
    rCenterFacelet,
  ];

  return [...Array(12).keys()].map((index) => {
    const faceletOnPrimaryOrbit = facelets[PRIMARY_ORBIT[index]];
    const faceletOnSecondaryOrbit = facelets[SECONDARY_ORBIT[index]];
    return (
      colorsBelongingInPrimaryOrbit.includes(faceletOnPrimaryOrbit) ||
      colorsBelongingInSecondaryOrbit.includes(faceletOnSecondaryOrbit)
    );
  });
}

// TEMP
const xxx = "➖➖➖";
const xxxxxx = "➖➖➖➖➖➖";
const xxxxxxxxxxxx = "➖➖➖➖➖➖➖➖➖➖➖➖";
export function printFaceletCube(cube: Facelet3x3): void {
  const emojiCube = faceletCubeToEmojiCube(cube);
  const slice = (start: number, end: number) =>
    emojiCube.slice(start, end).join("");
  console.log(xxxxxxxxxxxx);
  console.log(xxx + slice(0, 3) + xxxxxx);
  console.log(xxx + slice(3, 6) + xxxxxx);
  console.log(xxx + slice(6, 9) + xxxxxx);
  console.log(slice(9, 21));
  console.log(slice(21, 33));
  console.log(slice(33, 45));
  console.log(xxx + slice(45, 48) + xxxxxx);
  console.log(xxx + slice(48, 51) + xxxxxx);
  console.log(xxx + slice(51, 54) + xxxxxx);
  console.log(xxxxxxxxxxxx);
}

const faceletToEmoji = (f: Facelet): string =>
  ({
    R: "🟥",
    L: "🟧",
    U: "⬜",
    D: "🟨",
    F: "🟩",
    B: "🟦",
    O: "🟪",
    X: "⬛",
  }[f]);

function faceletCubeToEmojiCube(cube: Facelet3x3): Array<string> {
  return cube.map(faceletToEmoji);
}
