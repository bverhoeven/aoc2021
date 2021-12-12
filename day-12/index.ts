import { getInputAsLines, getTestInputAsLines } from '../shared/input'

class Graph {
    readonly directPaths: Map<string, string[]> = new Map()

    constructor(lines: string[]) {
        lines.forEach((line) => {
            const [from, to] = line.split('-')
            this.addDirectPath(from, to)
            this.addDirectPath(to, from)
        })
    }

    addDirectPath(from: string, to: string) {
        if (to !== 'start' && from !== 'end') {
            this.directPaths.set(from, [...(this.directPaths.get(from) ?? []), to])
        }
    }

    getDirectPathsFrom(name: string) {
        return this.directPaths.get(name) ?? []
    }
}

function isSmallCave(name: string) {
    return name.toLowerCase() === name
}

function isBigCave(name: string) {
    return name.toUpperCase() === name
}

function getPaths(graph: Graph, part2 = false, current = 'start', visited: string[] = []): number {
    if (current === 'end') {
        return 1
    }

    visited.push(current)

    return graph
        .getDirectPathsFrom(current)
        .filter((next: string) => {
            if (isBigCave(next) || !visited.includes(next)) {
                return true
            }

            if (part2) {
                const smallCaves = visited.filter(isSmallCave)
                return new Set(smallCaves).size === smallCaves.length
            }

            return false
        })
        .reduce((count, next) => count + getPaths(graph, part2, next, [...visited]), 0)
}

const input = getInputAsLines()
const graph = new Graph(input)

console.log('Part one:', getPaths(graph))
console.log('Part two:', getPaths(graph, true))
