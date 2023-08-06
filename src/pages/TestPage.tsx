// import { solve } from "src/lib";
// import { solveCube3x3 } from "src/libv2/puzzles/cube3x3/solvers";
import { Button, Checkbox } from "@chakra-ui/react";
import { sampleSize } from "lodash";
import { useState, useMemo } from "react";
import {
  Cube3x3,
  MASKS,
  PUZZLE_CONFIGS,
  PuzzleConfigName,
  getMaskedFaceletCube,
} from "src/libv2";
import { solveCube3x3 } from "src/libv2/puzzles/cube3x3/solvers";
import { Facelet, Move3x3 } from "src/libv2/puzzles/cube3x3/types";
import {
  PyraV,
  SOLVED,
  V_MASK,
  invertMoves,
} from "src/libv2/puzzles/pyraminx/pyraminx";
import {
  PruningTable,
  genPruningTable,
  genPruningTableWithSetups,
  solve,
} from "src/libv2/search";
import { Move as PyraMove } from "src/libv2/puzzles/pyraminx/pyraminx";
import { getMaskedPyra } from "src/libv2/puzzles/pyraminx/pyraminx";
import { randomScrambleForEvent } from "cubing/scramble"

// const scramble = "R' F U' L' D L2 B' F D' F2 L'".split(" ") as any;

// export default function TestPage() {
//   const [solutions, setSolutions] = useState([] as Move3x3[][]);

//   async function handleClick() {
//     console.time("test");
//     const solutions = await solveCube3x3(scramble, "FB");
//     // const [solutions, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11] = await Promise.all([
//     //   solveCube3x3(scramble, "EOCross", undefined, 1),
//     //   solveCube3x3(scramble, "EOCross", undefined, 1),
//     //   solveCube3x3(scramble, "EOCross", undefined, 1),
//     //   solveCube3x3(scramble, "EOCross", undefined, 1),
//     //   solveCube3x3(scramble, "EOCross", undefined, 1),
//     //   solveCube3x3(scramble, "EOCross", undefined, 1),
//     //   solveCube3x3(scramble, "EOCross", undefined, 1),
//     //   solveCube3x3(scramble, "EOCross", undefined, 1),
//     //   solveCube3x3(scramble, "EOCross", undefined, 1),
//     //   solveCube3x3(scramble, "EOCross", undefined, 1),
//     //   solveCube3x3(scramble, "EOCross", undefined, 1),
//     //   solveCube3x3(scramble, "EOCross", undefined, 1),
//     // ])
//     console.timeEnd("test")
//     setSolutions(solutions.map(({ solution }) => solution));
//   }

//   async function handleClick2() {
//     const step: PuzzleConfigName = "EOCross"
//     console.log("analyzing move distribution for:", step)
//     const { moveSet, mask, depthLimit } = PUZZLE_CONFIGS[step].solverConfig
//     const puzzle = new Cube3x3(moveSet, getMaskedFaceletCube(mask))
//     // console.time("prune")
//     const pruningDepth = 6;
//     const table = genPruningTable(puzzle, {
//       name: step,
//       pruningDepth,
//     })
//     const entries = Object.entries(table)
//     const entriesByMovecount = [...Array(pruningDepth+1)].map(() => [] as string[])
//     for (const [key, movecount] of entries) {
//       entriesByMovecount[movecount].push(key);
//     }
//     // console.log({ entriesByMovecount})
//     // console.timeEnd("prune")
//     const SAMPLE_SIZE = 100;
//     const solved = getMaskedFaceletCube(MASKS[step]);
//     for (let i = 0; i <= pruningDepth; i++) {
//       console.log("depth", i);
//       const states = sampleSize(entriesByMovecount[i], SAMPLE_SIZE);
//       // console.log({ states })
//       const solutionsList = states.map(state => {
//         return solve(new Cube3x3(moveSet, [...state] as Facelet[], solved), { name: step, pruningDepth: 4, depthLimit })
//       }).map(solutions => solutions.filter(solution => solution.length))
//       console.log({ solutionsList: solutionsList.map(solutions => solutions.map(solution => solution.join(" "))) });
//       const moveDistribution = solutionsList.map(list => list.length);
//       console.log(moveDistribution.join(" "));
//       console.log("Standard deviation:", calculateSD(moveDistribution))
//     }
//   }

//   return (
//     <>
//       <p>hello it's test page</p>
//       {solutions.map(solution => (
//         <p key={solution.join("")}>{solution.join(" ")}</p>
//       ))}
//       <Button onClick={handleClick}>click me!</Button>
//       <Button onClick={handleClick2}>click me too</Button>
//     </>
//   );
// }

