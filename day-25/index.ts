import { getInputAsLines, getTestInputAsLines } from '../shared/input'

enum OceanTile {
    Empty = '.',
    East = '>',
    South = 'v',
}

function solve(input: string[]) {
    let tiles = input.map((line) => line.split('') as OceanTile[])
    let target = tiles.map(() => [] as OceanTile[])
    let moving = true

    let steps = 0
    while (moving) {
        moving = false
        target = tiles.map(() => [])

        for (let row = 0; row < tiles.length; row++) {
            for (let col = 0; col < tiles[row].length; col++) {
                if (target[row][col]) {
                    continue
                }

                const next = (col + 1) % tiles[row].length
                if (tiles[row][col] === OceanTile.East && tiles[row][next] === OceanTile.Empty) {
                    target[row][col] = OceanTile.Empty
                    target[row][next] = OceanTile.East
                    moving = true
                } else {
                    target[row][col] = tiles[row][col]
                }
            }
        }

        tiles = target
        target = tiles.map(() => [])

        for (let row = 0; row < tiles.length; row++) {
            for (let col = 0; col < tiles[row].length; col++) {
                if (target[row][col]) {
                    continue
                }

                const next = (row + 1) % tiles.length
                if (tiles[row][col] === OceanTile.South && tiles[next][col] === OceanTile.Empty) {
                    target[row][col] = OceanTile.Empty
                    target[next][col] = OceanTile.South
                    moving = true
                } else {
                    target[row][col] = tiles[row][col]
                }
            }
        }

        tiles = target
        steps++
    }

    return steps
}

console.log('Part one:', solve(getInputAsLines()))
console.log('Part two:', 'n/a')
