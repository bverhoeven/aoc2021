import { getInput, getInputAsLines, getTestInput, getTestInputAsLines } from '../shared/input'

class Instruction {
    readonly from: string
    readonly to: string

    constructor(line: string) {
        const [from, to] = line.split(' -> ')
        this.from = from
        this.to = to
    }
}

function incrementKey(object: Record<string, number>, key: string, increment = 1): void {
    object[key] = (object[key] || 0) + increment
}

function countCharacters(str: string) {
    return str
        .split('')
        .reduce((count: Record<string, number>, c) => ({ ...count, [c]: (count[c] ?? 0) + 1 }), {})
}

function getPolymerDifference(input: string, steps: number) {
    const [template, lines] = input.split('\n\n')
    const instructions = lines.split('\n').map((line) => new Instruction(line))

    let pairs: Record<string, number> = {}

    const counts: Record<string, number> = countCharacters(template)
    for (let i = 0; i < template.length - 1; i++) {
        pairs[template.substr(i, 2)] = 1
    }

    for (let step = 0; step < steps; step++) {
        const next: Record<string, number> = {}

        for (const [pair, count] of Object.entries(pairs)) {
            const to = instructions.find((ins) => ins.from === pair)?.to
            if (to) {
                incrementKey(counts, to, count)
                incrementKey(next, pair[0] + to, count)
                incrementKey(next, to + pair[1], count)
            }
        }

        pairs = next
    }

    return Math.max(...Object.values(counts)) - Math.min(...Object.values(counts))
}

console.log('Part one:', getPolymerDifference(getInput(), 10))
console.log('Part two:', getPolymerDifference(getInput(), 40))