// // Calculate the average of all the numbers
// const calculateMean = (values: number[]): number => {
//   const mean = (values.reduce((sum, current) => sum + current)) / values.length;
//   return mean;
// }

// // Calculate variance
// const calculateSD = (values: number[]): number => {
//   const average = calculateMean(values);
//   const squareDiffs = values.map((value: number): number => {
//     const diff = value - average;
//     return diff * diff;
//   })

//   const variance = calculateMean(squareDiffs);
//   return Math.sqrt(variance);
// }

// god's number for fixed v is 7
// god's number for pyra is 11 (without tips)

const allOrientations: PyraMove[][] = [
  [],
  ["Uv"],
  ["Uv'"],
  ["Rv"],
  ["Rv", "Uv"],
  ["Rv", "Uv'"],
  ["Rv'"],
  ["Rv'", "Uv"],
  ["Rv'", "Uv'"],
  ["Uv", "Rv"],
  ["Uv", "Rv", "Uv"],
  ["Uv", "Rv", "Uv'"],
];

// TODO: REVERSE
const allCorrections: PyraMove[][] = [
  [], // normal v
  ["R"],
  ["R'"],
  ["L"],
  ["L'"],
  ["B"],
  ["B'"],
  ["R", "B"],
  ["R", "B'"],
  ["R'", "B"],
  ["R'", "B'"],
  ["L", "B"],
  ["L", "B'"],
  ["L'", "B"],
  ["L'", "B'"],
  ["B", "R"],
  ["B", "R'"],
  ["B'", "L"],
  ["B'", "L'"],
  ["R", "L"],
  ["R", "L'"],
  ["R'", "L"],
  ["R'", "L'"],
  ["L", "R"],
  ["L", "R'"],
  ["L'", "R"],
  ["L'", "R'"],
  ["R", "B", "R'"],
  ["R", "B", "R"],
  ["R'", "B", "R"],
  ["R'", "B", "R'"],
  ["L'", "B'", "L"],
  ["L'", "B'", "L'"],
  ["L", "B", "L'"],
  ["L", "B", "L"],
  ["L", "R", "L'"],
  ["R'", "L'", "R"],
];

const allCorrectionsReversed: PyraMove[][] = [...allCorrections].reverse();
console.log({ allCorrectionsReversed })

// pre-generate the table
console.time("helper table");
const pruningDepth = 7;
const helperTable = genPruningTable(new PyraV(), {
  name: "v",
  pruningDepth,
});
console.timeEnd("helper table");

const pseudoPruneCache: { [k: string]: PruningTable } = {};

// NOTE: ties are ignored
function solvePseudoVSpecificCorrection(scram: PyraMove[], correction: PyraMove[]) {
  const solvedState = getMaskedPyra(V_MASK, new PyraV(SOLVED).applyMoves(invertMoves(correction)).stateData)
  const scrambledState = new PyraV(solvedState).applyMoves(correction).applyMoves(scram).stateData;
  const puzzle = new PyraV(scrambledState, solvedState);
  const key = correction.join("");
  if (!pseudoPruneCache[key]) {
    pseudoPruneCache[key] = genPruningTable(puzzle, {
      name: key,
      pruningDepth: 6,
    })
  }
  const pruningTable = pseudoPruneCache[key];
  const solutions = solve(puzzle, {
    name: key,
    pruningTable,
    depthLimit: 10,
    maxSolutionCount: 1,
    pruningDepth: 11,
  })
  const solution = solutions[0];

  return solution;
}

type PseudoMVC = [solution: number, correction: number]

function solvePseudoVSpecificCorrectionMVC(scram: PyraMove[], correction: PyraMove[]): PseudoMVC {
  const solvedState = getMaskedPyra(V_MASK, new PyraV(SOLVED).applyMoves(invertMoves(correction)).stateData)
  const scrambledState = new PyraV(solvedState).applyMoves(correction).applyMoves(scram).encode();
  const key = correction.join("");

  const table = pseudoPruneCache[key]
  if (table) {
    const mvc = table[scrambledState]
    return [mvc, correction.length];
  }
  
  // table doesn't exist
  const solution = solvePseudoVSpecificCorrection(scram, correction)
  return [solution.length, correction.length];
}


