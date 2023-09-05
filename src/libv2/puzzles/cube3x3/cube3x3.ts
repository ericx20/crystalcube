import { Puzzle } from "../../types";
import { Move3x3, Facelet3x3, Cube3x3Mask, Facelet } from "./types";
import {
  MOVESETS,
  SOLVED_FACELET_CUBE,
  MOVE_PERMS,
  sameLayerOrAxis,
  layerOfLayerMove,
  isLayerMove,
  isValidMove,
} from ".";

// TODO: is it better to make applyMove() return a brand new Cube3x3?
// in most non-trivial usages of the Puzzles, things like solvers and pruners
// will be cloning states to perform separate things with them
export class Cube3x3<Move extends Move3x3 = Move3x3> implements Puzzle<Move> {
  private state: Facelet3x3;
  private solvedState: Readonly<Facelet3x3>;
  private moveHistory: Move[];
  // TODO: refactor to accept an "options" object, there are too many parameters now
  constructor(
    private moveset: Readonly<Move[]> = MOVESETS.Full as unknown as Readonly<
      Move[]
    >,
    initialState: Readonly<Facelet3x3> = [...SOLVED_FACELET_CUBE], // can we shallow copy this
    solvedState: Readonly<Facelet3x3> = initialState,
    history: Move[] = []
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

  resetToSolved(): this {
    this.state = [...this.solvedState];
    this.resetHistory();
    return this;
  }

  private isMoveAvailable(move: Move): boolean {
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

  get nextMoves(): readonly Move[] {
    return this.moveset.filter((move) => this.isMoveAvailable(move));
  }

  get history(): Move[] {
    return [...this.moveHistory];
  }

  get stateData(): Facelet3x3 {
    return [...this.state];
  }

  encode(): string {
    return this.state.join("");
  }

  applyMove(move: Move): this {
    const nextState = [...this.state];
    const perms = MOVE_PERMS[move];
    perms.forEach(([src, dst]) => {
      nextState[dst] = this.state[src];
    });
    this.state = nextState;
    this.moveHistory.push(move);
    return this;
  }

  applyMoves(moves: Move[]): this {
    moves.forEach((move) => this.applyMove(move));
    return this;
  }

  print() {
    printFaceletCube(this.state);
  }

  clone() {
    return new Cube3x3<Move>(
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
export function getMaskedFaceletCube(
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

const faceletToEmoji: { [f in Facelet]: string } = {
  R: "🟥",
  L: "🟧",
  U: "⬜",
  D: "🟨",
  F: "🟩",
  B: "🟦",
  O: "🟪",
  X: "⬛",
};

function faceletCubeToEmojiCube(cube: Facelet3x3): Array<string> {
  return cube.map((facelet) => faceletToEmoji[facelet]);
}
