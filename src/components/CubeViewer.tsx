import { ExperimentalStickering, PuzzleID } from "cubing/twisty"
import { TwistyPlayer } from "../components/TwistyPlayer"
import { Alg } from "cubing/alg"
import { Image } from "@chakra-ui/react"

interface CubeViewerProps {
  puzzle?: PuzzleID;
  alg?: string | Alg
  isSetup?: boolean
  mode: "2D" | "3D" | "experimental-2D-LL"
  stickering?: ExperimentalStickering | "image"
  imageUrl?: string
}

export default function CubeViewer({ puzzle, alg, isSetup, mode, stickering, imageUrl }: CubeViewerProps) {
  if (stickering === "image") {
    return <Image boxSize="120px" objectFit='cover' src={imageUrl}/>
  }
  return <TwistyPlayer
    puzzle={puzzle ?? "3x3x3"}
    alg={alg ?? ""}
    experimentalSetupAnchor={isSetup ? "end" : "start"}
    visualization={mode}
    background="none"
    controlPanel="none"
    experimentalStickering={stickering ?? "full"}
  />
}