function solvePseudoVMVC(scram: PyraMove[], preferLongerCorrection: boolean) {
  const results = (preferLongerCorrection ? allCorrectionsReversed : allCorrections).map(correction => {
    return solvePseudoVSpecificCorrectionMVC(scram, correction)
  })
  let best: PseudoMVC = [0, 0]
  let bestTotal = Infinity;
  for (const [solMVC, corMVC] of results) {
    const total = solMVC + corMVC;
    if (total < bestTotal) {
      bestTotal = total;
      best = [solMVC, corMVC];
    }
  }
  return best;
}

function solvePseudoVAll(scram: PyraMove[]) {
  const results = allCorrections.map(correction => {
    const solution = solvePseudoVSpecificCorrection(scram, correction);
    return {
      solution,
      correction,
    }
  })
  return results;
}


function solvePseudoV(scram: PyraMove[]) {
  const results = allCorrections.map(correction => {
    const solution = solvePseudoVSpecificCorrection(scram, correction);
    return {
      solution,
      correction,
    }
  })
  let bestSol: PyraMove[] = [];
  let bestSolCorrection: PyraMove[] = [];
  let bestCombo = Infinity;
  for (const { solution, correction } of results) {
    const combo = solution.length + correction.length;
    if (combo < bestCombo) {
      bestCombo = combo;
      bestSol = solution;
      bestSolCorrection = correction;
    }
  }
  return {
    solution: bestSol,
    correction: bestSolCorrection,
  };
}

// THE ULTIMATE TRUTH
function colourNeutralSolvePseudoVMVC(scram: PyraMove[], preferLongerCorrection: boolean) {
  const allMVC = allOrientations.map(orientation => {
    const translatedScram = [...invertMoves(orientation), ...scram, ...orientation]
    return solvePseudoVMVC(translatedScram, preferLongerCorrection)
  })

  let best: PseudoMVC = [0, 0]
  let bestTotal = Infinity;
  for (const [solMVC, corMVC] of allMVC) {
    const total = solMVC + corMVC;
    if (total < bestTotal) {
      bestTotal = total;
      best = [solMVC, corMVC];
    }
  }
  return best;
}

function colorNeutralSolvePseudoV(scram: PyraMove[]) {
  return allOrientations.map(orientation => {
    const translatedScram = [...invertMoves(orientation), ...scram, ...orientation]
    const solution = solvePseudoV(translatedScram)
    return {
      orientation,
      ...solution,
    };
  })
}


// NOTE: to calculate the length of a CN solution
// you must ignore the rotations!
// function colorNeutralSolveV(scram: PyraMove[]) {
//   return allOrientations.map(orientation => {
//     const translatedScram = [...invertMoves(orientation), ...scram, ...orientation]
//     const v = new PyraV().applyMoves(translatedScram);
//     const bestSolution = solve(v, {
//       name: "v",
//       pruningDepth: 5,
//       depthLimit: 8,
//       maxSolutionCount: 1,
//       pruningTable: helperTable,
//     })[0];
//     return [...orientation, ...bestSolution];
//   })
// }

function optimalVMovecount(scram: PyraMove[]) {
  let best = 11; // nonsense value
  allOrientations.forEach((orientation) => {
    const translatedScram = [
      ...invertMoves(orientation),
      ...scram,
      ...orientation,
    ];
    const v = new PyraV().applyMoves(translatedScram);

    // in pruning table?
    const optimal = helperTable[v.encode()];
    if (optimal !== undefined) {
      if (optimal < best) {
        best = optimal;
      }
      // we already know the optimal, don't continue solving
      return;
    }

    // pruning table missed, so the optimal solution length
    // must exceed the pruning depth
    // if there's already a solution as good as pruning depth, don't bother
    if (best <= pruningDepth) {
      return;
    }
    const bestSolution = solve(v, {
      name: "v",
      pruningDepth: 5,
      depthLimit: best,
      maxSolutionCount: 1,
      pruningTable: helperTable,
    }).at(0);

    if (bestSolution && bestSolution.length < best) {
      best = bestSolution.length;
    }
  });

  return best;
}

