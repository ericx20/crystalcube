import { Move3x3, RotationMove, Cube3x3 } from "src/lib/puzzles/cube3x3";

/**
 * Generates an "EO Solution Annotation": a list of labels for each move in a given EO solution
 * We're only interested in seeing how the EO changes for F/F' and B/B' moves
 * Note: we assume the EO solution only contains outer layer moves. No slices, wide moves or rotations.
 */
export function getEOSolutionAnnotation(
  scramble: Move3x3[],
  preRotation: RotationMove[],
  solution: Move3x3[]
): Array<string> {
  const cube = new Cube3x3().applyMoves(scramble).applyMoves(preRotation);
  const annotation = [];

  for (const move of solution) {
    const prevBadEdgeCount = countBadEdges(cube);
    cube.applyMove(move);
    const newBadEdgeCount = countBadEdges(cube);
    const change = newBadEdgeCount - prevBadEdgeCount;

    if (!EO_CHANGING_MOVES.includes(move)) {
      annotation.push("");
    } else if (change < 0) {
      // There are fewer bad edges now
      annotation.push(`${change}`);
    } else if (change === 0) {
      // -0 is our convention to indicate an "edge exchange": the EO has changed but the number of bad edges is the same, none were reduced in total.
      annotation.push("-0");
    } else {
      // There are more bad edges now. + sign is our convention
      annotation.push(`+${change}`);
    }
  }

  return annotation;
}

function countBadEdges(cube: Cube3x3): number {
  return cube.EO.filter((eo) => eo === false).length;
}

const EO_CHANGING_MOVES: Array<Move3x3> = ["F", "F'", "B", "B'"];

export function numOfBadEdgesValid(n: number): boolean {
  return Number.isInteger(n) && n % 2 === 0 && 0 <= n && n <= 12;
}
