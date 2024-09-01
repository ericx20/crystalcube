import { randomScrambleForEvent } from "cubing/scramble";
import { Move3x3 } from "./moves";

export default async function randomScramble() {
  return (await randomScrambleForEvent("333"))
    .toString()
    .split(" ") as Move3x3[];
}
