import { getInputAsLines } from '../shared/input'

function getIncrements(numbers: number[]) {
    let increments = 0

    numbers.reduce((previous, current) => {
        if (current > previous) {
            increments++
        }

        return current
    }, Number.NaN)

    return increments
}

const depths = getInputAsLines().map(Number)

const partOne = getIncrements(depths)
const partTwo = getIncrements(
    depths.slice(0, -2).map((depth, index) => depth + depths[index + 1] + depths[index + 2])
)

console.log('Part one:', partOne)
console.log('Part two:', partTwo)
