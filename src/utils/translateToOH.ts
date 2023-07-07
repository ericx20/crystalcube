import { Alg } from "cubing/alg";
// TODO: rewrite this to all be nicer and use the Alg and Move stuff from cubing.js
// take inspiration from 5cuber

// this maps any outer block move => corresponding replacement
const moveMap = new Map();

// this maps any wide move => rotation
const rotationMap = new Map();

const outerMoves        = ["R", "R'", "R2", "L", "L'", "L2", "U", "U'", "U2", "D", "D'", "D2", "F", "F'", "F2", "B", "B'", "B2"];
const wideMoves         = ["Lw", "Lw'", "Lw2", "Rw", "Rw'", "Rw2", "Dw", "Dw'", "Dw2", "Uw", "Uw'", "Uw2", "Bw", "Bw'", "Bw2", "Fw", "Fw'", "Fw2"];
const wideMoveRotations = ["x", "x'", "x2", "x'", "x", "x2", "y", "y'", "y2", "y'", "y", "y2", "z", "z'", "z2", "z'", "z", "z2"]

// these map any layer => layer after rotation applied
// TODO: rotateMap is a really bad name change it pls
const rotateMapX = new Map([["R", "R"], ["L", "L"], ["U", "B"], ["D", "F"], ["F", "U"], ["B", "D"]]);
const rotateMapY = new Map([["R", "F"], ["L", "B"], ["U", "U"], ["D", "D"], ["F", "L"], ["B", "R"]]);
const rotateMapZ = new Map([["R", "D"], ["L", "U"], ["U", "R"], ["D", "L"], ["F", "F"], ["B", "B"]]);
const rotateMap = new Map([["x", rotateMapX], ["y", rotateMapY], ["z", rotateMapZ]]);


// hardcoded for now, replace later by checking UI
const leftyMovesToReplace = [false, false, false, true, true, true, false, false, false, true, true, true, false, false, false, true, true, true]
const rightyMovesToReplace = [true, true, true, false, false, false, false, false, false, true, true, true, false, false, false, true, true, true]

// const isWide = (move: string) => {
//     return (move.includes("w"));
// };

// sequence is array of strings, rotation is a string like x and y2
const rotate = (sequence: string[], rotation: string) => {
    // console.log("Rotate", sequence.join(" "), "by", rotation);
    let rotated = sequence.map((move) => {
        let layer = move[0];
        // rotate the layer multiple times e.g. x' = x x x, x2 = x x
        let repeat = rotation.includes("'") ? 3 : (rotation.includes("2") ? 2 : 1);
        for (let i=0; i<repeat; i++) {
            layer = rotateMap.get(rotation[0])!.get(layer)!;

        }
        // then replace the layer of the original move with the new translated layer
        move = layer + move.substring(1);
        return move;
    });
    // console.log("Result:", rotated.join(" "));
    return rotated;
};

// assume sequenceString only contains outer block moves
const massCubeTrans = (sequenceString: string, movesToReplace: boolean[], lowercaseWide: boolean) => {
    // initialize the maps
    for (let i=0; i<18; i++) {
        // moveMap
        let key1 = outerMoves[i];
        let value1 = movesToReplace[i] ? wideMoves[i] : outerMoves[i];
        moveMap.set(key1, value1);

        // rotationMap
        let key2 = wideMoves[i];
        let value2 = wideMoveRotations[i];
        rotationMap.set(key2, value2);
    }
    let sequence = sequenceString.split(" ");

    // iterate thru every move in the sequence
    for (let i=0; i<sequence.length; i++) {
        let currMove = sequence[i];

        // console.log("current move:", currMove);
        // does currMove need to be replaced? check if it's remapped
        if (currMove !== moveMap.get(currMove)) {
            
            // break sequence into three parts:
            // 1. everything before currMove (preserve it)
            // 2. the translated currMove
            // 3. the rest of the sequence affected by rotated currMove
            
            let beforeCurrMove = sequence.slice(0, i);
            let rotatedCurrMove = moveMap.get(currMove);
            let afterCurrMove = sequence.slice(i+1, sequence.length);

            // console.log("replacing", currMove, "with:", rotatedCurrMove);

            // this may be undefined
            let rotationToApply = rotationMap.get(rotatedCurrMove)/* + currMove.substring(1)*/;
            if (rotationToApply) {
                // need to invert the rotation
                if (rotationToApply.includes("'")) {
                    rotationToApply = rotationToApply[0];
                } else if (!rotationToApply.includes("2")) {
                    rotationToApply = rotationToApply[0] + "'";
                }
                afterCurrMove = rotate(afterCurrMove, rotationToApply)
            }

            // rotate second part
            sequence = [...beforeCurrMove, rotatedCurrMove, ...afterCurrMove];
        }
        // console.log("so far:", sequence.join(" "));
        // console.log(" ");
    }
    if (lowercaseWide) {
        sequence = sequence.map((move) => {
            if (move.includes("w")) {
                return move[0].toLowerCase() + move.replace("w", "").substring(1)
            }
            return move
        })
    }
    return sequence.join(" ");
};

/**
 * @deprecated
 */
export const translateToOH = (alg: Alg, isLefty: boolean, lowercaseWide: boolean) => {
    if (!alg.toString()) return new Alg("")
    const movesToReplace = isLefty ? leftyMovesToReplace : rightyMovesToReplace
    return new Alg(massCubeTrans(alg.toString(), movesToReplace, lowercaseWide))
}