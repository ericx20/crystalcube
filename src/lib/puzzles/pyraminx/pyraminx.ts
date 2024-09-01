import { Perm, Puzzle } from "src/lib/types";
import { invertPerm } from "../common";

type Layer = "R" | "L" | "U" | "B";
// TODO
export type Move = `${Layer}${"" | "'"}` | "Rv" | "Uv" | "Rv'" | "Uv'";

// ignoring tips
export const SOLVED_V: FaceletPyra = [
  ..."RRXXXXXXXBB",
  ..."RRXXXXXBB",
  ..."RGGXGGB",
  ..."YYXYY",
  ..."YYY",
  ..."Y",
];

export const SOLVED: FaceletPyra = [
  ..."RRRRRGBBBBB",
  ..."RRRGGGBBB",
  ..."RGGGGGB",
  ..."YYYYY",
  ..."YYY",
  ..."Y",
];

export const V_MASK: PyraMask = {
  solvedFaceletIndices: [
    0, 1, 9, 10, 11, 12, 18, 19, 20, 21, 22, 24, 25, 26, 27, 28, 30, 31, 32, 33,
    34, 35,
  ],
};

// NOT INCLUDING TIPS
const BASIC_MOVE_PERMS: { [l in Layer]: Perm } = {
  R: [
    [17, 34],
    [18, 30],
    [19, 29],
    [16, 19],
    [24, 18],
    [23, 17],
    [29, 16],
    [30, 24],
    [34, 23],
    [25, 26],
    [26, 31],
    [31, 25],
  ],
  U: [
    [2, 17],
    [3, 7],
    [13, 8],
    [17, 14],
    [7, 15],
    [8, 16],
    [14, 2],
    [15, 3],
    [16, 13],
    [4, 6],
    [6, 5],
    [5, 4],
  ],
  L: [
    [11, 14],
    [12, 22],
    [13, 23],
    [14, 29],
    [22, 28],
    [23, 32],
    [29, 11],
    [28, 12],
    [32, 13],
    [20, 21],
    [21, 27],
    [27, 20],
  ],
  B: [
    [8, 11],
    [9, 1],
    [19, 2],
    [11, 34],
    [1, 33],
    [2, 32],
    [32, 19],
    [33, 9],
    [34, 8],
    [10, 0],
    [0, 35],
    [35, 10],
  ],
};
const { R, U, L, B } = BASIC_MOVE_PERMS;
const Rv: Perm = [
  ...R,
  [21, 6],
  [22, 7],
  [14, 8],
  [15, 9],
  [5, 10],
  [6, 35],
  [7, 33],
  [8, 32],
  [9, 28],
  [10, 27],
  [35, 21],
  [33, 22],
  [32, 14],
  [28, 15],
  [27, 5],
  [20, 4],
  [12, 3],
  [13, 2],
  [3, 1],
  [4, 0],
  [2, 11],
  [1, 12],
  [0, 20],
  [11, 13],
];
const Uv: Perm = [
  ...U,
  ...invertPerm([
    [0, 21],
    [1, 22],
    [11, 23],
    [12, 24],
    [20, 25],
    [21, 26],
    [22, 18],
    [23, 19],
    [24, 9],
    [25, 10],
    [26, 0],
    [18, 1],
    [19, 11],
    [9, 12],
    [10, 20],
    [27, 31],
    [28, 30],
    [29, 34],
    [30, 33],
    [31, 35],
    [34, 32],
    [33, 28],
    [35, 27],
    [32, 29],
  ]),
];
const MOVE_PERMS = {
  R,
  U,
  L,
  B,
  "R'": invertPerm(R),
  "U'": invertPerm(U),
  "L'": invertPerm(L),
  "B'": invertPerm(B),
  Rv,
  Uv,
  "Rv'": invertPerm(Rv),
  "Uv'": invertPerm(Uv),
};

type FaceletPyra = string[]; // todo make it more precise

// single orientation
export class PyraV implements Puzzle<Move> {
  private state: FaceletPyra;
  private solvedState: Readonly<FaceletPyra>;
  // private lastMove: Move | null;
  private moveset: Move[] = ["R", "R'", "U", "U'", "L", "L'", "B", "B'"];
  private moveHistory: Move[];

  constructor(
    initialState: Readonly<FaceletPyra> = [...SOLVED_V], // can we shallow copy?
    solvedState: Readonly<FaceletPyra> = initialState,
    // lastMove: Move | null = null
    history: Move[] = []
  ) {
    this.state = [...initialState];
    this.solvedState = solvedState;
    // this.lastMove = lastMove;
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
    return true;
    // TODO
    // if (this.lastMove === null) return true;
    // return move[0] !== this.lastMove[0];
  }

  get nextMoves(): readonly Move[] {
    return this.moveset.filter((move) => this.isMoveAvailable(move));
  }

  get stateData(): FaceletPyra {
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
    // this.lastMove = move;
    this.moveHistory.push(move);
    return this;
  }

  applyMoves(moves: Move[]): this {
    moves.forEach((move) => this.applyMove(move));
    this.moveHistory = this.moveHistory.concat(moves);
    return this;
  }

  clone() {
    return new PyraV(this.state, this.solvedState, this.moveHistory);
  }

  get history(): Move[] {
    return [...this.moveHistory];
  }

  resetHistory(): this {
    // this.lastMove = null;
    this.moveHistory = [];
    return this;
  }

  print() {
    const str = this.encode();
    console.log(str.slice(0, 11));
    console.log(str.slice(11, 11 + 9));
    console.log(str.slice(11 + 9, 11 + 9 + 7));
    console.log(str.slice(11 + 9 + 7, 11 + 9 + 7 + 5));
    console.log(str.slice(11 + 9 + 7 + 5, 11 + 9 + 7 + 5 + 3));
    console.log(str.slice(11 + 9 + 7 + 5 + 3, 11 + 9 + 7 + 5 + 3 + 1));
    return this;
  }
}

export interface PyraMask {
  solvedFaceletIndices: readonly number[];
  eoFaceletIndices?: readonly number[];
}
// apply a mask to facelet cube
export function getMaskedPyra(
  mask: PyraMask,
  stateData: FaceletPyra = SOLVED
): FaceletPyra {
  return [...Array(36).keys()].map((faceletIdx) => {
    if (mask.solvedFaceletIndices.includes(faceletIdx)) {
      return stateData[faceletIdx];
    }
    if (mask.eoFaceletIndices?.includes(faceletIdx)) {
      return "O";
    }
    return "X";
  });
}

// TODO MOVE OUT
export function invertMove<M extends Move>(move: M): M {
  // This is only safe as long as Move is conventional Singmaster notation
  if (move.includes("'")) return move.replace("'", "") as M;
  return (move + "'") as M;
}

export function invertMoves<M extends Move>(moves: M[]): M[] {
  return moves.map(invertMove).reverse();
}
