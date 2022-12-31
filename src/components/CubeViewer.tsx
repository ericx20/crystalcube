import * as React from "react"
import { ExperimentalStickering, PuzzleID } from "cubing/twisty"
import { TwistyPlayer } from "../components/TwistyPlayer"
import { Alg } from "cubing/alg"
// /** @jsxImportSource @emotion/react */
// import { css } from "@emotion/react"
import { Image } from "@chakra-ui/react"

interface CubeViewerProps {
  puzzle?: PuzzleID;
  alg?: string | Alg
  isSetup?: boolean
  mode: "2D" | "3D" | "experimental-2D-LL"
  stickering?: ExperimentalStickering | "image"
  imageUrl?: string
}

export const CubeViewer = ({ puzzle, alg, isSetup, mode, stickering, imageUrl }: CubeViewerProps) => {
  if (stickering === "image") {
    return <Image boxSize="120px" objectFit='cover' src={imageUrl}/>
  }
  return <TwistyPlayer puzzle={puzzle ?? "3x3x3"} alg={alg ?? ""} experimentalSetupAnchor={isSetup ? "end" : "start"} visualization={mode} background="none" controlPanel="none" experimentalStickering={stickering ?? "full"} />
  // const player = new TwistyPlayer({
  //   puzzle: "3x3x3",
  //   alg,
  //   visualization: mode,
  //   background: "none",
  //   controlPanel: "none",
  //   experimentalStickering: stickering ?? "full",
  // })

  // React.useEffect(() => {
  //   document.getElementById("player")?.appendChild(player)
  //   return () => { document.getElementById("player")?.removeChild(player) }
  // }, [alg])

  // return <div id="player" css={css`
  //   twisty-player {
  //     width: auto;
  //   }
  // `} />
}
