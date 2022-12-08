// https://observablehq.com/@onionhoney/how-to-model-a-rubiks-cube

// TODO: improve solver, clean up, convert to TypeScript
// TODO: somehow cache pruning table or generate when needed, otherwise page load is slowed down significantly
// TODO: move all export statements to the very bottom, export { eocross_solver, ... }

const solved_fcube = "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB"
const solved_ifcube = Array(54).fill("").map((_, i) => i)

// ----- CUBE -----

// Utility function that takes the name of a sticker (like U1 or D8), and returns
// the index of that sticker in the string representation (like 0 or 34)
// face: single character, one of U,R,F,D,L,B
// idx: integer from 1 to 9
// returns integer from 0 to 53
function S(face, idx) {
    return "URFDLB".indexOf(face) * 9 + idx - 1
}

// Utility function that converts a cycle of many stickers, into a list of permutations
// a cycle is an array of stickers such as [a, b, c] which means "a->b, b->c, c->a"
// and so the permutation is [[a, b], [b, c], [c, a]]
// a permutation is an array of sticker pairs [src, dst]
// where the source sticker gets replaced by destination
function perm_from_cycle(cycle) {
    let perms = []
    for (let i = 0; i < cycle.length - 1; i++) {
        perms.push([cycle[i], cycle[i + 1]])
    }
    perms.push([cycle[cycle.length - 1], cycle[0]])
    return perms
}

// a move is a list of permutations

// TESTING U MOVE
const u_move =
    [
        perm_from_cycle([S("U", 1), S("U", 3), S("U", 9), S("U", 7)]),
        perm_from_cycle([S("U", 2), S("U", 6), S("U", 8), S("U", 4)]),
        perm_from_cycle([S("F", 1), S("L", 1), S("B", 1), S("R", 1)]),
        perm_from_cycle([S("F", 2), S("L", 2), S("B", 2), S("R", 2)]),
        perm_from_cycle([S("F", 3), S("L", 3), S("B", 3), S("R", 3)]),
    ].flat()

