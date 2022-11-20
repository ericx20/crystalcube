import * as THREE from 'three'
import { useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, RoundedBox, PresentationControls } from "@react-three/drei";
import { FACES } from "src/lib/cubeDefs"
import type { Face, Facelet, FaceletCube, Move, Piece } from "src/lib/cubeDefs"
import { SOLVED_FACELET_CUBE, applyMoves as applyMovesToFacelets } from 'src/lib/cube';

const sune: Array<Move> = ["R", "U", "R'", "U", "R", "U2", "R'"]
const checkerboard: Array<Move> = ["R2", "L2", "U2", "D2", "F2", "B2"]

const colorScheme: { [name in Facelet]: string} = {
  R: "red",
  L: "orange",
  U: "white",
  D: "yellow",
  F: "green",
  B: "blue",
  O: "grey", // display oriented facelet same as masked facelet
  X: "grey",
}

const quarterTurn = Math.PI / 2
const halfTurn = Math.PI

// let U sticker be the "default" sticker position
// other stickers are rotated versions of the U sticker
const stickerRotationMap: { [name in Face]: THREE.Euler } = {
  R: new THREE.Euler( 0, 0, -quarterTurn),
  L: new THREE.Euler( 0, 0, quarterTurn),
  U: new THREE.Euler( 0, 0, 0),
  D: new THREE.Euler(halfTurn, 0, 0),
  F: new THREE.Euler(quarterTurn, 0, 0),
  B: new THREE.Euler(-quarterTurn, 0, 0),
}

const stickerSize = 0.8
const stickerThickness = 0.01

interface StickerProps {
  face: Face,
  facelet: Facelet,
}

function Sticker({ face, facelet }: StickerProps) {
  return (
    <mesh
      rotation={stickerRotationMap[face]}
    >
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[stickerSize, stickerThickness, stickerSize]} />
        <meshBasicMaterial color={colorScheme[facelet]} />
      </mesh>
    </mesh>
  )
}

type Facelets = { [f in Face]?: Facelet }

interface CubieProps {
  facelets: Facelets
}

function Cubie(props: JSX.IntrinsicElements['mesh'] & CubieProps) {
  // const ref = useRef<THREE.Mesh>(null!)
  return (
    <mesh
      {...props}
      // ref={ref}
    >
      {/* Base cubie */}
      <RoundedBox>
        <meshBasicMaterial color="black" />
      </RoundedBox>
      {/* All the stickers */}
      {FACES.flatMap(face => {
        const facelet = props.facelets[face]
        if (facelet) {
          return <Sticker key={face} face={face} facelet={facelet} />
        }
        return []
      })}
    </mesh>
  )
}

// CUBE

// This representation is specific to this EO visualizer
interface CubeState {
  facelets: FaceletCube
  // TODO: make function that applies moves to eo and whatnot
  eo: Array<boolean> // true = good, false = bad, indexed LTR
}

const solvedState: CubeState = {
  facelets: [...SOLVED_FACELET_CUBE],
  eo: Array( 12).fill(true)
}

interface CubieData {
  name: Piece,
  position: [number, number, number]
  facelets: Facelets,
  // TODO: add whether oriented or not
}

export function Cube() {
  const [cubeState, setState] = useState(solvedState)
  const facelets = cubeState.facelets
  const cubies: Array<CubieData> = [
    { name: "DBL", position: [-1, -1, -1], facelets: { D: facelets[51], B: facelets[42], L: facelets[33] } },
    { name: "DL",  position: [-1, -1,  0], facelets: { D: facelets[48], L: facelets[34] } },
    { name: "DFL", position: [-1, -1,  1], facelets: { D: facelets[45], F: facelets[36], L: facelets[35] } },
    { name: "BL",  position: [-1,  0, -1], facelets: { B: facelets[32], L: facelets[21] } },
    { name: "L",   position: [-1,  0,  0], facelets: { L: facelets[22] } },
    { name: "FL",  position: [-1,  0,  1], facelets: { F: facelets[24], L: facelets[23] } },
    { name: "UBL", position: [-1,  1, -1], facelets: { U: facelets[ 0], B: facelets[20], L: facelets[ 9] } },
    { name: "UL",  position: [-1,  1,  0], facelets: { U: facelets[ 3], L: facelets[10] } },
    { name: "UFL", position: [-1,  1,  1], facelets: { U: facelets[ 6], F: facelets[12], L: facelets[11] } },
    { name: "DB",  position: [ 0, -1, -1], facelets: { D: facelets[52], B: facelets[43] } },
    { name: "D",   position: [ 0, -1,  0], facelets: { D: facelets[49] } },
    { name: "DF",  position: [ 0, -1,  1], facelets: { D: facelets[46], F: facelets[37] } },
    { name: "B",   position: [ 0,  0, -1], facelets: { B: facelets[31] } },
    { name: "F",   position: [ 0,  0,  1], facelets: { F: facelets[25] } },
    { name: "UB",  position: [ 0,  1, -1], facelets: { U: facelets[ 1], B: facelets[19] } },
    { name: "U",   position: [ 0,  1,  0], facelets: { U: facelets[ 4] } },
    { name: "UF",  position: [ 0,  1,  1], facelets: { U: facelets[ 7], F: facelets[13] } },
    { name: "DBR", position: [ 1, -1, -1], facelets: { D: facelets[53], B: facelets[42], R: facelets[41] } },
    { name: "DR",  position: [ 1, -1,  0], facelets: { D: facelets[50], R: facelets[40] } },
    { name: "DFR", position: [ 1, -1,  1], facelets: { D: facelets[47], F: facelets[38], R: facelets[39] } },
    { name: "BR",  position: [ 1,  0, -1], facelets: { B: facelets[30], R: facelets[29] } },
    { name: "R",   position: [ 1,  0,  0], facelets: { R: facelets[28] } },
    { name: "FR",  position: [ 1,  0,  1], facelets: { F: facelets[26], R: facelets[27] } },
    { name: "UBR", position: [ 1,  1, -1], facelets: { U: facelets[ 2], B: facelets[18], R: facelets[17] } },
    { name: "UR",  position: [ 1,  1,  0], facelets: { U: facelets[ 5], R: facelets[27]} },
    { name: "UFR", position: [ 1,  1,  1], facelets: { U: facelets[ 8], F: facelets[14], R: facelets[15] } },
  ]
  const handleClick = () => {
    setState({
      ...cubeState,
      facelets: applyMovesToFacelets(cubeState.facelets, checkerboard)
    })
  }
  return (
    <>
      <button onClick={handleClick}>Apply checkerboard</button>
      <Canvas>
        <PresentationControls global rotation={[0, -0.5, 0]} polar={[-Math.PI / 4, Math.PI / 4]} config={{ mass: 0 }}>
          {cubies.map(({ name, position, facelets }) => {
            return <Cubie key={name} position={position} facelets={facelets} />
          })}
        </PresentationControls>
      </Canvas>
    </>
  )
}
