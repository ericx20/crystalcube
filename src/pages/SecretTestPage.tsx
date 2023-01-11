import { useState } from "react"
import { parseNotation, solve, movesAreParallel, moveSeqToString } from "src/lib"
import { invertMove, invertMoves } from "src/lib/moves"
import { CubeRotation, Move, MoveSeq } from "src/lib/types"
import useScrambleAndSolutions from "src/hooks/useScrambleAndSolutions"
import type { ScrambleMode } from "src/hooks/useScrambleAndSolutions"
import { Button } from "@chakra-ui/react"
import SelectNFlip from "src/components/Trainer/ZZ/SelectNFlip"

// const scrambles =
// `
// U2 R D2 R' B2 R2 F2 L R' F2 D' L' B R2 U2 L' U2 
// R F' D2 B F L2 R2 D2 R2 F' U2 L F L2 R2 B D' F R B2 
// D L2 B' U D' R U' D' B F2 D2 L U2 R2 L B2 D2 R' F2 U2 
// U B' R2 F2 L2 R2 F D2 F D2 F' L' F' L2 D' F D' B U2 L' 
// D2 B U F2 R2 B D2 B' D2 B2 L2 U2 F2 R2 L' D R' U B' F R 
// F' U' F2 D2 B2 R2 B2 U2 F2 R B2 L' U2 F D L R' B2 U 
// L2 D F2 U' F2 R2 D B2 U2 L2 R2 F2 R' U' B2 D' U2 B U 
// L D2 L2 B2 L2 F2 R U2 L F2 D2 F2 B' U2 L' F U' F2 R' B2 
// L2 F2 R2 D2 B2 D F2 L2 R2 U2 L2 R' U' F U2 B D L D' R B' 
// L F R2 D' B2 U2 L2 D' L2 F2 L2 U2 B2 D L F2 D2 F' D2 U' F2 
// B2 D L' U2 L' F D2 R' U' R2 F2 R2 F2 L2 U' R2 U' D2 B' 
// L' D2 R' F2 R B2 F2 R D2 R' D2 F2 D R' D2 B U2 B D 
// R' U2 F D R2 L U D2 R' U L2 B2 U D R2 B2 D R2 D' L2 
// U2 R F2 D2 B2 R U2 F2 R2 F2 R D' L D B F' U' L' D L2 
// F R2 B R2 B' D2 F R2 D2 F2 L R F2 D B R2 D' B' F2 
// B2 U2 L2 F' D2 L2 F D2 U2 L2 B' D2 R D' U R' B' D2 R 
// B2 L' D2 U2 L' U2 L2 F2 R' D2 L' U F' R2 U L U F D 
// R2 U R F' U' B2 D2 F' D B2 R B2 R' F2 U2 B2 R' B2 L2 
// F2 L' U2 F D2 B' U B2 U2 F2 L2 D2 B D2 F' L2 F' R U2 
// B2 R2 D L2 D' L2 U' R2 D B2 R2 F2 L' B D L U' R' U' B F' 
// U2 B D2 R2 D R2 U B2 L2 U' L2 F' L2 R' D F L' B2 R2 
// R2 D2 R2 B2 D' R2 B2 U L2 D' F2 L' B' U2 F2 U2 B' U' F2 
// B2 U L2 F2 D L2 U F2 D' L2 F2 B' U2 R' B' F2 U2 R' F' U' B' 
// F R2 U2 L F2 L U2 B2 U2 B2 R' B2 U2 F L' D' R B D' F D 
// R2 L F2 U' D' R2 D' B R' U R2 U2 B2 L2 F2 L2 U L2 U B2 U' 
// D L2 R2 D2 B2 U L2 U' R2 D2 L2 B' U2 R D2 B U' R' B' D' U 
// L2 R2 D2 F2 U L2 F2 D' B2 D L2 D' B' R2 D2 L' B' L F2 D' R2 
// D' L2 B U2 R2 B2 R2 F' L2 F L2 F' D F2 U2 B D2 L' R' 
// D R2 B2 D2 F' U2 R2 F R2 F2 D2 R2 U L' D' R' F U2 L F D2 
// U B' R D2 L2 U2 R2 B L2 B' D2 B' U' R2 F2 R2 B L B2 
// U' F L2 U2 L' F' L2 U F2 B2 L' F2 B2 L' D2 R2 F2 R2 F' 
// D' R2 B R' D' L B' L U D2 R2 B2 D2 L2 B2 L D2 F2 L F2 R 
// B' D' L' U D' B2 R' F R2 F' L2 D2 B' U2 D2 R2 F' U2 L' B 
// B2 U2 B2 F2 R2 U' L2 U L2 U2 R2 L D B' R2 U F U2 L2 R' 
// L' B U' D2 R U R F2 L2 U2 R2 D2 F2 D B2 R2 L B 
// F U' F2 U' D' R' L2 F' D2 B2 U B2 U' B2 U2 B2 R2 U' B2 
// L2 D' R2 D2 B U2 L2 B' F' U2 B' U2 L' D2 L2 F' D F R D 
// U B2 R2 F2 D' L2 U F2 U' L2 U L' D2 B D F' R' U' F2 R U 
// F' U' R2 B2 L2 F2 D U2 R2 D2 F2 U' B2 R' D' R2 F' L' B2 D2 B' 
// D2 B D2 R2 F D2 B' R2 F' D2 B2 R2 D' L R2 U F2 R' U2 F2 R2 
// L F U2 R L D R2 F R2 D L2 U R2 U B2 D R2 L2 B2 D B 
// R2 D' B' U2 L D R2 U B' L F2 U2 F2 L D2 B2 R' L2 B2 U2 
// R2 D' R' D2 F D R' L F2 U2 D R2 D' L2 B2 L2 U' B2 F' 
// U2 L' D2 B' L2 F D2 F2 U2 B' U2 L2 F' L2 R D' U L' B2 R U' 
// L D' B2 R' B2 L' D2 R F2 R' D2 L' B2 D' L2 B' D' F' L' D2 
// B F2 D B2 U2 R2 U' F2 L2 D' B2 D2 B D2 F' L' B' R2 U2 F' 
// R B U2 B2 L' D B' D' R B2 R U2 R2 F2 B2 L' U2 F2 D2 B' 
// R' F' U2 L2 F' L B' D' B2 R F2 U2 R2 B2 D2 R F2 D2 R2 D 
// L2 B' R2 F U2 B2 U2 L2 B' D2 F L2 R' D' B' U2 L' F' D' F2 R 
// F R' U' R B D L' F2 B2 D2 F2 D' L2 D' R2 U' B2 L2 F' D' 
// L' F R' U F2 D2 L' D F2 B2 R U2 L2 U2 R' U2 L' F2 R' F' 
// R' F' U B' D2 B R L' B R' F2 R2 F2 U2 B2 D2 R U2 F2 R F2 
// B2 U B2 D2 L2 B2 U' R2 D F2 L2 F2 L' F' R' D L2 D2 F' D2 F' 
// U F2 R' B D L F B U2 D B2 U' R2 U2 R2 F2 U R2 F2 U2 R 
// R' D' L2 D' B2 R2 U2 F2 D' B2 L2 U2 F' U2 R2 U B U2 R' U 
// L2 B2 U2 B' D2 R2 B' L2 D2 F' L2 D2 L' D R2 B2 F' U' L' U' 
// R2 D2 F2 U B U R F' D2 L2 B' R2 F R2 D2 B U2 L2 B U' L' 
// R B' F2 U2 B D2 L2 D2 B R2 U2 F' R D2 U2 B D' R2 U' B' 
// D R' B R2 F B2 D2 L R2 D F2 U' B2 D L2 D' B2 R2 L2 D 
// R' U' F2 U R U' B U' D' B2 L2 D F2 B2 U' R2 U' B2 
// U F2 L2 F2 D' R2 U L2 F2 D F R B2 F' L D2 F2 L D F' 
// U2 L2 B L2 F U2 R2 F2 R2 F2 L' B2 L' B U F2 D2 L' B' F2 
// R' B' R2 F2 U2 L2 D2 F2 U2 B2 F' L B' F R B' D' L' B2 U 
// U R2 U B2 R2 D2 B2 L2 U' B2 U L2 R' F' U B' U2 B2 F2 D' R2 
// R D' F L B' R U B' L R2 D L2 F2 U' B2 U' B2 D2 R2 F2 U2 
// U2 F2 R2 U2 B2 D R2 D' B2 U' F R2 B L' D2 F R' U R' B 
// D2 R' D2 U2 F2 R F2 L' D2 L2 D2 F2 U' R2 D' F U' L2 R' U 
// R U2 L2 U2 D' B D' L' U L2 U B2 D' B2 U' R2 D2 L2 F2 
// D' B R D R2 D' L2 B2 D2 U' B2 L2 U2 B' L2 B L U2 F' L 
// F' L2 B L2 B U2 R2 B2 R2 B' D2 F2 R D L B D R2 D2 U' 
// F D R' B' D B R2 B' D' B2 D2 R F2 L' F2 U2 R' D2 R' U2 B2 
// F2 D R2 B2 D' U2 R2 B2 D2 R2 B2 L' B L R' B L D2 L D2 
// B R L B2 D R' L2 F' D2 F' U2 D2 F' D2 L2 B2 
// L2 B2 R2 D2 L2 F' U2 F D2 R2 B2 F L' D U2 R F2 U2 B' D2 L 
// B' D2 L2 F U2 F' L2 B2 L2 R2 D' L U F' L D F D' R' B 
// F' B2 L2 D L2 U' B U2 D2 B2 R U2 L' F2 U2 F2 D 
// R2 D F2 D' L U' B U' F U2 D2 F2 U' L2 D B2 L2 F2 D F2 
// R2 F' R2 U2 L2 R2 F' R2 F' D2 F' U2 D F L B2 D2 L R' D U2 
// L' F2 L2 D2 F2 D2 L' F2 U2 L R F2 U L2 B R D2 F D' R2 F 
// R2 D2 U2 R2 F2 U B2 U2 F2 U' R D B R D2 B R U R 
// B2 F L2 D2 U2 B' D2 B' D2 L2 U2 R' D' F2 U R B' L' F R2 
// U F2 R2 U' L2 U2 R2 B2 U F2 R2 F2 L B U' L2 F2 L' D U2 F2 
// D2 L2 U2 B' L2 F' L2 B' D2 B2 U2 F' D' R' D2 L' D2 B' F' D L 
// F L2 F D2 R2 U2 F U2 F L2 B' D' R B2 F' L U2 L' B F 
// U2 F R' D2 U' B2 U' L2 B2 F2 U R2 U2 B2 L' R2 U F' U' L' R 
// R' U' L2 F' L B L2 B2 R B' L2 U B2 L2 D' R2 F2 U' D2 F2 U2 
// F' D' R D F2 U' R B L D2 F2 B2 R' D2 L2 B2 L U2 R F2 
// L2 F2 R D2 L2 B2 D2 L' U2 R' D' U' B L D' B R D2 F2 
// L U' F B' D F' L' F2 L2 D2 F R2 D2 B' U2 F D2 B2 L B2 U' 
// F' U' B2 L' D2 L' U2 L2 U2 R' D2 U2 R2 B' L2 R F' R B2 R' 
// B R' U2 F' L2 D2 B U2 R2 D2 L2 B' D' B U F U' F2 D L' 
// R B2 F2 R F2 R D2 U2 R' F2 R B L R' F L' D' R2 F2 
// U R2 U R2 B' U' L' D' F R2 B D2 L2 B2 L2 F' U2 B' U 
// D U L2 U' R2 U B2 F2 L2 D B2 F U2 R' F D2 B2 L' R2 U 
// F2 U D2 L' R2 B2 L R2 B2 D2 R2 B' D B D2 U F L' 
// D F' B L' D' F2 L B' L2 B L2 F D2 B' R2 L2 U2 R2 D B 
// L' U2 L' F2 R D2 L' F2 R' B2 L D2 B L D R D' B2 U' R' F 
// R D' F' R D2 R2 U B' R2 L2 U2 R2 U F2 D' F2 U F2 L 
// D' L2 R2 D2 L2 D L2 B2 D' R' B L R' B' F' U2 B' D' F2 
// F2 U R2 F' L2 D2 B' U2 L2 F2 R2 B' U2 F R' D' U B' R' D R2 
// U2 L D2 F D2 F2 U2 R2 B F' L2 D2 L B' U F' L2 F2 D' F 
// R F' D' F U2 D2 F' R2 D' L2 U F2 L2 D L2 D' F2 U' F L 
// L U R2 D L2 F2 D' R2 F2 D2 L2 B2 F' R' D R D B' U F 
// L F2 U2 L2 D2 F2 D' B2 D R2 B2 R2 L B' U2 B' D2 L' B D 
// L D2 F2 R B2 U2 L' F2 R U2 B2 D' U' R F' D2 L2 F D' L' B 
// B2 D' R2 U2 B2 U' R2 U L2 B2 U' L2 B L' U' F' L B D U R2 
// F2 U2 F2 U L2 U B2 D' B2 F2 R2 D' L' F R F2 L2 B' U' F2 U 
// D B2 D' F2 D L2 D R2 U' R2 U2 B' D2 B F2 L' U F U2 R D' 
// R2 U F' B2 D R F2 B' R L2 F' U2 R2 B2 L2 B' R2 D2 B2 R2 F 
// D L' B D F' U2 R' D' R L B2 L' F2 R' D2 L' F2 L D2 L2 
// B2 U2 F2 U' F2 L2 R2 D' R F U L F2 U L' U2 R U2 
// R D' R L' B R D B2 D2 R' F2 L' U2 R' D2 F2 L B2 D' B' 
// D' R' D R U2 R U' F B' U' B2 U' D' F2 R2 U B2 L2 B2 
// B' L2 D R2 U' L2 F2 U' L2 F' L U2 B2 L2 R' F' U' 
// U2 B2 L2 D R2 B2 R2 D B2 F2 U L' B R2 F' D R B D' F 
// D U2 R2 B2 R2 F2 R2 U' F2 R2 D2 B' L F' D2 B' U' B2 U' F 
// L2 B2 D' R2 F2 R2 U B2 D' U B2 L' B F2 D L B2 U F2 L' 
// B2 L B' R2 U R2 D2 B2 F2 U' R2 U L2 F2 R' U' B' D2 R' F U2 
// B2 L' R2 D R2 F2 D' B2 U B2 R2 B2 F' D' F L' D' F2 L2 
// F' U2 B2 L F R2 B' R D' B U2 F2 D2 B R2 L2 B R2 D2 B2 
// B2 L2 U2 L2 F2 D2 B2 D' R2 F2 R' D2 L D F U' F L2 F' R' 
// R D2 R' U2 L2 D2 F2 L' D2 F2 U2 L' U' L2 U2 L' F' U L' B L' 
// F U L2 U2 B2 D' L2 D L2 R2 F2 U2 F' U' R U2 B2 D B' R' 
// F' L' B2 R' F' D B' U D2 F2 U' F2 R2 U L2 D' R2 L 
// R U L B2 D F' D R' L B R2 B2 R2 L2 U2 F2 D2 F L2 U2 
// F' R2 F2 R2 B U2 B' R2 D2 F2 U2 B R' U R U2 L D' U2 F U' 
// F U2 L2 F2 D2 B' L2 F R2 F2 L' D2 B' F L D2 L2 D F' 
// B L' U2 B2 U R F2 D' R2 D2 L2 U2 F B2 D2 B' U2 F' D 
// B2 U2 B2 F2 R2 U' F2 U2 L2 B2 D B2 L' D' R' U' L' F' L R' F2 
// L2 U2 B F2 D2 F' U2 L2 B' U2 F' R' F' R D' F' D2 U B D2 
// B' U2 F D R2 B2 D' L F2 B2 U2 L' F2 R' U2 F2 D2 B2 D' F' 
// U2 B2 L' D2 R' F2 U2 F2 D2 F2 L2 R' U F L U2 B D2 L2 U B' 
// D2 B' R' D2 L B2 U2 R' F2 R' D2 R' F2 R' D' L2 F' L' B R U 
// R' U' F2 U B2 U' L2 U2 B2 U F2 U2 L D2 B L2 F R D R U' 
// U' R2 F' D2 L2 U2 F2 D2 B2 U2 F R' B U' R2 F D B2 F' R 
// U' R2 D L2 F2 R2 D L2 U' F R U' F' D' L' B2 D2 F' L2 
// D2 R D2 B2 L F2 R2 F2 R' B2 L B R' F2 L D' F D R' F' 
// B D L' B2 L' F2 R U2 R' F2 L' U2 L' B2 F' R D B' F' R' F 
// B2 U' R2 D L2 D B2 R2 D R2 F' L' U2 F' D2 L' F2 R2 U' B2 
// L2 F R2 B2 F R2 B' L2 F' D2 R2 F2 R U' B2 U B' D2 B2 U2 F2 
// R' F2 D2 R2 B2 R2 B2 D2 U B2 D' F2 R' D L B' D U B2 F' D2 
// D' B2 D F2 D2 B2 R2 D F2 D L2 F' L' F R D2 U B' F 
// D2 L2 B2 U2 L2 U F2 D' F2 L2 B' F' R' B' F U' R F' R2 
// F2 U' F L B' R2 L' D B2 D' F2 L2 D' F2 D R2 F2 U' R D' 
// U' R' B' D' F' D2 L' B2 U L2 D' R2 F2 B2 D B2 D2 R2 D' R' B2 
// F2 D' R2 B2 R2 F2 R U2 R' F2 R' U2 R' D' F R2 B R' D2 U' 
// R2 D B2 L2 U' L2 B2 F2 U' F2 R' D2 B' U B U L2 F' U R' 
// R2 U R B2 U2 L' B2 D2 B2 R B2 L2 R2 F' U' L U R2 D B L' 
// F' D2 U2 B R2 U2 B U2 F' L2 B2 D' B R' D' B2 U' F R' F' L2 
// B' L' F2 L' B2 L' F2 U2 R' F2 R B R' D' F2 D L' R' U 
// F B' U' B U L' F2 R' U' F B L2 U2 B2 L2 U2 F' D2 L2 B' U2 
// D B2 R2 F2 U2 R' F2 L' D2 L' U2 R F' R B U' L2 R' F2 L' 
// R U B2 L2 U2 R2 U L2 F2 U L2 R2 B' U' F' L2 D' L2 U2 L F' 
// L2 U F' R' L' B' L D B' D2 L2 F R2 B' R2 D2 F U2 R2 F2 R' 
// D R D' L' F R2 L2 U L F2 R2 D' F2 L2 D' F2 R2 U' F2 L2 
// B2 L2 U2 R2 D' L2 D B2 L2 D2 L2 F2 L D U' R2 F U' L F2 
// U' F2 L2 F2 U L2 U F2 U B2 U2 B2 R' D2 U' F' R2 B U2 L2 
// R2 F2 U' L2 U L2 D L2 R2 D L2 B' R' F' R' U B' F' U R 
// D2 R2 D2 B' D2 F2 U2 F' D2 B' D2 R2 U L' U2 L' B D2 L2 R2 
// D' F R' L2 U' R2 D L2 B2 L2 D F2 D' B L' B2 U L F' U2 
// B' F2 L2 R2 F' L2 B D2 R2 D2 F U2 R' U B2 D' F' D2 U' F' 
// L D B2 F2 U R2 U F2 L2 B2 U' B2 D' F' R F' L' F' R2 B F 
// F2 D' L2 U' F2 R2 B2 F2 U' R2 U' F U2 L B R' B' D U' R' D2 
// U2 R2 F L2 U2 L2 F2 D2 B L2 B2 U F2 R' B2 L2 R D2 L F 
// F U2 F' D' L2 R2 U' L2 U B2 U' B2 U' B2 L' B R U' L2 B R 
// B' L F2 B L' D F R' D B' L2 F' R2 U2 B' U2 B' U2 B' U2 L2 
// U' B2 U L2 B2 L2 D2 B2 D L2 D2 B' D2 U2 L' D2 F' U2 L' R' U2 
// R' D2 B' U2 B' L2 B' R2 D2 B' U' L F' R2 B U2 R' U R 
// U2 F' U2 L2 B' L2 B L2 F D2 B2 D2 U L' B2 F' D B' R2 U' R2 
// U2 F2 D2 R' F2 R B2 F2 R' D2 U2 L2 F L2 R' D U L' U2 B D 
// B' U2 L' F' R2 F R' F B2 L2 F2 L2 D' R2 F2 U' B2 D' F2 R 
// D' R' L2 U2 B' U2 F2 L2 R2 U2 F U2 F' L D U2 R' U B' L2 F 
// D L F R2 D2 R' D' L2 F' U' F2 D B2 U2 B2 R2 D' L2 D F2 
// F D F' R2 D2 U2 L U2 R F2 L' U2 R2 F' D' B' U2 R B2 U' 
// D L2 B2 R2 U2 B2 F2 U' F2 U2 B' R B2 L F U' R2 B2 L 
// B2 L2 F2 D2 L2 R2 D B2 D U L' F U R U' B' U R' U' 
// B U2 F2 L2 B' L2 F U2 L2 F' D2 L D' B D2 U R' B L D2 
// B U2 B D2 R2 F' D2 F2 D2 B D2 U' L B' F2 U' L D' L2 F' 
// R D2 U L2 F2 D2 B2 U2 R2 F2 U2 F' D L2 R' B' D' U' L B 
// B' D2 U2 B' R2 U2 B' L2 F R2 F U L U R' D R' U' F2 
// D2 F2 L2 U2 R' B2 R F2 R' D2 F2 D2 F D L R2 B' F L B D2 
// D2 R L' F L' U' B' U2 L D2 L2 U2 B' L2 F' B' R2 F R2 
// L2 F B2 R2 L B U2 L2 U' F2 B2 R L2 D2 L U2 F2 R2 U2 R2 
// R B2 U F' L' B D F U2 R U2 L' D2 F2 L2 U2 D2 L U2 
// B R' U2 B2 D B2 F2 L2 U L2 D2 F2 R2 F' L D L F2 L U 
// F2 R' U L2 R2 D F2 R2 U F2 D2 L B2 F' D2 F2 U' R U 
// R U' D' R' F' D B' R U2 R D2 F2 D2 R2 B2 R U2 L' F' L' 
// D R2 B2 D2 B2 U F2 R2 U' F2 L2 U L U F L U F2 L' R F' 
// F2 R U2 D F2 R2 B R' L F D2 R2 F' D2 R2 D2 L2 B' D2 B 
// F2 L' U R L F U L2 D2 R B2 R U2 L F2 L' D2 B2 U F 
// R2 D2 U L2 U F2 D' R2 F R' B2 L R' U' B' R' F2 U2 
// D2 B' L' D2 R F2 L2 R' F2 D2 L' U2 R2 D F' L' B' F2 L' D2 
// L2 U' F U2 B2 D F' R' B U R2 U L2 U' L2 U B2 L2 F2 B2 
// F2 D2 F' L2 B' D2 B' R2 D2 U2 F2 L' F' R' D' L2 U F' L2 F2 D2 
// F' D B U' D2 R' B D L U2 B2 U2 L2 F2 R2 B' U2 R2 B L2 F' 
// R B2 L' D2 L2 D2 F2 R F2 L' F2 R2 F U' F' L' F' D U' L' 
// B2 R2 U2 F' D2 U2 B R2 F R2 F' U L B' L2 D L' B2 F2 R 
// U2 R U' F' L' F D2 B' D' B R2 U2 L2 U2 F2 R2 F2 B R2 L2 
// D' L F2 L2 R2 F2 U2 L2 U' B2 U' R B' L F' L B' D B' 
// L2 B' L' U' F2 D2 B D2 F2 R2 D2 R' F2 L B2 D2 F2 D2 L2 U' 
// U' F' B' L' B R2 F B2 U L2 U2 F2 D' B2 L2 F2 D2 L U2 
// R U2 B2 U B2 L2 D' R2 U2 B2 R2 D' R2 F D L' B L' B R' B' 
// L2 D2 R2 F' L2 D2 B' L2 B2 L2 U2 F U' B2 L' U' R2 D' L2 R' F 
// B' D2 B2 D' L F R D F R2 U R2 D2 R2 U D2 B2 D' F2 
// L' F' R2 D' F2 L2 F2 L2 F2 D' R2 U2 B2 R' B' L2 U2 L' D2 F2 
// R F' U' B D B L' F R' F2 U2 L2 B2 U2 B2 D2 L' U2 F2 
// D2 L U F2 U R2 B2 F2 D B2 L2 U' F2 D2 B D' F2 R' U B' R2 
// L2 R2 D' U2 R2 U' F2 D L2 F2 U' B2 L' B2 L' U' B D U B' F' 
// F L' D2 F2 U R2 F2 U2 L2 F2 D R2 F L D' U R' F' R2 B 
// R2 D B2 U L' F' D F L2 B U2 F' R2 U2 R2 D2 B D2 L2 U 
// B' U B2 U2 R2 B' U2 F' U2 R2 F2 L2 R B' R2 B U' L' D2 
// F2 U2 D' L2 D' F L D2 F' L2 B2 D2 B' L2 F' D2 B U2 L2 D' F' 
// D' L2 R2 U' R2 D2 U' R2 D L' U2 B' F D R2 U' R D2 U2 
// U R2 L F' U2 B2 L U D2 B2 R F2 R U2 F2 L D2 R F' 
// U2 R D2 B2 D2 F2 L2 R' B2 L2 U B D' F U L2 D' L B 
// U2 F2 L' U2 L F2 L2 D2 L2 U2 D F L2 B D2 L D2 B D' U' 
// R B D2 L2 F' D2 R2 D2 L2 U2 F' R2 U' F2 D2 R F U F D' 
// R' D2 F' D' L2 U' F2 U B2 R2 D L2 R2 D2 F L2 B R U2 F' L' 
// U B2 L2 F2 D2 L2 R2 U' B2 U2 F R' F2 D' R' F' L U F' U2 
// L' U2 B' R D F' L F D2 R2 B R2 B' R2 B L2 D2 F' U' L' 
// F' R' F2 U' R2 B2 D B2 D L2 B2 U' L2 R2 F' D L B' U B' D 
// L2 F U' D L' B' D L B2 D2 F' U2 B U2 R2 U2 B' R2 B' U2 
// U B' U B2 D' R2 D2 F2 L2 R2 D2 F2 U R2 F D' L B U' B2 F 
// U R' F2 D' B2 U L2 U2 L2 F2 U F L B' D2 L' B' D' U2 
// F2 L2 B2 U2 B' L2 R2 F' R2 D2 B' R' U2 B D' U2 B R2 B' L2 
// D' L2 B U2 R2 F' D2 L2 R2 F2 D F' R2 B R B F L2 
// U2 F' R2 F' U2 F' R2 B R2 D2 F R F D' U' R' B D B2 R' 
// D' F' B' L U B U R B' U2 B2 D' B2 R2 D' F2 R2 D2 B2 L2 U 
// L2 U2 F2 D' U2 R2 F2 D' R2 U' B2 L F R' B2 D' B' D F R' U2 
// L U2 F L' U2 F' L' F2 D' F2 L D2 R2 D2 F2 R' B2 R2 U2 
// F2 L2 B' D2 R2 D2 B' F' U2 F' U' L2 R' B' U' R2 F U F 
// F2 U L' U' L' F2 D2 B L' F2 D' L2 U F2 B2 U B2 U D F2 
// R' F' U B U' D R' U F U2 F2 R2 B2 R2 U2 F2 L2 B' R2 D2 
// U' L' B L2 U' R' F2 U R D2 B2 D2 L2 F R2 B' U2 L2 U2 R2 U2 
// B R' U B2 U L2 F2 U L2 F2 L2 D L R' F' L B D' F' R 
// D' U2 R F2 R2 D2 R' D2 R B2 U R B' U' L2 B2 D2 F' 
// B R2 D2 F U' L U' L' F2 L2 F2 U R2 D' B2 D2 F2 U' F2 R2 F' 
// L' D2 R2 U' R' U' B R2 U R2 F2 R2 U' D2 R2 D B2 U2 F 
// F' B L' B R' D' R' B2 U' R2 F2 L2 U B2 D F2 U B2 D F' R 
// U' B2 D' L2 D F2 D2 B2 R2 B2 D B L' F2 D U L' B D' F U 
// F' D R U R F L' B' L2 B2 D2 R2 F2 L U2 B2 L' F2 R B2 
// L2 U F2 R2 B2 U L2 F2 D B2 L2 F L' D L2 R U' B U2 L2 
// L' F R2 F D2 L2 F R2 D2 L2 F2 L2 F' R' D' L' D' L B' U' 
// U' L2 F2 D' B2 U2 R2 U L2 D R' D B' R U' F' D' L' F' R 
// L U L B2 U2 F2 D2 F2 R2 B2 L R2 D L' B D' L2 R' D 
// B' U2 L F2 R' F B2 D U2 F' U2 B' R2 L2 B' D2 L2 B' D2 F2 D 
// B U2 R D F' U' L' D2 L2 U' D2 F2 U F2 L2 U R2 F2 R U2 
// B2 L' U B2 R B D L2 U L2 F' U2 L2 D2 B R2 B2 U2 F' R2 
// F2 U B2 D2 F2 D' L2 F2 D' F2 L D B2 D' R2 B L' F R 
// R' U2 L' D2 B' L D' B D L F2 U2 L F2 R2 B2 U2 R F2 U2 
// B2 U2 R2 U' B2 L2 U2 B2 L2 U R2 U' L' B L2 R F' U2 L' F D2 
// F2 L2 F D2 L2 F2 L2 F' D2 B2 L2 D' F L D2 R2 F' D' B R 
// U L U B R2 F' R' U2 B' R2 L2 D' R2 B2 U' F2 U2 B2 R2 F2 
// D' L U2 B R2 F U2 F2 L2 U2 B' F2 R2 F D' B U R B 
// U' L2 F2 U' L2 F2 L2 D2 F2 U R F L' U' F2 L B2 L' F D2 
// R D' L D R2 U' D2 F' D R2 D L2 U' L2 F2 U2 B2 U' F2 D F' 
// F D2 U2 L2 F' D2 F U2 L2 B2 R D L' U B2 D2 L' B' F' 
// B2 U2 B2 L' D2 R B2 L2 B2 L' B D2 L' F' U B' U2 B2 D 
// R2 D2 B R2 U2 F U2 B' U2 F' U' R' B2 D2 B2 R F U 
// D2 B U2 R U2 R2 D' L' F' U2 L' U2 L B2 U2 D2 R L2 U2 D2 
// R2 B D2 F B2 D L' B' D' R D2 L U2 B2 R B2 L D2 L2 B2 R' 
// L B2 D B2 R2 D U R2 U' F2 L2 F2 L F D' L2 D2 U2 F L' 
// R2 U' F2 R2 F2 U2 L2 D2 U L2 D L' U2 F' R B F' R' F L 
// D F B2 L U R2 L' D' F R2 U' B2 D' B2 U R2 L2 D R2 D2 B 
// F' U' F2 D2 B2 D B2 F2 R2 U L2 D2 F L R2 B2 F2 D' R' D2 B' 
// R U' L' B2 R U' F' L' U2 B2 R' D2 B2 D2 L D2 L B2 L2 D B' 
// U B2 U' B2 F2 U2 B2 D U2 B R2 F' R' U L U2 F' U2 
// R2 U2 B2 L2 F2 L2 D' U2 B2 F2 L2 U F' R B2 U' F' R' F' R' U' 
// F2 R' F2 D L2 F2 D' B2 D F2 L2 D2 L2 U F L' R' F' L' F 
// L2 D2 L' B2 L R2 D2 L D2 F2 L2 D2 U R D F' L D' B' F D 
// F L2 R2 F2 U' F2 U2 R2 U F2 R' D2 F R' B' D L' 
// R2 U2 F2 R2 B D2 R2 B U2 B2 D2 B' L' U' B U2 R2 B' D B' R 
// B' D F L2 B' L2 F D2 F' U2 L2 D2 L2 F2 R' B2 D' R2 F2 U2 B 
// B L2 D2 L2 R2 F2 D2 B D2 F' U2 L2 U' B' L R B L2 D U' B 
// F U D2 R U B' L2 D2 B F2 D2 L2 F2 U' R2 L2 F2 U' R2 
// F2 U2 F2 U2 R D2 L2 R F2 L2 R' B2 F' L F2 D' F' U R2 
// U F L' U2 B2 D2 U F2 U R2 U' F2 L' B' L U' F' U2 L 
// L' B' U' B2 U' F2 D2 L2 U' R2 B2 U2 B2 U' L F2 U' L' R2 B' L 
// B2 U L2 D2 B2 D' F2 L2 F2 D' R U' F' U R2 D' F' L U B 
// B' R2 B2 U2 F2 R' U2 R2 U2 B2 U B R' D B2 L D2 B' R2 
// R2 F2 L B2 R B2 L D2 L' F2 U2 F' R B' U F2 L' D' R2 D2 R 
// D R' D' B2 D R2 D2 B2 R2 B2 R2 D' R2 U F L2 D L U2 F D 
// L2 D2 B2 R2 U' B2 R2 U' R2 D U' F R U2 F2 U' L' D' L F' 
// B' F' D2 L2 B L2 R2 F' L2 B2 R' D' F2 L2 D2 L' B' U B2 
// B2 U2 L2 R2 B' D2 B' D2 F2 L2 F2 D' F' D2 B L' U' R' B2 U2 
// F' R2 D' R2 D F2 U' L2 F2 U L2 B2 D2 R U2 R B' R2 U' R F' 
// F2 U2 D F2 B U' B L' F B D2 L2 D2 B' R2 F U2 F D2 F2 
// B L F2 U B2 U2 L2 R2 U' R2 U B2 U2 R2 L F2 R B D U R 
// F' L' D F2 R2 F' D2 B2 F' L2 B' U2 L2 D2 R' U B' L' B2 D B' 
// B L B2 L' B2 U2 R' B2 L2 R' D2 F' L' R' F' U' L F R 
// L2 R2 U' L2 D2 U F2 R2 U' R2 U' B' D2 R' D2 R2 F' D L' R B' 
// D B U2 R F2 U' F L' F2 L2 U2 F D2 R2 L2 B' D2 F D2 L D2 
// L2 U2 R2 U2 F L2 R2 U2 F' U2 F' D' B' D' L U' L' U F' U' 
// B R' U' D2 B' D R B' U' L D2 B L2 F2 R2 D2 F L2 F R2 F2 
// U2 D' R' F' B L' F U R2 B2 U2 F2 U2 L2 D' R2 D B' 
// U2 R' B2 U2 B2 R2 U F2 L2 D F2 R2 U F' D F' L2 U L B 
// F' L B2 U2 L2 D2 L' D2 F2 R B2 R2 U' B2 L F' R' F2 R' U R' 
// R' F2 B R U B' R2 L2 F R2 L2 F2 U' R2 D2 F2 R2 D' B2 R2 
// L2 U2 D F R' U' L' U' B' R2 U2 F L2 F2 R2 D2 B' U2 F' D' 
// F U R' F2 U D' L' B D2 R U2 R' B2 R B2 R' B2 L' U2 F' 
// D B2 D2 B D F R' L U' L2 U' B2 U' L2 U' F2 B2 D' L2 D 
// U' B' U2 F2 D2 R2 B2 R2 B2 U' L2 R2 F2 U' F D F' L' F' U R 
// D2 R U' L2 U R' F' L D L2 D B2 R2 U2 L2 U F2 L2 D B2 
// F' L2 F' R2 D2 F R2 F' L2 R2 D2 L F2 D L' U F L2 R D' U' 
// D' B2 F2 D' R2 U' B2 F2 R2 U2 R2 D' R' D L2 U' F U' R' B U 
// L2 F' L' U B2 D' L2 B2 R2 F2 U2 F2 U F' L' D R2 B R' B' 
// D2 R D2 R2 D2 F2 L R' B2 U2 R U' F D U2 B L F' D2 R2 
// B R2 U F' B R F' L F L2 F D2 L2 F U2 B' U2 B' R2 U 
// L2 D' L2 B U R2 L' U R2 L2 F2 D2 R' U2 R U2 D2 B2 U2 
// D' B L2 U' F' R D2 B' R L B2 R' F2 L F2 R' U2 R' U2 B 
// F' L D2 F R' F L' B' U' R2 B2 D2 L2 F' B2 R2 B' D2 F U2 
// U L2 D' B2 D F2 D' L2 U B2 U' L2 R' D' L2 F L2 B' D U' 
// U2 R2 D R2 B2 D2 F2 D' B2 F2 R2 U' F' R F U R' U2 B D' U2 
// F' R' U2 F2 D2 F2 U2 R2 D2 U2 R' F2 R' F L D2 U' R' D' F2 U 
// L B2 U2 F2 D2 L2 B2 R2 D' L2 R2 U' B D L' D2 R B D2 R2 
// U' L' F U2 R2 U2 F' R2 B' U2 F2 L2 D' L' D U R D' F' U 
// R D2 F U2 F L2 F' L2 D2 B' D2 B' R2 D' L' D' L' R2 U2 
// F2 U F D' L2 D R F' D' L2 D B2 L2 D' R2 D' L2 U2 F2 R' 
// R2 F' R2 B' D2 L2 U2 F L2 F' R2 F' U L' B2 U B' R2 D U' 
// R2 U' B2 R2 F2 U' F2 D L2 B2 F' L F D2 B' U2 R F U' L2 
// R U' R2 B2 D' F2 D2 R2 F2 R2 D' B2 U2 R' D' L' U B' F U' L 
// D2 R2 B D2 B' L2 B2 U2 B2 F' R2 U2 R U F U F' D R2 B' U' 
// B' L2 R2 D2 L2 D L2 U2 R2 U' R2 U' L' F L' F' U B' L D R 
// F2 L B' R2 D' R2 D2 R2 B2 U L2 U B2 R B F' U' R D' B 
// L' B L F2 L2 D B2 L2 U F2 U' B2 F U' B U2 R D' F2 
// B2 R' F' U F D2 F D R2 U2 L' B2 L' U2 B2 L U2 L2 D2 R2 
// F L2 B' R2 D2 B D2 L2 B' D2 F2 U R' D U2 B D2 R2 B2 L' U 
// D L2 D' L2 R2 F2 R2 U F2 D' R D' U' F' U' F2 U2 L' D' L' 
// F2 R2 D2 R2 U2 R2 D B2 L2 R2 D' B F' D L2 F U2 F2 R D' F 
// D2 F2 D L U' F R' B U' R2 B2 D2 B' U2 L2 F U2 B D2 R2 F' 
// F2 D' U' B2 D B2 L2 D R2 F2 R2 F' R U' F D' F R B' U L2 
// F' R B2 D2 L2 D2 L2 B2 R F2 D2 R' B' L' D2 U' R D U2 F' 
// L U2 L F2 U2 R' D2 R2 B2 L D2 R2 B D2 F D R D2 R' F U' 
// U' B' L2 F L2 F' R2 U2 B' D2 L2 D2 F2 U' F U B2 R U2 F R2 
// B' L F2 D2 L2 U' B2 R2 B2 D2 L2 D B2 U' F' R F2 R2 U2 F2 U' 
// L2 F' L2 U' R2 F2 L2 U R2 U2 B2 D' B2 F D F R B D L' D 
// R F D F R2 D B' U L U2 F2 U F2 D2 R2 U F2 U' R2 L2 U' 
// U F2 L F2 R' F2 D2 U2 R' U2 L2 D R' U' B F U2 R F U' 
// L F B' U F R' B L' B' R B2 R F2 U2 F2 L' U2 L' B2 R2 F2 
// R L2 U' B2 L2 U L2 D' L2 U' B2 U' R' F U2 R D B L U' L2 
// B' D2 L D2 R' F2 U2 L B2 R B2 U R B L' U2 R F2 D 
// D2 U' L2 F2 R2 B2 D' U' R2 L' B F' U R B' F2 R2 F2 
// B2 L2 D L2 R2 B2 D F2 U' B2 L2 U' R B' L2 D2 B' U L D2 F' 
// L2 U2 R B2 U2 L F2 U2 R2 D2 L' R U B F L' F' U L' D 
// F U2 L2 R2 F2 U' F2 D' B2 L2 B2 U2 R2 B' L F D2 F' L' R' 
// L' D2 R' B2 L' F2 R2 B2 R U2 R' B2 D F U' L2 D' B' F2 R2 F' 
// B2 L2 F2 U' B2 U' L2 U R2 F2 U2 L D' F' R D F' L' R2 F' R' 
// F2 L' F' D2 F' R' U R D F R2 D2 F' R2 U2 F2 U2 B' L2 B D2 
// U R' F2 R2 B U2 L' D' B U F2 D' R2 L2 U R2 F2 U2 L2 B2 
// D' F' B2 L2 R2 U2 L2 B2 D L2 U F2 D2 R U2 L U B' F' D' R2 
// R U2 B' R' D L' B2 U F' R2 F2 U' L2 F2 L2 D2 F2 B2 L2 B2 D2 
// B' D2 B2 F2 R U2 R2 D2 B2 F2 L' B' L2 B U' L2 R' D2 B 
// B2 R2 F' R2 B U2 F' D2 B' D2 L2 B2 R D U' R' B D' U2 L D2 
// R2 F R' F2 R U' D B L F' R2 B' L2 B' L2 D2 F2 L2 D2 F2 
// F2 R B2 L2 D F2 L2 D2 U' L2 U2 L2 F2 L' D B2 D F' L R 
// R2 F' R2 F U2 B2 F D2 B U2 R2 F2 R B D2 L U F U2 L F2 
// U' F2 D' B R' U2 F' U2 F R2 F2 R' F2 D2 L2 U2 L D2 B2 D2 
// U' L D2 B2 L F2 R' F2 L2 U2 R B2 F' D' B' F' D2 B2 D2 R2 
// D B L' B' R2 B D R B2 U2 F2 D B2 U R2 U' L2 D2 R2 D F 
// U B' L2 R2 D2 F' U2 B' D2 R2 L B' D2 F2 D' L' R U2 B 
// R2 D2 B' D2 U2 B L2 B2 U2 F' L2 U' R2 D L' F2 R' F' L D 
// B D2 B2 U2 B2 U L2 U' F2 U2 R2 L' D' U2 F' L U R D' F 
// R2 U' L2 U' R2 F2 R2 F2 U2 B2 U' F2 B' U L D' U2 R2 D U2 F 
// D2 B D2 F' D2 F R2 B2 L2 D2 U2 F D' F L B' U2 L' U' L2 
// F' U2 L' D' L' D B2 R U2 L2 F L2 B' L2 F' D2 R2 B' U2 D L 
// D R2 U' L2 F2 D L2 R2 D' L2 U' F2 R D F U' R F' R2 D2 L 
// F' R' F2 U2 F2 D2 R B2 R2 U2 L2 U2 D B' F' D' L R2 D R F 
// F2 R2 D2 U' R2 D' B2 D U R2 L D F2 L2 B' U2 R' B' D 
// R U' D2 F' L2 F D2 B2 R2 B U2 F2 U2 D B' L2 F' U' B2 L' B' 
// F2 R F2 U2 B2 U' R2 U F2 U' R2 D B2 F2 R D B' D' F U' R 
// B2 D L2 F2 D2 U F2 D' R2 D R2 U2 F' D' F' L U' R B' D' F 
// L' B' U' F2 R2 U2 R2 D' L2 U2 R2 F' L' B F2 D F2 D' F2 
// B2 D' B F2 L2 F' D2 B R2 F' U2 B L2 U R D U B' L' 
// D L F L2 F2 R B R B' D' B2 L2 F2 D2 L2 U' B2 L2 U F2 
// D' B2 L2 B2 L2 D' B2 U2 F2 L2 F2 B' L B2 F2 U L' D2 F' R' U2 
// D F B2 L2 D2 F2 D L2 D2 B2 L2 D' U2 L U' B F D' F' 
// D R2 F2 L2 D B2 D2 U B2 U' B' D' R' F2 D' F L' D2 L' U' 
// U2 F' D' B D' L' D L U2 F2 B2 R2 D2 R D2 F2 B2 R D L2 
// D' R' U L2 U L2 D B' D' F2 U2 D F2 R2 D B2 L2 D' R2 
// B2 L B' D2 B2 F' R2 U2 F U2 F2 U2 L2 R' U' F L R D U F2 
// D B R2 U B2 F2 U R2 F2 D' B2 D F2 R U2 L R2 F D U' 
// D' R' D' L2 F R B' R' D2 R' B2 D2 B2 D2 R' B2 L2 B2 L' D R' 
// L D B2 D' B2 D B2 D' F2 U L2 R2 U' L' R2 B U2 F R F R' 
// L D F2 R2 U2 F2 D B2 D B2 U F2 B' L' F2 D2 B D R2 B' R2 
// B2 R D' F2 R2 F2 U' B2 D' L2 D B2 F L2 D2 L D U' R' U 
// B2 L' F' R U2 R2 U L B R2 L2 U B2 U B2 L2 D2 L2 D R2 
// D2 L' D2 U R2 U' F2 R2 U' F2 L2 R U R2 F D2 F R' 
// U R2 D R' D R2 U' D2 R2 B' R2 B2 U2 F R2 F R2 F' L2 
// L2 B2 U' R2 D2 B2 R2 F2 R2 D U' R F' D' U2 F2 L D U' F U2 
// R2 U B2 D F2 R2 D' L2 U' L2 R2 U F' L B2 D2 B R F' U2 
// B' R F2 R2 F2 L B' U D2 R B2 R B2 R D2 R2 F2 L' B2 R' 
// B D R2 B' L F2 D F2 D2 F' R2 F L2 F2 U2 B' U2 R U 
// F2 D2 R2 B2 D2 F2 U' B2 D' F2 U' L2 R' D2 L' D B' R2 D' B2 D 
// L U' F2 D F' R2 B R2 U' R2 D F2 D2 R2 U' F2 B L 
// R2 D F2 D' B2 D' B2 R2 B2 D F2 D B L U L2 R' B D' U F2 
// L2 F2 U2 F2 R B2 U2 R U2 B2 R B2 F' D B2 R D U B2 U' F' 
// B' U2 R L U B2 U' F' R' U2 R2 U2 F2 D2 R' B2 L' D2 R F2 
// U' R2 U2 B2 D2 B D2 L2 F D2 L2 F D2 U L' R U' B F' L' D2 
// F B2 L2 D' R' D2 R2 B' L' U L2 D F2 D' R2 U L2 U R2 U 
// R2 B2 L2 D' L2 U' F2 D B2 D' U2 L D2 F L B D2 U' R' F L' 
// D' L' U R2 D2 U2 R2 B F2 U2 B F' D2 L' U R F' D B L' 
// B' D U2 L D2 F2 D2 R2 B2 L2 B2 D2 F2 U2 F U' B' R' F L R 
// D' B2 D2 F2 L2 R B2 R' D2 L2 D2 B' U' R' D L' D2 F L' B 
// L2 D' L2 D B2 F2 L2 B2 U2 R2 D2 L D2 L' U B2 F L R' U 
// F D L' B2 D L2 D' L2 B2 U2 L2 F2 R2 D L' D2 B D2 R' U L 
// L2 F L2 F2 R U2 F2 L' U2 L' F2 R2 F2 R B R F2 U' F' R' F2 
// B' D2 F' R L' B R U R2 B2 L2 B2 R2 U2 F' L2 B' L2 F L2 
// R2 U2 R2 L U2 F D' B2 R B2 L2 U2 L U2 B2 R L2 U2 F' R 
// L2 U B U' R L' F2 D U2 F' D2 F2 L2 D2 F D2 B2 L2 B U 
// D2 R F2 U2 R F2 L B2 L B2 R2 F R2 F L' U' B' R F2 U L' 
// R D R2 F2 U2 B2 U' F2 U' R2 D' L2 U R' B2 R' D' B' F2 U2 R 
// R2 U' L' F' U R2 L D2 B R' B2 L F2 R' F2 B2 D2 B2 U2 
// U F2 D' F2 L2 D' F2 U R2 B2 R D F2 L2 R U' F D' B' D' 
// D' F2 U F2 U2 L2 D' B2 L2 U2 F D F2 L R B' F R2 F' D2 
// F U F' L2 D2 R L' F R' U2 R2 L2 U' B2 L2 U' B2 U2 R2 D2 
// U2 R' D' R' L U2 F' D B R2 F2 L2 U R2 U2 R2 B2 R2 U' 
// L F' U2 R2 D B2 D' L2 D R2 B2 L2 U B2 R' B L D B U B 
// L2 B2 D F2 R2 D2 R2 U B2 F2 L2 R' F U' L2 F' L B' L' R2 
// U F' U D' B' L U' L2 U' F2 R2 L' F2 L B2 R' F2 U2 R2 D2 
// F L' R2 B2 U L2 U B2 D F2 U' R2 B2 F2 L D2 F U L2 D' L 
// U2 B2 D2 B2 D B2 U' L2 U B2 L2 U B U' F' D R' U B L U 
// F B D L' U' R U B R2 B2 L U2 F2 U2 R2 U2 B2 L B2 R2 U 
// B2 L B2 U' B2 D F2 R2 U F2 D B2 F2 U2 L' F L2 R2 F' D' L 
// R' U R B2 D' B D' F' D2 R L2 B2 R F2 B2 R D2 R' F2 U 
// U2 B L2 B R' U' R U F2 D' R2 L2 B2 D2 R2 U B2 L2 U' R' D' 
// R U2 R D2 B2 L F2 R D2 L2 F' L D' U2 F L R F R' U 
// B2 U' L2 B2 U F2 U L2 B2 F2 D2 R' B' R2 U2 L' B' D L2 B2 U' 
// U2 L2 B U' B R' D F' D2 R B2 D2 B2 R2 L D2 R F2 B2 D' F 
// U2 B' F' D2 U2 R2 B' U2 B' D2 U2 L U L D F2 D2 L F R D 
// F2 U R2 U F2 D R2 D2 L2 B2 D B' F R F' L' B' U' B 
// B2 U2 F' R2 F L2 D2 B' L2 B' U' F D2 R' B2 D2 L' U L' B 
// U' L2 D' B2 U L2 D' R2 D R2 U2 L' B D2 F' U B D L D' 
// B2 L' F2 R F2 R D2 F2 L' D R2 F D' R' U L B R 
// B' D B2 L2 D2 R2 U B2 D R2 F2 D' R' U F L2 B2 U B2 F' 
// D2 F2 D2 L' B D2 R F' B2 U B2 U L2 D F2 R2 D2 B2 R2 U' 
// D2 B' U2 F2 R' D2 L U2 F2 L' R F2 R2 U' L' B2 F R' B F' 
// D' B' D' F2 L2 R2 D' B2 F2 R2 D' B2 F2 L' D2 F2 U R2 F' R 
// U2 B L2 F R2 F' R2 B' R2 D2 F2 L F U' B2 D' L U' F2 R 
// R' D R2 U2 F D' R F2 D' L2 F' R2 F' D2 B2 R2 F2 R2 F R2 
// B R D2 R2 B2 U2 F2 D2 L' B2 L2 B2 D L U2 F2 R D2 U2 B' 
// R' U2 L' F' R2 D' F2 R2 U2 F2 U B2 R2 B2 L' F2 U L' B F' U2 
// L2 F' D2 R2 U F2 U' B2 D' L2 U2 L2 D2 B' D U2 R' U L D 
// F2 L R2 D2 L D2 U2 L' R2 D2 U2 B' D R B2 F' D R D' U2 B' 
// U' R2 U' F2 R2 B2 F2 U' L2 B' U2 R D U2 F U F2 U2 R 
// U L B' R2 U' F2 R2 D U L2 R2 F2 U' L' F L B' F' U B 
// F2 R F2 U' B D F R L U2 D2 L2 F U2 B' R2 D2 R2 D2 L2 B' 
// R' B2 R2 D2 F2 R' B2 L D2 R F2 R D' B2 F D' L' F2 D' L 
// F2 L2 U2 R2 D2 F2 D2 F R2 D2 R' F2 D R' U' L U L2 U' 
// B' D L2 B' L F' B D B' U F2 R2 U' B2 U B2 R2 U R2 U' 
// B' U2 L2 U2 R2 B2 D B2 F2 R2 U2 F2 R' F2 U' L' B2 R' U' F R' 
// L2 D' F' U' F2 R2 L' D' F2 U2 F2 L2 B2 L2 U2 F R2 F' U2 L' 
// F' R2 D' L2 F2 D B2 D U2 L2 U F2 R2 B D L U' F2 U2 F' L2 
// R2 U R2 D B D B' L F2 L2 B' R2 U2 F L2 F D2 L' 
// L2 B' L2 D2 U2 B2 D2 U2 B' F' U2 F' D' F' R B D' B2 F' D 
// U' F L2 D' B2 U' R2 D' L2 D2 F2 L2 D' U2 F' L' R B L' D2 B2 
// B2 U' F2 D' F2 R2 F2 U2 R2 U2 R2 D' R D L2 F L' D2 F2 L 
// U' R2 D2 F2 R B' R' U B R2 F2 L2 U2 B' L2 U2 F' U2 D2 R' 
// L' U2 F D2 B2 D2 R2 U2 F' R2 F2 L2 D2 R U F2 L' D F U2 B2 
// D' R2 B' L2 F2 D B2 R2 F2 L2 R2 U2 R2 F D' L R2 D R' 
// U' F2 D2 F2 L2 D B2 D R2 U' F2 B R B' U2 R D' L2 B L2 R2 
// B' D' R D L U2 D F' D2 F U2 F' B' U2 F R2 U2 L2 F2 D 
// F2 D' F2 D' U' B2 R2 U' B2 U R2 U2 F R F D2 F2 L F L F2 
// D' L R2 B2 R2 B D2 B2 R2 F2 L2 F D' U' L' F' L U2 B2 R' 
// U B' U' R U' F D2 R' D2 R2 L2 B2 U F2 U F2 U' F2 L2 B 
// R D' R2 U L2 B2 D2 R2 B2 R2 U R2 D' F' D F2 R' U R D2 B 
// U2 B L D' R' L2 D' B U2 B2 R2 L' B2 R' U2 R2 F2 B2 U2 L U 
// B2 D' L2 D B2 L2 B2 U R2 D U B R F L U' R' B D2 R2 
// D' B2 D2 L2 F' U2 F R2 F2 L2 F' L U2 B L B' L' D' L' 
// R F2 R2 D2 R U2 R' D2 F2 R' D2 R2 B R2 U' L D U' L2 R' B 
// D B2 L2 D2 B2 R2 U' B2 D B' R2 U2 R' D' U' B' L F' R2 
// D R2 F2 D' R2 U' B2 L2 D2 F2 U' F D2 L D F U' B F2 D2 
// B2 L2 D R2 U' L2 U' R2 D' B2 F2 D2 B R D' R' F2 U2 F D 
// D' L D B2 D2 R2 U L2 B2 U' B2 F' U' L F D' F' R' 
// F' L2 D2 B2 R U2 R' F2 L' U2 F2 R2 D' R U2 B U B L R' 
// B' D L' F' U2 R2 B D2 F' L2 D2 U2 B' D2 R' U' R2 D' L F' L 
// F2 R' B' L2 F D2 F2 D2 R2 D2 B R2 D L2 F2 D2 L' U F 
// L2 B D2 B2 L2 F L2 D2 F L2 R U F L B2 U' L' B2 L2 U2 
// R' L2 B2 R2 D2 F R2 B D2 F2 U2 F R2 D' B2 R' F2 D' R' U L' 
// D2 L2 F2 L2 U R2 F2 R2 B2 R2 D' B' R' F2 D' L2 D' B F2 D' L' 
// U' R2 B' R2 F D2 U2 B' U2 B' D L F D' B' D B U 
// D' L' B2 D' F R D F D2 R2 U R2 B2 D2 F2 D B2 U F2 D' B' 
// R' F2 D2 F2 D F2 R2 D U B2 L2 U R' F2 L2 B R' D2 F2 
// D' F' R2 D' B2 U R2 D2 B2 F2 U' R D' L U' B R' B' L2 
// U L2 F' D2 R2 F2 D2 L2 U2 F' D2 L2 D' L' R D2 F' R B' D' 
// U R' L' U L2 F R U L U2 L2 F L2 U2 L2 F2 U2 D2 F' R2 
// U' D R F' U F' L R2 D B2 U B2 D F2 L2 B2 U' L2 D2 F' D2 
// D' R D2 L' B2 L B2 R' D2 L2 F2 D2 L' U' B U' L2 F D' F R 
// F2 B2 L' B L U' F U R U2 F2 B2 U2 L U2 L2 D2 L' F2 B2 
// L2 B' L2 R2 F' D2 F' R2 F U2 F2 R F R2 U' R B' D2 L' U' 
// U2 L B L2 B D' B' U' B2 R U2 B2 L2 U2 L D2 F2 R' U2 L F 
// D2 L2 R2 F' L2 B2 L2 D2 B2 F U L' R2 F' U F2 L R' U2 B 
// U R2 U' L2 D' R2 D B2 L2 B2 U' R' B' U B2 R2 U L' B' F' 
// B U' L2 F2 U2 L2 U2 R' F2 U2 F2 U2 F2 R U' F L' F' R' D F2 
// U2 B2 L2 D' B2 R2 D R2 U L2 U2 B L D' F R F U B L2 U2 
// R2 D F2 R2 U2 F L2 D2 B' D2 U2 B' L2 F D' R' B2 D' L2 R U 
// F L D' L D B' U B2 R B2 L2 B2 U' D2 L2 U' D2 B2 
// L' B2 D' B2 R2 F2 U R2 B2 R2 U R2 U F' U L' F D R D2 R 
// F R L D' R L U F U R2 B2 D2 F2 L2 D B2 U F2 B2 D R 
// U L B D2 R2 B' D2 F U2 R2 D2 L2 F R D2 U' L2 R' B' R' 
// U2 F2 R2 D2 B2 U2 F2 L2 U' R F' L' F' R' F U' B U2 R' 
// `.split("\n").filter(m => m).map(thing => parseNotation(thing))

