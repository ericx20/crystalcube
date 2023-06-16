import { Cube3x3 } from "src/libv2"

const cube = new Cube3x3();
cube.print().applyMoves(["R"]).print();


export default function TestPage() {
    return (
        <p>hello it's test page</p>
    )
}
