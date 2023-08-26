import { randomScrambleForEvent } from "cubing/scramble";
import { Move3x3 } from "src/libv2/puzzles/cube3x3/types";

export default async function scrambler(/* _options: Options */) {
  // TODO: shorten the scramble based on the option
  const scram = (await randomScrambleForEvent("333"))
    .toString()
    .split(" ") as Move3x3[];
  return scram;
  // const solutions = await solveCube3x3(scram, "EOCross", ["x2"], 5);
  // solutions.forEach(({ solution }) => console.log(solution.join(" ")))
}