// dictionary that maps move notation to moves (e.g. U' to a list of permutations)
const fmoves = {
    "U":  [[ 0,  2], [ 3,  1], [ 6,  0], [18, 36], [ 1,  5], [ 7,  3], [19, 37], [11, 20], [ 2,  8], [10, 19], [ 5,  7], [ 9, 18], [ 8,  6], [20, 38], [47, 11], [46, 10], [36, 45], [37, 46], [38, 47], [45,  9]],
    "U2": [[ 0,  8], [ 3,  5], [ 6,  2], [18, 45], [ 1,  7], [ 7,  1], [19, 46], [11, 38], [ 2,  6], [10, 37], [ 5,  3], [ 9, 36], [ 8,  0], [20, 47], [47, 20], [46, 19], [36,  9], [37, 10], [38, 11], [45, 18]],
    "U'": [[ 0,  6], [ 3,  7], [ 6,  8], [18,  9], [ 1,  3], [ 7,  5], [19, 10], [11, 47], [ 2,  0], [10, 46], [ 5,  1], [ 9, 45], [ 8,  2], [20, 11], [47, 38], [46, 37], [36, 18], [37, 19], [38, 20], [45, 36]],
    "D":  [[17, 53], [24, 15], [16, 52], [15, 51], [25, 16], [26, 17], [42, 24], [33, 27], [53, 44], [43, 25], [30, 28], [44, 26], [27, 29], [34, 30], [52, 43], [28, 32], [35, 33], [51, 42], [32, 34], [29, 35]],
    "D2": [[17, 44], [24, 51], [16, 43], [15, 42], [25, 52], [26, 53], [42, 15], [33, 29], [53, 26], [43, 16], [30, 32], [44, 17], [27, 35], [34, 28], [52, 25], [28, 34], [35, 27], [51, 24], [32, 30], [29, 33]],
    "D'": [[17, 26], [24, 42], [16, 25], [15, 24], [25, 43], [26, 44], [42, 51], [33, 35], [53, 17], [43, 52], [30, 34], [44, 53], [27, 33], [34, 32], [52, 16], [28, 30], [35, 29], [51, 15], [32, 28], [29, 27]],
    "u":  [[ 0,  2], [ 3,  1], [21, 39], [ 6,  0], [18, 36], [14, 23], [ 1,  5], [13, 22], [22, 40], [12, 21], [ 7,  3], [19, 37], [11, 20], [ 2,  8], [10, 19], [ 5,  7], [23, 41], [ 9, 18], [ 8,  6], [20, 38], [50, 14], [47, 11], [39, 48], [40, 49], [49, 13], [41, 50], [46, 10], [36, 45], [37, 46], [48, 12], [38, 47], [45,  9]],
    "u2": [[ 0,  8], [ 3,  5], [21, 48], [ 6,  2], [18, 45], [14, 41], [ 1,  7], [13, 40], [22, 49], [12, 39], [ 7,  1], [19, 46], [11, 38], [ 2,  6], [10, 37], [ 5,  3], [23, 50], [ 9, 36], [ 8,  0], [20, 47], [50, 23], [47, 20], [39, 12], [40, 13], [49, 22], [41, 14], [46, 19], [36,  9], [37, 10], [48, 21], [38, 11], [45, 18]],
    "u'": [[ 0,  6], [ 3,  7], [21, 12], [ 6,  8], [18,  9], [14, 50], [ 1,  3], [13, 49], [22, 13], [12, 48], [ 7,  5], [19, 10], [11, 47], [ 2,  0], [10, 46], [ 5,  1], [23, 14], [ 9, 45], [ 8,  2], [20, 11], [50, 41], [47, 38], [39, 21], [40, 22], [49, 40], [41, 23], [46, 37], [36, 18], [37, 19], [48, 39], [38, 20], [45, 36]],
    "d":  [[17, 53], [24, 15], [16, 52], [21, 12], [15, 51], [14, 50], [25, 16], [13, 49], [22, 13], [12, 48], [26, 17], [23, 14], [42, 24], [33, 27], [53, 44], [43, 25], [30, 28], [50, 41], [44, 26], [27, 29], [39, 21], [34, 30], [52, 43], [40, 22], [49, 40], [41, 23], [28, 32], [35, 33], [51, 42], [32, 34], [48, 39], [29, 35]],
    "d2": [[17, 44], [24, 51], [16, 43], [21, 48], [15, 42], [14, 41], [25, 52], [13, 40], [22, 49], [12, 39], [26, 53], [23, 50], [42, 15], [33, 29], [53, 26], [43, 16], [30, 32], [50, 23], [44, 17], [27, 35], [39, 12], [34, 28], [52, 25], [40, 13], [49, 22], [41, 14], [28, 34], [35, 27], [51, 24], [32, 30], [48, 21], [29, 33]],
    "d'": [[17, 26], [24, 42], [16, 25], [21, 39], [15, 24], [14, 23], [25, 43], [13, 22], [22, 40], [12, 21], [26, 44], [23, 41], [42, 51], [33, 35], [53, 17], [43, 52], [30, 34], [50, 14], [44, 53], [27, 33], [39, 48], [34, 32], [52, 16], [40, 49], [49, 13], [41, 50], [28, 30], [35, 29], [51, 15], [32, 28], [48, 12], [29, 27]],
    "E":  [[21, 39], [14, 23], [13, 22], [22, 40], [12, 21], [23, 41], [50, 14], [39, 48], [40, 49], [49, 13], [41, 50], [48, 12]],
    "E2": [[21, 48], [14, 41], [13, 40], [22, 49], [12, 39], [23, 50], [50, 23], [39, 12], [40, 13], [49, 22], [41, 14], [48, 21]],
    "E'": [[21, 12], [14, 50], [13, 49], [22, 13], [12, 48], [23, 14], [50, 41], [39, 21], [40, 22], [49, 40], [41, 23], [48, 39]],
    "y":  [[17, 26], [ 0,  2], [24, 42], [16, 25], [ 3,  1], [21, 39], [15, 24], [ 6,  0], [18, 36], [14, 23], [ 1,  5], [25, 43], [13, 22], [22, 40], [12, 21], [ 7,  3], [19, 37], [11, 20], [ 2,  8], [26, 44], [10, 19], [ 5,  7], [23, 41], [ 9, 18], [ 8,  6], [20, 38], [42, 51], [33, 35], [53, 17], [43, 52], [30, 34], [50, 14], [44, 53], [27, 33], [47, 11], [39, 48], [34, 32], [52, 16], [40, 49], [49, 13], [41, 50], [28, 30], [46, 10], [36, 45], [35, 29], [51, 15], [37, 46], [32, 28], [48, 12], [38, 47], [29, 27], [45,  9]],
    "y2": [[17, 44], [ 0,  8], [24, 51], [16, 43], [ 3,  5], [21, 48], [15, 42], [ 6,  2], [18, 45], [14, 41], [ 1,  7], [25, 52], [13, 40], [22, 49], [12, 39], [ 7,  1], [19, 46], [11, 38], [ 2,  6], [26, 53], [10, 37], [ 5,  3], [23, 50], [ 9, 36], [ 8,  0], [20, 47], [42, 15], [33, 29], [53, 26], [43, 16], [30, 32], [50, 23], [44, 17], [27, 35], [47, 20], [39, 12], [34, 28], [52, 25], [40, 13], [49, 22], [41, 14], [28, 34], [46, 19], [36,  9], [35, 27], [51, 24], [37, 10], [32, 30], [48, 21], [38, 11], [29, 33], [45, 18]],
    "y'": [[17, 53], [ 0,  6], [24, 15], [16, 52], [ 3,  7], [21, 12], [15, 51], [ 6,  8], [18,  9], [14, 50], [ 1,  3], [25, 16], [13, 49], [22, 13], [12, 48], [ 7,  5], [19, 10], [11, 47], [ 2,  0], [26, 17], [10, 46], [ 5,  1], [23, 14], [ 9, 45], [ 8,  2], [20, 11], [42, 24], [33, 27], [53, 44], [43, 25], [30, 28], [50, 41], [44, 26], [27, 29], [47, 38], [39, 21], [34, 30], [52, 43], [40, 22], [49, 40], [41, 23], [28, 32], [46, 37], [36, 18], [35, 33], [51, 42], [37, 19], [32, 34], [48, 39], [38, 20], [29, 35], [45, 36]],
    "L":  [[ 0, 18], [24, 33], [ 3, 21], [21, 30], [ 6, 24], [18, 27], [42, 36], [33, 47], [53,  0], [43, 39], [30, 50], [50,  3], [44, 42], [27, 53], [47,  6], [39, 37], [41, 43], [36, 38], [37, 41], [38, 44]],
    "L2": [[ 0, 27], [24, 47], [ 3, 30], [21, 50], [ 6, 33], [18, 53], [42, 38], [33,  6], [53, 18], [43, 37], [30,  3], [50, 21], [44, 36], [27,  0], [47, 24], [39, 41], [41, 39], [36, 44], [37, 43], [38, 42]],
    "L'": [[ 0, 53], [24,  6], [ 3, 50], [21,  3], [ 6, 47], [18,  0], [42, 44], [33, 24], [53, 27], [43, 41], [30, 21], [50, 30], [44, 38], [27, 18], [47, 33], [39, 43], [41, 37], [36, 42], [37, 39], [38, 36]],
    "R":  [[17, 15], [16, 12], [15,  9], [14, 16], [12, 10], [11, 17], [ 2, 51], [26,  8], [10, 14], [ 5, 48], [23,  5], [ 9, 11], [ 8, 45], [20,  2], [35, 26], [51, 29], [32, 23], [48, 32], [29, 20], [45, 35]],
    "R2": [[17,  9], [16, 10], [15, 11], [14, 12], [12, 14], [11, 15], [ 2, 29], [26, 45], [10, 16], [ 5, 32], [23, 48], [ 9, 17], [ 8, 35], [20, 51], [35,  8], [51, 20], [32,  5], [48, 23], [29,  2], [45, 26]],
    "R'": [[17, 11], [16, 14], [15, 17], [14, 10], [12, 16], [11,  9], [ 2, 20], [26, 35], [10, 12], [ 5, 23], [23, 32], [ 9, 15], [ 8, 26], [20, 29], [35, 45], [51,  2], [32, 48], [48,  5], [29, 51], [45,  8]],
    "l":  [[ 0, 18], [24, 33], [ 3, 21], [21, 30], [ 6, 24], [18, 27], [ 1, 19], [25, 34], [ 4, 22], [22, 31], [ 7, 25], [19, 28], [42, 36], [33, 47], [53,  0], [43, 39], [30, 50], [50,  3], [44, 42], [27, 53], [47,  6], [39, 37], [34, 46], [52,  1], [31, 49], [49,  4], [41, 43], [28, 52], [46,  7], [36, 38], [37, 41], [38, 44]],
    "l2": [[ 0, 27], [24, 47], [ 3, 30], [21, 50], [ 6, 33], [18, 53], [ 1, 28], [25, 46], [ 4, 31], [22, 49], [ 7, 34], [19, 52], [42, 38], [33,  6], [53, 18], [43, 37], [30,  3], [50, 21], [44, 36], [27,  0], [47, 24], [39, 41], [34,  7], [52, 19], [31,  4], [49, 22], [41, 39], [28,  1], [46, 25], [36, 44], [37, 43], [38, 42]],
    "l'": [[ 0, 53], [24,  6], [ 3, 50], [21,  3], [ 6, 47], [18,  0], [ 1, 52], [25,  7], [ 4, 49], [22,  4], [ 7, 46], [19,  1], [42, 44], [33, 24], [53, 27], [43, 41], [30, 21], [50, 30], [44, 38], [27, 18], [47, 33], [39, 43], [34, 25], [52, 28], [31, 22], [49, 31], [41, 37], [28, 19], [46, 34], [36, 42], [37, 39], [38, 36]],
    "r":  [[17, 15], [16, 12], [15,  9], [14, 16], [ 1, 52], [25,  7], [ 4, 49], [22,  4], [12, 10], [ 7, 46], [19,  1], [11, 17], [ 2, 51], [26,  8], [10, 14], [ 5, 48], [23,  5], [ 9, 11], [ 8, 45], [20,  2], [34, 25], [52, 28], [31, 22], [49, 31], [28, 19], [46, 34], [35, 26], [51, 29], [32, 23], [48, 32], [29, 20], [45, 35]],
    "r2": [[17,  9], [16, 10], [15, 11], [14, 12], [ 1, 28], [25, 46], [ 4, 31], [22, 49], [12, 14], [ 7, 34], [19, 52], [11, 15], [ 2, 29], [26, 45], [10, 16], [ 5, 32], [23, 48], [ 9, 17], [ 8, 35], [20, 51], [34,  7], [52, 19], [31,  4], [49, 22], [28,  1], [46, 25], [35,  8], [51, 20], [32,  5], [48, 23], [29,  2], [45, 26]],
    "r'": [[17, 11], [16, 14], [15, 17], [14, 10], [ 1, 19], [25, 34], [ 4, 22], [22, 31], [12, 16], [ 7, 25], [19, 28], [11,  9], [ 2, 20], [26, 35], [10, 12], [ 5, 23], [23, 32], [ 9, 15], [ 8, 26], [20, 29], [34, 46], [52,  1], [31, 49], [49,  4], [28, 52], [46,  7], [35, 45], [51,  2], [32, 48], [48,  5], [29, 51], [45,  8]],
    "M":  [[ 1, 19], [25, 34], [ 4, 22], [22, 31], [ 7, 25], [19, 28], [34, 46], [52,  1], [31, 49], [49,  4], [28, 52], [46,  7]],
    "M2": [[ 1, 28], [25, 46], [ 4, 31], [22, 49], [ 7, 34], [19, 52], [34,  7], [52, 19], [31,  4], [49, 22], [28,  1], [46, 25]],
    "M'": [[ 1, 52], [25,  7], [ 4, 49], [22,  4], [ 7, 46], [19,  1], [34, 25], [52, 28], [31, 22], [49, 31], [28, 19], [46, 34]],
    "x":  [[17, 15], [ 0, 53], [24,  6], [16, 12], [ 3, 50], [21,  3], [15,  9], [ 6, 47], [18,  0], [14, 16], [ 1, 52], [25,  7], [ 4, 49], [22,  4], [12, 10], [ 7, 46], [19,  1], [11, 17], [ 2, 51], [26,  8], [10, 14], [ 5, 48], [23,  5], [ 9, 11], [ 8, 45], [20,  2], [42, 44], [33, 24], [53, 27], [43, 41], [30, 21], [50, 30], [44, 38], [27, 18], [47, 33], [39, 43], [34, 25], [52, 28], [31, 22], [49, 31], [41, 37], [28, 19], [46, 34], [36, 42], [35, 26], [51, 29], [37, 39], [32, 23], [48, 32], [38, 36], [29, 20], [45, 35]],
    "x2": [[17,  9], [ 0, 27], [24, 47], [16, 10], [ 3, 30], [21, 50], [15, 11], [ 6, 33], [18, 53], [14, 12], [ 1, 28], [25, 46], [ 4, 31], [22, 49], [12, 14], [ 7, 34], [19, 52], [11, 15], [ 2, 29], [26, 45], [10, 16], [ 5, 32], [23, 48], [ 9, 17], [ 8, 35], [20, 51], [42, 38], [33,  6], [53, 18], [43, 37], [30,  3], [50, 21], [44, 36], [27,  0], [47, 24], [39, 41], [34,  7], [52, 19], [31,  4], [49, 22], [41, 39], [28,  1], [46, 25], [36, 44], [35,  8], [51, 20], [37, 43], [32,  5], [48, 23], [38, 42], [29,  2], [45, 26]],
    "x'": [[17, 11], [ 0, 18], [24, 33], [16, 14], [ 3, 21], [21, 30], [15, 17], [ 6, 24], [18, 27], [14, 10], [ 1, 19], [25, 34], [ 4, 22], [22, 31], [12, 16], [ 7, 25], [19, 28], [11,  9], [ 2, 20], [26, 35], [10, 12], [ 5, 23], [23, 32], [ 9, 15], [ 8, 26], [20, 29], [42, 36], [33, 47], [53,  0], [43, 39], [30, 50], [50,  3], [44, 42], [27, 53], [47,  6], [39, 37], [34, 46], [52,  1], [31, 49], [49,  4], [41, 43], [28, 52], [46,  7], [36, 38], [35, 45], [51,  2], [37, 41], [32, 48], [48,  5], [38, 44], [29, 51], [45,  8]],
    "F":  [[24, 18], [21, 19], [15, 27], [ 6,  9], [18, 20], [25, 21], [12, 28], [ 7, 12], [19, 23], [26, 24], [23, 25], [ 9, 29], [ 8, 15], [20, 26], [44,  6], [27, 38], [41,  7], [28, 41], [38,  8], [29, 44]],
    "F2": [[24, 20], [21, 23], [15, 38], [ 6, 29], [18, 26], [25, 19], [12, 41], [ 7, 28], [19, 25], [26, 18], [23, 21], [ 9, 44], [ 8, 27], [20, 24], [44,  9], [27,  8], [41, 12], [28,  7], [38, 15], [29,  6]],
    "F'": [[24, 26], [21, 25], [15,  8], [ 6, 44], [18, 24], [25, 23], [12,  7], [ 7, 41], [19, 21], [26, 20], [23, 19], [ 9,  6], [ 8, 38], [20, 18], [44, 29], [27, 15], [41, 28], [28, 12], [38, 27], [29,  9]],
    "B":  [[17,  2], [ 0, 42], [14,  1], [ 1, 39], [11,  0], [ 2, 36], [42, 35], [33, 17], [53, 51], [50, 52], [47, 53], [39, 34], [34, 14], [52, 48], [46, 50], [36, 33], [35, 11], [51, 45], [48, 46], [45, 47]],
    "B2": [[17, 36], [ 0, 35], [14, 39], [ 1, 34], [11, 42], [ 2, 33], [42, 11], [33,  2], [53, 45], [50, 48], [47, 51], [39, 14], [34,  1], [52, 46], [46, 52], [36, 17], [35,  0], [51, 47], [48, 50], [45, 53]],
    "B'": [[17, 33], [ 0, 11], [14, 34], [ 1, 14], [11, 35], [ 2, 17], [42,  0], [33, 36], [53, 47], [50, 46], [47, 45], [39,  1], [34, 39], [52, 50], [46, 48], [36,  2], [35, 42], [51, 53], [48, 52], [45, 51]],
    "S":  [[16, 30], [ 3, 10], [13, 31], [ 4, 13], [10, 32], [ 5, 16], [43,  3], [30, 37], [40,  4], [31, 40], [37,  5], [32, 43]],
    "S2": [[16, 37], [ 3, 32], [13, 40], [ 4, 31], [10, 43], [ 5, 30], [43, 10], [30,  5], [40, 13], [31,  4], [37, 16], [32,  3]],
    "S'": [[16,  5], [ 3, 43], [13,  4], [ 4, 40], [10,  3], [ 5, 37], [43, 32], [30, 16], [40, 31], [31, 13], [37, 30], [32, 10]],
    "z":  [[17, 33], [ 0, 11], [24, 18], [16, 30], [ 3, 10], [21, 19], [15, 27], [ 6,  9], [18, 20], [14, 34], [ 1, 14], [25, 21], [13, 31], [ 4, 13], [12, 28], [ 7, 12], [19, 23], [11, 35], [ 2, 17], [26, 24], [10, 32], [ 5, 16], [23, 25], [ 9, 29], [ 8, 15], [20, 26], [42,  0], [33, 36], [53, 47], [43,  3], [30, 37], [50, 46], [44,  6], [27, 38], [47, 45], [39,  1], [34, 39], [52, 50], [40,  4], [31, 40], [41,  7], [28, 41], [46, 48], [36,  2], [35, 42], [51, 53], [37,  5], [32, 43], [48, 52], [38,  8], [29, 44], [45, 51]],
    "z2": [[17, 36], [ 0, 35], [24, 20], [16, 37], [ 3, 32], [21, 23], [15, 38], [ 6, 29], [18, 26], [14, 39], [ 1, 34], [25, 19], [13, 40], [ 4, 31], [12, 41], [ 7, 28], [19, 25], [11, 42], [ 2, 33], [26, 18], [10, 43], [ 5, 30], [23, 21], [ 9, 44], [ 8, 27], [20, 24], [42, 11], [33,  2], [53, 45], [43, 10], [30,  5], [50, 48], [44,  9], [27,  8], [47, 51], [39, 14], [34,  1], [52, 46], [40, 13], [31,  4], [41, 12], [28,  7], [46, 52], [36, 17], [35,  0], [51, 47], [37, 16], [32,  3], [48, 50], [38, 15], [29,  6], [45, 53]],
    "z'": [[17,  2], [ 0, 42], [24, 26], [16,  5], [ 3, 43], [21, 25], [15,  8], [ 6, 44], [18, 24], [14,  1], [ 1, 39], [25, 23], [13,  4], [ 4, 40], [12,  7], [ 7, 41], [19, 21], [11,  0], [ 2, 36], [26, 20], [10,  3], [ 5, 37], [23, 19], [ 9,  6], [ 8, 38], [20, 18], [42, 35], [33, 17], [53, 51], [43, 32], [30, 16], [50, 52], [44, 29], [27, 15], [47, 53], [39, 34], [34, 14], [52, 48], [40, 31], [31, 13], [41, 28], [28, 12], [46, 50], [36, 33], [35, 11], [51, 45], [37, 30], [32, 10], [48, 46], [38, 27], [29,  9], [45, 47]]
}

