/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getInput, getTestInput } from '../shared/input'
import { strict as assert } from 'assert'

function solve(input: string, largest = true) {
    const results: number[] = Array(14)
    const stack: [number, number][] = []

    input
        .split('\ninp w')
        .map((program) => program.split('\n'))
        .forEach((lines, programIndex) => {
            assert(lines.length === 18)

            const xAdd = Number(lines[5].split(' ')[2])
            const yAdd = Number(lines[15].split(' ')[2])
            if (xAdd > 0) {
                // push
                assert(xAdd >= 10)
                stack.push([programIndex, yAdd])
            } else {
                // pop
                const [lastIndex, prevAdd] = stack.pop()!
                const complement = prevAdd + xAdd
                const value = largest ? Math.min(9, 9 - complement) : Math.max(1, 1 - complement)

                results[lastIndex] = value
                results[programIndex] = value + complement
            }
        })

    return results.join('')
}

const input = getInput()

console.log('Part one:', solve(input))
console.log('Part two:', solve(input, false))
