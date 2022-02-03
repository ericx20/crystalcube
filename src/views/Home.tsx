import * as React from "react"
import { Button, Heading, Text } from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"
export const Home = () => (
    <>
        <Heading textAlign={"center"}>home</Heading>
        <Text>
            crystalcube is a collection of next-generation online cubing tools
        </Text>
        <Text>
            err0r is actively developing it
        </Text>
        <RouterLink to="tools/ohscramble/">
            <Button>Go to OH scrambler</Button>
        </RouterLink>
    </>
)