import * as React from "react";
import { Box, Grid, Heading, HStack, Text } from "@chakra-ui/react";
import { CubeViewer } from "src/components/CubeViewer";
import { AlgSheet, AlgSet, AlgCase, CaseAlg, PuzzleConfig } from "src/types"

export declare interface AlgSheetViewerProps {
    algSheet: AlgSheet;
}

export const AlgSheetViewer = ({ algSheet }: AlgSheetViewerProps) => {
  return (
    <>
        <Heading>{algSheet.name}</Heading>
        <Text>{algSheet.description}</Text>
        {algSheet.algSets.map((algSet) => <AlgSetViewer algSet={algSet} key={algSet.name}/>)}
    </>
  )
}

declare interface AlgSetViewerProps {
    algSet: AlgSet;
}

const AlgSetViewer = ({ algSet }: AlgSetViewerProps) => {
    return (
        <>
            <Heading size="md">{algSet.name}</Heading>
            <Text>{algSet.description}</Text>
            <Grid
                templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                gap={5}
                pt={5}
                px={{ md: 0 }}
            >
                {algSet.cases.map((algCase) => <CaseViewer algCase={algCase} key={algCase.name} />)}

            </Grid>
        </>
    )
}

declare interface CaseViewerProps {
    algCase: AlgCase;
}

const CaseViewer = ({ algCase }: CaseViewerProps) => {
    return (
        <>
            <Heading size="sm">{algCase.name}</Heading>
            {algCase.algs.map((caseAlg) => {
                return <div key={caseAlg.alg}>{caseAlg.alg}</div>
            })}
        </>
    )
}