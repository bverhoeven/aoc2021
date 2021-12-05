import { getInputAsLines } from '../shared/input'
import { NumberGrid } from '../shared/grid'

const regex = /^(?<x1>\d+),(?<y1>\d+) -> (?<x2>\d+),(?<y2>\d+)/

class Segment {
    readonly x1: number
    readonly y1: number
    readonly x2: number
    readonly y2: number

    constructor(input: string) {
        const coordinates = regex.exec(input)?.groups
        if (!coordinates) {
            throw new Error(`Bad input: ${input}`)
        }

        this.x1 = Number(coordinates.x1)
        this.y1 = Number(coordinates.y1)
        this.x2 = Number(coordinates.x2)
        this.y2 = Number(coordinates.y2)
    }

    get isHorizontal() {
        return this.x1 == this.x2
    }

    get isVertical() {
        return this.y1 == this.y2
    }

    get isHorizontalOrVertical() {
        return this.isHorizontal || this.isVertical
    }

    get isDiagonal() {
        return !(this.isHorizontal || this.isVertical)
    }
}

function processRegularSegments(grid: NumberGrid, segments: Segment[]) {
    segments
        .filter((segment) => segment.isHorizontalOrVertical)
        .forEach(({ x1, y1, x2, y2 }) => {
            for (let x = Math.min(x1, x2); x < Math.max(x1, x2) + 1; x += 1) {
                for (let y = Math.min(y1, y2); y < Math.max(y1, y2) + 1; y += 1) {
                    grid.increment(x, y)
                }
            }
        })
}

function processDiagonalSegments(grid: NumberGrid, segments: Segment[]) {
    segments
        .filter((segment) => segment.isDiagonal)
        .forEach(({ x1, y1, x2, y2 }) => {
            for (let i = 0; i < Math.max(x1, x2) - Math.min(x1, x2) + 1; i++) {
                const x = x1 + (x1 < x2 ? i : i * -1)
                const y = y1 + (y1 < y2 ? i : i * -1)

                grid.increment(x, y)
            }
        })
}

const segments = getInputAsLines().map((line) => new Segment(line))
const grid = new NumberGrid()

processRegularSegments(grid, segments)
console.log(
    'Part one:',
    grid.count((count) => count >= 2)
)

processDiagonalSegments(grid, segments)
console.log(
    'Part two:',
    grid.count((count) => count >= 2)
)
