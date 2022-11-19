// import * as THREE from 'three'
// import * as React from "react"
// import { Canvas, useFrame } from '@react-three/fiber'

// export const Cube = () => {
//   const ref = React.useRef<THREE.Mesh>(null!)
//   // useFrame((state, delta) => (ref.current.rotation.x += 0.01))
//   return (
//     <div id="canvas-container">
//       <Canvas>
//         <ambientLight intensity={0.1} />
//         <directionalLight position={[0, 0, 5]} />
//         <mesh ref={ref}>
//           <boxGeometry args={[2, 2, 2]} />
//           <meshStandardMaterial color="#DAC7F1" />
//         </mesh>
//       </Canvas>
//     </div>
//   )
// }

/* eslint-disable */
import * as THREE from 'three'
import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

function Box(props: JSX.IntrinsicElements['mesh']) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame((_state, _delta) => {
    ref.current.rotation.x += 0.01
    ref.current.rotation.y += 0.01
  })

  return (
    <mesh
      {...props}
      ref={ref}
      scale={1}
    >
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#DAC7F1" />
    </mesh>
  )
}

export function Cube() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      {/* <pointLight position={[-10, -10, -10]} /> */}
      <Box position={[0, 0, 0]} />
    </Canvas>
  )
}