// NOTE: works for both fcubes and ifcubes!
function apply_move(cube, perm) {
    // console.log(cube, perm)
    let new_cube = [...cube]
    perm.forEach(([src, dst]) => new_cube[dst] = cube[src]);
    return new_cube
}

// moves is a string in singmaster notation
// NOTE: works for both fcubes and ifcubes!
function apply_moves(cube, moves) {
    return moves
        .trim() // clean up whitespace
        .split(/ +/) // split by whitespace
        .filter(s => s) // filter out empty strings
        .map(m => fmoves[m]) // turn each move notation into a move
        .reduce(apply_move, cube) // apply them all to cube, in order
}

const cross_facelets =
    [
        S("D",2), S("D",4), S("D",6), S("D",8),
        S("L",8), S("F",8), S("R",8), S("B",8),
    ]

const htm_moves = [..."RUFDLB"].map(m => [m, m + "'", m + "2"]).flat()

// finds the face colour of a sticker index
const ifcube_idx_to_fcube_face = (idx) => "URFDLB"[ Math.floor(idx / 9) ]

function create_fcube(moves) {
    return apply_moves(solved_fcube, moves);
}

function create_ifcube(moves) {
    return apply_moves(solved_ifcube, moves);
}


// converts a given ifcube into a fcube thats coloured gray (marked as X) according to a mask
// the reason why we need an ifcube is because the ifcube can be scrambled and stuff
// fcube only stores the colours of stickers, so how are you supposed to pick specific stickers to ignore?
function get_masked_cube(ifcube, mask) {
    return [...ifcube] // deep clone because .join mutates
        .map(idx => mask.includes(idx) ? ifcube_idx_to_fcube_face(idx) : "X")
        .join("")
}
// ----- PRUNING -----

