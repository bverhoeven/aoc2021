import { Grid } from '../shared/grid'
import { getInputAsLines } from '../shared/input'

function createGrid(input: string[]) {
    const grid = new Grid<number>()
    input.forEach((line, row) =>
        line.split('').forEach((value, column) => grid.set(row, column, Number(value)))
    )
    return grid
}

function step(grid: Grid<number>) {
    for (const cell of grid.populatedCells()) {
        cell.value++
    }

    let flashedCells = grid.filter((cell) => cell.value > 9)
    let flashingCells = flashedCells
    while (flashingCells.length) {
        flashingCells.forEach((cell) => {
            cell.value = 0
            cell.getNeighbors(true).forEach((neighbor) => {
                neighbor.value++
            })
        })

        flashingCells = grid.filter((cell) => cell.value > 9)
        flashedCells = flashedCells.concat(flashingCells)
    }

    flashedCells.forEach((cell) => {
        cell.value = 0
    })

    return flashedCells.length
}

function getPartOne(input: string[]) {
    const grid = createGrid(input)

    let flashes = 0
    for (let i = 0; i < 100; i++) {
        flashes += step(grid)
    }

    return flashes
}

function getPartTwo(input: string[]) {
    const grid = createGrid(input)
    const all = grid.height * grid.width

    let steps = 1
    while (step(grid) != all) {
        steps++
    }

    return steps
}

const input = getInputAsLines()

console.log('Part one:', getPartOne(input))
console.log('Part two:', getPartTwo(input))
