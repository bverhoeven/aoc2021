import { getInputAsLines } from '../shared/input'

function getPartOne(lines: string[]) {
    let horizontal = 0
    let depth = 0

    lines.forEach((line) => {
        const [direction, count] = line.split(' ', 2)
        switch (direction) {
            case 'forward':
                horizontal += Number(count)
                break
            case 'up':
                depth -= Number(count)
                break
            case 'down':
                depth += Number(count)
                break
        }
    })

    return horizontal * depth
}

function getPartTwo(lines: string[]) {
    let horizontal = 0
    let depth = 0
    let aim = 0

    lines.forEach((line) => {
        const [direction, count] = line.split(' ', 2)
        switch (direction) {
            case 'forward':
                horizontal += Number(count)
                depth += Number(count) * aim
                break
            case 'up':
                aim -= Number(count)
                break
            case 'down':
                aim += Number(count)
                break
        }
    })

    return horizontal * depth
}

const input = getInputAsLines()

console.log('Part one:', getPartOne(input))
console.log('Part two:', getPartTwo(input))
