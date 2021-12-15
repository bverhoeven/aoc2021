/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { getInputAsLines, getTestInputAsLines } from '../shared/input'

function getLowestRisk(input: number[][]) {
    const lowest = input.map((row) => row.map(() => Infinity))
    const remaining: [number, number][] = [[0, 0]]

    lowest[0][0] = 0

    while (remaining.length) {
        const [x, y] = remaining.shift()!
        const neighbors: [number, number][] = []
        if (x > 0) {
            neighbors.push([x - 1, y])
        }

        if (x < input.length - 1) {
            neighbors.push([x + 1, y])
        }

        if (y > 0) {
            neighbors.push([x, y - 1])
        }

        if (y < input[0].length - 1) {
            neighbors.push([x, y + 1])
        }

        for (const [nx, ny] of neighbors) {
            const risk = lowest[x][y] + input[nx][ny]!
            if (lowest[nx][ny] > risk) {
                lowest[nx][ny] = risk
                remaining.push([nx, ny])
            }
        }
    }

    return lowest[input.length - 1][input[0].length - 1]
}

function expandArray(grid: number[][]): number[][] {
    const target = Array.from(Array(grid.length * 5), () => new Array(grid[0].length * 5))
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 5; j++) {
                    let risk = grid[row][col] + i + j
                    if (risk > 9) {
                        risk %= 9
                    }

                    target[row + i * grid.length][col + j * grid[0].length] = risk
                }
            }
        }
    }

    return target
}

const input = getInputAsLines()
const risks = input.map((line) => line.split('').map((value) => Number(value)))

console.log('Part one:', getLowestRisk(risks))
console.log('Part two:', getLowestRisk(expandArray(risks)))
