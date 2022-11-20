import * as THREE from 'three'
import { useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, RoundedBox } from "@react-three/drei";

const FACES = ["R", "L", "U", "D", "F", "B"] as const
type Face = typeof FACES[number]
// type Piece = Exclude<`${"U" | "D" | ""}${"F" | "B" | ""}${"R" | "L" | ""}`, "">

// these types should be useful to the solver as well
type Move = `${Face}${"'" | "2" | ""}`
type Alg = Array<Move>

const sune: Alg = ["R", "U", "R'", "U", "R", "U2", "R'"]

const colorScheme: { [key in Face]: string} = {
  R: "red",
  L: "orange",
  U: "white",
  D: "yellow",
  F: "green",
  B: "blue",
}

const quarterTurn = Math.PI / 2
const halfTurn = Math.PI

// let U sticker be the "default" sticker position
// other stickers are rotated versions of the U sticker
const stickerRotationMap: { [key in Face]: THREE.Euler } = {
  R: new THREE.Euler(0, 0, -quarterTurn),
  L: new THREE.Euler(0, 0, quarterTurn),
  U: new THREE.Euler(0, 0, 0),
  D: new THREE.Euler(halfTurn, 0, 0),
  F: new THREE.Euler(quarterTurn, 0, 0),
  B: new THREE.Euler(-quarterTurn, 0, 0),
}

const stickerSize = 0.8
const stickerThickness = 0.01

interface StickerProps {
  face: Face,
  color: string,
}

function Sticker({ face, color }: StickerProps) {
  return (
    <mesh
      rotation={stickerRotationMap[face]}
    >
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[stickerSize, stickerThickness, stickerSize]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </mesh>
  )
}

type Stickers = { [prop in Face]?: string }

interface CubieProps {
  stickers: Stickers
}

function Cubie(props: JSX.IntrinsicElements['mesh'] & CubieProps) {
  // const ref = useRef<THREE.Mesh>(null!)
  return (
    <mesh
      {...props}
      // ref={ref}
      rotation={[0.5, -0.5, 0]}
    >
      {/* Base cubie */}
      <RoundedBox>
        <meshBasicMaterial color="black" />
      </RoundedBox>
      {FACES.flatMap(face => {
        const color = props.stickers[face]
        if (color) {
          return <Sticker key={face} face={face} color={color} />
        }
        return []
      })}
    </mesh>
  )
}



export function Cube() {
  return (
    <Canvas>
      <OrbitControls dampingFactor={0.3} />
      <Cubie position={[0, 0, 0]} stickers={colorScheme} />
    </Canvas>
  )
}
