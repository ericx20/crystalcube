import { Face } from ".";

export type Facelet = Face | "O" | "X"; // "O" is a facelet that identifies edge/corner orientation, X is a wildcard facelet
export type Facelet3x3 = Array<Facelet>;
export type FaceletIndex = number; // int from 0 to 53, represents a facelet's location

// The facelets are indexed like this:
//                +----+----+----+
//                |  0 |  1 |  2 |
//                +----+----+----+
//                |  3 |  4 |  5 |
//                +----+----+----+
//                |  6 |  7 |  8 |
// +----+----+----+----+----+----+----+----+----+----+----+----+
// |  9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
// +----+----+----+----+----+----+----+----+----+----+----+----+
// | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 |
// +----+----+----+----+----+----+----+----+----+----+----+----+
// | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 |
// +----+----+----+----+----+----+----+----+----+----+----+----+
//                | 45 | 46 | 47 |
//                +----+----+----+
//                | 48 | 49 | 50 |
//                +----+----+----+
//                | 51 | 52 | 53 |
//                +----+----+----+
// prettier-ignore
export const SOLVED_FACELET_CUBE: Readonly<Facelet3x3> = [
               "U", "U", "U",
               "U", "U", "U",
               "U", "U", "U",
"L", "L", "L", "F", "F", "F", "R", "R", "R", "B", "B", "B",
"L", "L", "L", "F", "F", "F", "R", "R", "R", "B", "B", "B",
"L", "L", "L", "F", "F", "F", "R", "R", "R", "B", "B", "B",
               "D", "D", "D",
               "D", "D", "D",
               "D", "D", "D",
];
