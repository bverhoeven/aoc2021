import { getInputAsLines, getTestInputAsLines } from '../shared/input'

class Instruction {
    constructor(
        readonly on: boolean,
        readonly xRange: number[],
        readonly yRange: number[],
        readonly zRange: number[]
    ) {}

    static parse(input: string) {
        const [minX, maxX, minY, maxY, minZ, maxZ] = [...input.matchAll(/[0-9-]+/g)].map(Number)
        return new Instruction(input.startsWith('on'), [minX, maxX], [minY, maxY], [minZ, maxZ])
    }

    toCube() {
        return new Cube(this.xRange, this.yRange, this.zRange)
    }
}

class Cube {
    constructor(readonly xRange: number[], readonly yRange: number[], readonly zRange: number[]) {}

    get volume() {
        return (
            (this.xRange[1] - this.xRange[0] + 1) *
            (this.yRange[1] - this.yRange[0] + 1) *
            (this.zRange[1] - this.zRange[0] + 1)
        )
    }

    overlaps(other: Cube): boolean {
        const intersect = (a: number[], b: number[]): boolean => a[0] <= b[1] && a[1] >= b[0]
        return (
            intersect(this.xRange, other.xRange) &&
            intersect(this.yRange, other.yRange) &&
            intersect(this.zRange, other.zRange)
        )
    }

    overlap(other: Cube): Cube {
        return new Cube(
            [Math.max(this.xRange[0], other.xRange[0]), Math.min(this.xRange[1], other.xRange[1])],
            [Math.max(this.yRange[0], other.yRange[0]), Math.min(this.yRange[1], other.yRange[1])],
            [Math.max(this.zRange[0], other.zRange[0]), Math.min(this.zRange[1], other.zRange[1])]
        )
    }

    *coordinates() {
        const { xRange, yRange, zRange } = this
        for (let x = xRange[0]; x <= xRange[1]; x++) {
            for (let y = yRange[0]; y <= yRange[1]; y++) {
                for (let z = zRange[0]; z <= zRange[1]; z++) {
                    yield [x, y, z]
                }
            }
        }
    }
}

function solve(input: string[]) {
    const instructions = input.map(Instruction.parse)
    const bounds = new Cube([-50, 50], [-50, 50], [-50, 50])

    const onCubes: Set<string> = new Set<string>()
    const addedCubes: Cube[] = []
    const deletedCubes: Cube[] = []

    for (const instruction of instructions) {
        const current = instruction.toCube()
        if (current.overlaps(bounds)) {
            for (const [x, y, z] of [...current.coordinates()]) {
                const coordinate = [x, y, z].toString()
                if (instruction.on) {
                    onCubes.add(coordinate)
                } else {
                    onCubes.delete(coordinate)
                }
            }
        }

        const overlap = addedCubes
            .filter((cube) => current.overlaps(cube))
            .map((cube) => current.overlap(cube))

        const rewritten = deletedCubes
            .filter((cube) => current.overlaps(cube))
            .map((cube) => current.overlap(cube))

        addedCubes.push(...rewritten)
        deletedCubes.push(...overlap)

        if (instruction.on) {
            addedCubes.push(current)
        }
    }

    const partOne = onCubes.size
    const partTwo =
        addedCubes.reduce((total, { volume }) => total + BigInt(volume), BigInt(0)) +
        deletedCubes.reduce((total, { volume }) => total - BigInt(volume), BigInt(0))

    return { partOne, partTwo }
}

const input = getInputAsLines()
const result = solve(input)

console.log(`Part one: ${result.partOne}`)
console.log(`Part two: ${result.partTwo}`)
