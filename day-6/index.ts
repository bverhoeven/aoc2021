import { getInput } from '../shared/input'
import { sum } from '../shared/reducers'

function countFishies(fishies: number[], days: number) {
    const ages = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    fishies.forEach((fish) => {
        ages[fish]++
    })

    for (let i = 0; i < days; i++) {
        const first = <number>ages.shift()
        ages[6] += first
        ages[8] = first
    }

    return ages.reduce(sum)
}

const input = getInput().split(',').map(Number)

console.log('Part one:', countFishies(input, 80))
console.log('Part two:', countFishies(input, 256))