export default function TestPage() {
  function handleClick() {
    const pruningDepth = 11;
    console.time("prune");
    const table = genPruningTableWithSetups(new PyraV(SOLVED), {
      name: "v",
      pruningDepth,
    });
    console.timeEnd("prune");

    const allScrambles = Object.values(table);
    console.time("solve");
    const movecountTally = [...Array(pruningDepth + 1)].map(() => 0);

    let counter = 0;
    allScrambles.forEach((scram) => {
      if (counter % 1000 === 0) {
        console.log(counter, "/", allScrambles.length);
      }
      const optimalV = optimalVMovecount(scram);
      movecountTally[optimalV] = (movecountTally[optimalV] ?? 0) + 1;
      counter++;
    });
    console.timeEnd("solve");
    console.log(movecountTally);
  }

  async function handleClick3() {
    // solve a single scramble of fixed orientation pseudo v
    const scramble = "L' U L' B U' R' U L".split(" ") as any;
    const mvc = ({ solution, correction }: { solution: PyraMove[], correction: PyraMove[] }) => solution.length + correction.length
    const solutions = solvePseudoVAll(scramble).sort((a, b) => mvc(a) - mvc(b))
    solutions.forEach(({ solution, correction }) => {
      const mvc = solution.length + correction.length;
      console.log(mvc, ":", solution.join(" "), "|", correction.join(" "))
    })
  }

  async function handleClick2() {
    
    const scramble = "R F2 L2 D2 F2 U2 R2 U2 L' D2 L U' B2 F D R D2 R' F'".split(" ") as any
    console.log(scramble)
    const solutions = await solveCube3x3(scramble, "SB", undefined, 5);
    solutions.forEach(({ solution }) => {
      console.log(solution.join(" "));
    });
    console.log("done with", solutions.length, "solutions");
  }

  function cnPseudoV() {
    // solve a single scramble of cn pseudo v
    const scramble = "B' U' B L' B U R' B'".split(" ") as any;
    console.log("scramble", scramble.join(" "));
    const mvc = ({ solution, correction }: { solution: PyraMove[], correction: PyraMove[] }) => solution.length + correction.length
    const solutions = colorNeutralSolvePseudoV(scramble).sort((a, b) => mvc(a) - mvc(b))
    solutions.forEach(({ orientation, solution, correction }) => {
      const mvc = solution.length + correction.length;
      console.log(mvc, ": (" + (orientation.join(" ") ?? "") + ")", solution.join(" "), "|", correction.join(" "))
    })
  }

  function KYOOO(preferLongerCorrection: boolean) {
    // TODO: MAKE 11
    const pruningDepth = 11;
    console.time("prune");
    const table = genPruningTableWithSetups(new PyraV(SOLVED), {
      name: "v",
      pruningDepth,
    });
    console.timeEnd("prune");

    const allScrambles = Object.values(table);
    console.time("solve");
    const solutionAndCorrectionList: [solutionMvc: number, correctionMvc: number][] = [];

    let counter = 0;
    allScrambles.every((scram) => {
      if (counter % 1000 === 0) {
        console.log(counter, "/", allScrambles.length);
      }
      const solutionAndCorrection = colourNeutralSolvePseudoVMVC(scram, preferLongerCorrection);
      solutionAndCorrectionList.push(solutionAndCorrection);
      counter++;
      return true;
    });
    console.timeEnd("solve");
    console.time("stats");
    // # of pseudo-v's of correction length 0, 1, 2, and 3
    const pseudoTally = [0, 0, 0, 0]
    const mvcDistribution = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] // extra long to be extra safe lol
    let totalSolMovecount = 0;
    let totalCorMovecount = 0;
    solutionAndCorrectionList.forEach(([sol, cor]) => {
      pseudoTally[cor]++;
      totalSolMovecount += sol;
      totalCorMovecount += cor;
      mvcDistribution[sol + cor]++;
    })
    const totalMovecount = totalSolMovecount + totalCorMovecount;
    const avgMovecount = totalMovecount / allScrambles.length;
    const avgSolMovecount = totalSolMovecount / allScrambles.length;
    const avgCorMovecount = totalCorMovecount / allScrambles.length;
    console.log({
      pseudoTally,
      avgMovecount,
      avgSolMovecount,
      avgCorMovecount,
      mvcDistribution,
    })
    console.timeEnd("stats");

  }

  const [preferLongerCorrection, setPreferLongerCorrection] = useState(false);

  return (
    <>
      <Button onClick={handleClick}>solve optimal v</Button>

      <Button onClick={handleClick2}>solve sb</Button>
      <Button onClick={handleClick3}>solve one fixed pseudo v</Button>
      <Button onClick={cnPseudoV}>solve one colour neutral pseudo v</Button>
      <Checkbox isChecked={preferLongerCorrection} onChange={e => setPreferLongerCorrection(e.target.checked)}>
        Prefer longer corrections?
      </Checkbox>
      <Button onClick={() => KYOOO(preferLongerCorrection)}>KYOOOOOOOOO</Button>
    </>
  );
}
