import { Grid } from '../shared/grid'
import { getInput } from '../shared/input'

const grid = new Grid<boolean>()

function applyFoldInstruction(foldInstruction: string) {
    const [direction, val] = foldInstruction.split('=')
    const value = Number(val)

    if (direction.endsWith('x')) {
        for (let row = 0; row < grid.height; row++) {
            for (let col = value; col < grid.width; col++) {
                if (grid.get(row, col)) {
                    grid.set(row, col, false)
                    grid.set(row, value - (col - value), true)
                }
            }
        }

        grid.width = Math.ceil(grid.width / 2)
    } else {
        for (let row = value; row < grid.height; row++) {
            for (let col = 0; col < grid.width; col++) {
                if (grid.get(row, col)) {
                    grid.set(row, col, false)
                    grid.set(value - (row - value), col, true)
                }
            }
        }

        grid.height = Math.ceil(grid.height / 2)
    }
}

const input = getInput()

const [coordinateText, instructionText] = input.split('\n\n')
coordinateText
    .split('\n')
    .map((line) => line.split(',').map(Number))
    .map(([y, x]) => grid.set(x, y, true))

const foldInstructions = instructionText.split('\n')

applyFoldInstruction(foldInstructions[0])
console.log(
    'Part one:',
    grid.count(({ value }) => value)
)

foldInstructions.slice(1).forEach(applyFoldInstruction)

console.log('Part two:\n')
console.log(grid.toString(({ value }) => (value ? '#' : ' ')))
