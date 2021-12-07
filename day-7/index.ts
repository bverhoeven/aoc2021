import { getInput } from '../shared/input'
import { numericSort } from '../shared/sorting'

function getPartOne(crabs: number[]) {
    const targetPosition = crabs[crabs.length / 2]
    return crabs.reduce((fuel, position) => fuel + Math.abs(position - targetPosition), 0)
}

function getPartTwo(crabs: number[]) {
    return crabs.reduce((cheapest, _, index) => {
        const costs = crabs.reduce((total, position) => {
            const distance = Math.abs(position - index)
            return total + (distance * (distance + 1)) / 2
        }, 0)

        return cheapest > costs ? costs : cheapest
    }, Infinity)
}

const input = getInput().split(',').map(Number).sort(numericSort)

console.log('Part one:', getPartOne(input))
console.log('Part two:', getPartTwo(input))