// generate pruning table
// a pruning table is a massive dictionary where
// the key is a (masked) fcube
// the value is the min. number of moves needed to solve
// solved_states is an array of states to be considered "solved" in case there's multiple??
export function gen_pruning_table(solved_states, depth, moveset) {
    let pruning_table = {}
    let previous_frontier = solved_states
    solved_states.forEach(s => pruning_table[s] = 0)

    for (let i = 1; i <= depth; i++) {
        const frontier = []
        for (let state of previous_frontier) {
            // for every previous state... try every move on it
            for (let move of moveset) {
                let new_state = apply_move(state, fmoves[move]).join("")
                if (!pruning_table.hasOwnProperty(new_state)) {
                    pruning_table[new_state] = i // add this state to pruning table
                    frontier.push(new_state) // add this to frontier so it can then become previous_frontier
                }
            }
        }
        previous_frontier = [...frontier]
    }
    return pruning_table
}

function solve_dfs_with_pruning(solver, cube, solution, depth_remaining) {
    const cube_str = Array.isArray(cube) ? cube.join("") : cube
    if (solver.is_solved(cube_str)) return solution.join(" ") // cube is solved! return what we got
    
    // pruning
    let lower_bound = solver.pruning_table[cube_str] // least # moves needed to solve this scram
    if (lower_bound === undefined) {
        // if the pruning depth was 4 and it doesn't have our cube state,
        // then we need 5 or more moves to solve the cube
        lower_bound = solver.pruning_depth + 1
    }
    if (lower_bound > depth_remaining) {
        return null
    }

    // cube is unsolved but we still have some remaining depth
    for (const move of solver.moves) {
        if (solution.length && move[0] === solution[solution.length - 1][0]) {
            continue // optimization: never use the same layer in consecutive moves
        }
        // try every available move by recursively calling solve_dfs
        solution.push(move)
        let result = solve_dfs_with_pruning(
            solver,
            apply_move(cube, fmoves[move]), // copy of cube + the move done
            solution,
            depth_remaining - 1
        )
        // if a recursive call found a solution, then propagate it up
        if (result !== null) return result
        solution.pop()
    }
    // ok we tried everything but nothing was found
    return null
}