// console.time('eocross')
// scrambles.slice(100).forEach((scramble) => {
//   solve(scramble, "EOCross", [], 5)
// })
// console.timeEnd('eocross')

// const allAngles: Array<Array<CubeRotation>> = [
//   [],
//   ["y"],
//   ["x"],
//   ["x", "y"],
//   ["x'"],
//   ["x'", "y"],
//   ["x2"],
//   ["x2", "y"],
//   ["z"],
//   ["z", "y"],
//   ["z'"],
//   ["z'", "y"]
// ]

// const scramble = parseNotation("D' R2 U2 B L2 F2 R' B L2 D L2 U' B2 L2 U2 L2 D' F2 D R2 B'")

// allAngles.forEach(angle => {
//   console.log(angle)
//   console.log(solve(scramble, "EOCross", angle, 1)[0].join(" "));
// })

// const scramble: MoveSeq = ["U2","R"]
// allAngles.forEach(angle => {
//   console.log(angle)
//   console.log(solve(scramble, "EOCross", angle, 1)[0].join(" "));
// })

// const allCrossAngles: Array<Array<CubeRotation>> = [
//   [],
//   ["x"],
//   // ["x'"],
//   ["x2"],
//   // ["z"],
//   // ["z'"],
// ]

// const cnMovecount = (scram: MoveSeq) => {
//   const solutions = allCrossAngles.map(angle => {
//     return solve(scram, "Cross", angle, 1)[0]
//   })
//   const movecounts = solutions.map(solution => solution.length)
//   const bestMovecount = Math.min(...movecounts)
//   return bestMovecount
// }

