import { AlgSheet, AlgSet } from "../types"

const EOLL: AlgSet = {
    name: "EOLL",
    description: "Twist the edges to get a cross on top",
    cases: [
        {
            name: "Dot",
            setup: "R U2 R2' F R F' U2 R' F R F'",
            algs: [
                {
                    alg: "R U2 R2' F R F' U2 R' F R F'",
                }
            ]
        },
        {
            name: "Line",
            setup: "F U R U' R' F'",
            algs: [
                {
                    alg: "F R U R' U' F'",
                }
            ]
        },
        {
            name: "Small L",
            setup: "F R U R' U' F'",
            algs: [
                {
                    alg: "F U R U' R' F'",
                }
            ]
        }
    ],
    puzzleConfig: {
        puzzle: "3x3x3",
        view: "top",
        mask: {
            U: [0, 2, 6, 8],
            R: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            F: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            D: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            L: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            B: [0, 1, 2, 3, 4, 5, 6, 7, 8]
        }
    }
}

const OCLL: AlgSet = {
    name: "OCLL",
    description: "Twist the corners to get the top colour on top",
    cases: [
        {
            name: "Pi",
            setup: "R U2' R2' U' R2 U' R2' U2' R",
            algs: [
                {
                    alg: "R U2' R2' U' R2 U' R2' U2' R",
                }
            ]
        },
        {
            name: "U",
            setup: "R U2 R D R' U2 R D' R2",
            algs: [
                {
                    alg: "R2 D R' U2 R D' R' U2 R'",
                }
            ]
        },
        {
            name: "H",
            setup: "R U R' U R U' R' U R U2 R' U",
            algs: [
                {
                    alg: "R U R' U R U' R' U R U2 R'",
                }
            ]
        },
        {
            name: "L",
            setup: "r U R' U' r' F R F'",
            algs: [
                {
                    alg: "F R' F' r U R U' r'",
                },
                {
                    // This one should have a U AUF
                    alg: "F' r U R' U' r' F R",
                }
            ]
        },
        {
            name: "Anti-sune",
            setup: "R U R' U R U2' R'",
            algs: [
                {
                    alg: "R U2' R' U' R U' R'",
                }
            ]
        },
        {
            name: "Sune",
            setup: "R U2' R' U' R U' R'",
            algs: [
                {
                    alg: "R U R' U R U2' R'",
                }
            ]
        },
        {
            name: "T",
            setup: "F R' F' r U R U' r'",
            algs: [
                {
                    alg: "r U R' U' r' F R F'",
                }
            ]
        }
    ],
    puzzleConfig: {
        puzzle: "3x3x3",
        view: "top",
        mask: {
            R: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            F: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            D: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            L: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            B: [0, 1, 2, 3, 4, 5, 6, 7, 8]
        }
    }
}


export const FourLookLastLayer: AlgSheet = {
    name: "4LLL",
    description: "Beginner CFOP algorithms",
    algSets: [EOLL, OCLL]
}
