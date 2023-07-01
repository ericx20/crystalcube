import { Puzzle } from "../../types";
import { Move3x3, Facelet3x3, Cube3x3Mask } from "./types";
import { MOVESETS, SOLVED_FACELET_CUBE, MOVE_PERMS, invertMove } from ".";

// TODO: is it better to make applyMove() return a brand new Cube3x3?
// in most non-trivial usages of the Puzzles, things like solvers and pruners
// will be cloning states to perform separate things with them
export class Cube3x3<Move extends Move3x3 = Move3x3> implements Puzzle<Move> {
  private state: Facelet3x3;
  private solvedState: Readonly<Facelet3x3>;
  constructor(
    private moveset: Readonly<Move[]> = MOVESETS.Full as unknown as Readonly<
      Move[]
    >,
    initialState: Readonly<Facelet3x3> = [...SOLVED_FACELET_CUBE],
    solvedState: Readonly<Facelet3x3> = initialState
  ) {
    this.state = [...initialState];
    this.solvedState = solvedState;
  }

  isSolved(): boolean {
    return this.state.join("") === this.solvedState.join("");
  }

  resetToSolved(): this {
    this.state = [...this.solvedState];
    return this;
  }

  // TODO: add turning restrictions
  // default turning restriction: after doing a move, you can't do another move of the same family
  // another turning restriction: suppose simul moves are always sorted in the order R L, F B, U D
  // so if you do L, no R moves are allowed. after F, no B moves allowed
  // that's because whenever we explore L R, then we know R L has been explored too
  get nextMoves(): readonly Move[] {
    return this.moveset;
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
    return this;
  }

  applyMoves(moves: Move[]): this {
    moves.forEach((move) => this.applyMove(move));
    return this;
  }

  clone() {
    return new Cube3x3<Move>(this.moveset, this.state, this.solvedState);
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
