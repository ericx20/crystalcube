import { Puzzle } from "../../types";
import { Move3x3, Facelet3x3, Cube3x3Mask } from "./types";
import { MOVESETS, SOLVED_FACELET_CUBE, MOVE_PERMS, invertMove, sameLayerOrAxis } from ".";

// TODO: is it better to make applyMove() return a brand new Cube3x3?
// in most non-trivial usages of the Puzzles, things like solvers and pruners
// will be cloning states to perform separate things with them
export class Cube3x3<Move extends Move3x3 = Move3x3> implements Puzzle<Move> {
  private state: Facelet3x3;
  private solvedState: Readonly<Facelet3x3>;
  // TODO: refactor to accept an "options" object, there are too many parameters now
  constructor(
    private moveset: Readonly<Move[]> = MOVESETS.Full as unknown as Readonly<
      Move[]
    >,
    initialState: Readonly<Facelet3x3> = [...SOLVED_FACELET_CUBE],
    solvedState: Readonly<Facelet3x3> = initialState,
    private history: Move[] = [],
    // TODO: allow passing in history-based turning restrictions
  ) {
    this.state = [...initialState];
    this.solvedState = solvedState;
  }

  isSolved(): boolean {
    return this.state.every((facelet, index) => facelet === this.solvedState[index]);
  }

  resetToSolved(): this {
    this.state = [...this.solvedState];
    this.history = [];
    return this;
  }

  resetToSolved2(): this {
    this.state = [...this.solvedState];
    this.history = [];
    return this;
  }

  private isMoveAvailable(move: Move): boolean {
    const lastMove = this.history.at(-1);
    if (lastMove && sameLayerOrAxis(move, lastMove)) {
      return false;
    }

    // TODO: after L moves, disallow R moves. Same for B and F, D and U moves.
    // ensures simul moves are always sorted in the order R L, F B, U D
    return true;
  }

  get nextMoves(): readonly Move[] {
    return this.moveset.filter((move) => this.isMoveAvailable(move));
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
    this.history.push(move);
    return this;
  }

  applyMoves(moves: Move[]): this {
    moves.forEach((move) => this.applyMove(move));
    this.history = this.history.concat(moves);
    return this;
  }

  clone() {
    return new Cube3x3<Move>(this.moveset, this.state, this.solvedState, this.history);
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
