import { getInputAsLines } from '../shared/input'

function getMostCommonBit(input: number[][]): number[] {
    return input
        .reduce((prev, row) => prev.map((sum, column) => sum + row[column]))
        .map((count) => (count >= input.length / 2 ? 1 : 0))
}

function filterRows(input: number[][], keepMostCommon: boolean): number {
    let rows = input
    let column = 0

    // Start with the complete input, then, for each column/column index:

    // Calculate the most common bit and keep only those rows that either have
    // the most common (scrubber) or least common (oxygen) value at that column
    // index.

    // Do this until we only have one winning row left.

    while (rows.length > 1) {
        const commonBits = getMostCommonBit(rows)

        if (keepMostCommon) {
            rows = rows.filter((row) => row[column] === commonBits[column])
        } else {
            rows = rows.filter((row) => row[column] !== commonBits[column])
        }

        column++
    }

    return parseInt(rows[0].join(''), 2)
}

function getPowerConsumption(input: number[][]) {
    const commonBits = getMostCommonBit(input)

    const gamma = commonBits.join('')
    const epsilon = commonBits.map((bit) => (bit == 0 ? 1 : 0)).join('')

    return parseInt(gamma, 2) * parseInt(epsilon, 2)
}

function getLifeSupportRating(input: number[][]) {
    const oxygenRating = filterRows(input, true)
    const scrubberRating = filterRows(input, false)

    return oxygenRating * scrubberRating
}

const lines = getInputAsLines().map((line) => line.split('').map(Number))

const partOne = getPowerConsumption(lines)
const partTwo = getLifeSupportRating(lines)

console.log('Part one:', partOne)
console.log('Part two:', partTwo)
