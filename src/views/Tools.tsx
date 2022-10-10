import {
    Routes,
    Route
} from "react-router-dom"
import { Heading } from "@chakra-ui/react"
import { EOCross } from "../components/EOCross"
import { OHScramble } from "../components/OHScramble"

// TODO: remove this?
export const Tools = () => (
    <>
        {/* <Heading textAlign={"center"}>tools</Heading> */}
        {/* TODO: have a list of tools here */}
        <Routes>
            <Route path="/" element={<Heading textAlign={"center"}>tools</Heading>} />
            <Route path="eocross" element={<EOCross />} />
            <Route path="ohscramble" element={<OHScramble />} />
        </Routes>
    </>
)