// this now takes in a masked_cube
function solve_iddfs(solver, masked_cube, depth_limit) {
    for (let depth = 0; depth <= depth_limit; depth++) {
        let solution = solve_dfs_with_pruning(solver, masked_cube, [], depth)
        if (solution !== null) return solution
    }
    return null
}

const eo_facelets =
    [
        S("U",2),S("U",4),S("U",6),S("U",8),
        S("D",2),S("D",4),S("D",6),S("D",8),
        S("F",4),S("F",6),S("B",4),S("B",6),
    ]

// special for EO!
export function get_eocross_masked_cube(ifcube) {
    return [...ifcube]
        .map(idx => {
            if (cross_facelets.includes(idx)) return ifcube_idx_to_fcube_face(idx)
            if (eo_facelets.includes(idx)) return "o"
            return "X"
        })
        .join("")
}

const eocross_pruning_table = gen_pruning_table([get_eocross_masked_cube(solved_ifcube)], 4, htm_moves)

const eocross_solver = {
    is_solved: (fcube) => eocross_pruning_table[fcube] === 0,
    moves: htm_moves,
    pruning_table: eocross_pruning_table,
    pruning_depth: 4,
}

export function solve_eocross(scram) {
    const if_cube = create_ifcube(scram)
    const eocross_masked_cube = get_eocross_masked_cube(if_cube)
    return solve_iddfs(eocross_solver, eocross_masked_cube, 10)
}

// ----- eoline solver -----
const line_facelets =
    [
        S("F",8), S("B",8),
        S("D",2), S("D",8),
    ]

function get_eoline_masked_cube(ifcube) {
    return [...ifcube] // deep clone because .join mutates
        .map(idx => {
            if (line_facelets.includes(idx)) return ifcube_idx_to_fcube_face(idx)
            if (eo_facelets.includes(idx)) return "o"
            return "X"
        })
        .join("")
}

const eoline_pruning_table = gen_pruning_table([get_eoline_masked_cube(solved_ifcube)], 4, htm_moves)

const eoline_solver = {
    is_solved: (fcube) => eoline_pruning_table[fcube] === 0,
    moves: htm_moves,
    pruning_table: eoline_pruning_table,
    pruning_depth: 4,
}

export function solve_eoline(scram) {
    const if_cube = create_ifcube(scram)
    const eoline_masked_cube = get_eoline_masked_cube(if_cube)
    return solve_iddfs(eoline_solver, eoline_masked_cube, 10)
}

/**
 * @deprecated
 */
export function isValidHTM(scram) {
    // either the scramble is empty, OR when you split the sequence by spaces, each token is a valid move
    return scram === "" || scram.trim().split(" ").every((token) => htm_moves.includes(token))
}