// const fixedMovecount = (scram: MoveSeq) => {
//   const solutions = solve(scram, "Cross", [], 1)
//   return solutions[0].length
// }

// const cnMovecounts = scrambles.map(cnMovecount)
// const fixedMovecounts = scrambles.map(fixedMovecount)
// console.log(cnMovecounts.join("\n") + "\n")
// console.log(fixedMovecounts.join("\n") + "\n")

// let cnTotalMovecount = 0
// let fixedTotalMovecount = 0 

// scrambles.forEach(scram => {
//   cnTotalMovecount += cnMovecount(scram)
//   fixedTotalMovecount += fixedMovecount(scram)
// })

// const cnAvgMovecount = cnTotalMovecount / scrambles.length
// const fixedAvgMovecount = fixedTotalMovecount / scrambles.length


// console.log({ cnAvgMovecount, fixedAvgMovecount })
// console.log((fixedTotalMovecount - cnTotalMovecount) / fixedTotalMovecount)

// const scram = parseNotation("U' L2 B' U2 F2 U2 R2 D2 F U2 B F2 L' F D2 B R B' U' B'")
// solve(scram, "EOCross").forEach(sol => console.log(sol.join(" ")))

const example: MoveSeq = ["R", "U", "R'", "L", "R"]
const [thirdLast, secondLast, last] = example.slice(-3)
console.log(thirdLast, secondLast, last)

export default function SecretTestPage() {
  const [mode, setScrambleMode] = useState<ScrambleMode>("random")
  const [nFlip, setNFlip] = useState(4)
  const { scramble, solutions, getNext } = useScrambleAndSolutions("EOCross", mode, nFlip)
  const scrambleString = moveSeqToString(scramble)

  const toggleMode = () => {
    setScrambleMode(mode === "random" ? "nFlip" : "random")
  }
  return (
    <>
      <p>{APP_VERSION}</p>
      <p>{scrambleString}</p>
      <p>Solutions:</p>
      {solutions.map((solution) => {
        const solutionString = moveSeqToString(solution)
        return (
          <p key={solutionString}>{solutionString}</p>
        )
      })}
      <Button onClick={getNext}>Click me!</Button>
      <Button onClick={toggleMode}>Switch mode, currently {mode}</Button>
      <SelectNFlip nFlip={nFlip} onSelectNFlip={(n) => setNFlip(n)} />
    </>
  )
}
