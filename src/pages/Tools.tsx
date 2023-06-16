import { Route, Routes } from "react-router-dom"
import { Heading } from "@chakra-ui/react"
import OHScramble from "./OHScramble"
import TestPage from "./TestPage"

export default function Tools() {
  return (
    <>
      {/* <Heading textAlign={"center"}>tools</Heading> */}
      {/* TODO: have a list of tools here */}
      <Routes>
        <Route path="/" element={<Heading textAlign={"center"}>tools</Heading>} />
        <Route path="ohscramble" element={<OHScramble />} />
        <Route path="testpage" element={<TestPage />} />
      </Routes>
    </>
  )
}
