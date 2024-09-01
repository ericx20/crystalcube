import { randomScrambleForEvent } from "cubing/scramble";
import { Move3x3 } from "./moves";

export default async function random3x3Scramble() {
  return (await randomScrambleForEvent("333"))
    .toString()
    .split(" ") as Move3x3[];
}
