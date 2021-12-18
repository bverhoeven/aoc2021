import { getInputAsLines, getTestInputAsLines } from '../shared/input'

function makePair(left: string | number, right: string | number) {
    return `[${left},${right}]`
}

function reducePair(left: string, right: string) {
    let str = makePair(left, right)

    let done = false
    while (!done) {
        const previous = str
        if ((str = explode(str)) !== previous) {
            continue
        }

        if ((str = split(str)) !== previous) {
            continue
        }

        done = true
    }

    return str
}

function explode(str: string) {
    let depth = 0
    for (let i = 0; i < str.length; i++) {
        const slice = str.slice(i)
        if (slice.startsWith('[')) {
            depth++
        } else if (slice.startsWith(']')) {
            depth--
        } else if (depth > 4) {
            const pair = slice.match(/^(\d+),(\d+)/)
            if (!pair) {
                throw new Error(`Invalid pair at ${slice}`)
            }

            const pairLength = pair[0].length
            const [leftValue, rightValue] = pair.slice(1).map(Number)

            const left = str
                .slice(0, i - 1)
                .replace(/(\d+)(\D+)$/, (_, val, rest) => `${leftValue + Number(val)}${rest}`)

            const right = str
                .slice(i + pairLength + 1)
                .replace(/(\d+)/, (val) => `${rightValue + Number(val)}`)

            return `${left}0${right}`
        }
    }

    return str
}

function split(str: string): string {
    return str.replace(/(\d\d+)/, (val) =>
        makePair(Math.floor(Number(val) / 2), Math.ceil(Number(val) / 2))
    )
}

function getMagnitude(target: string | number | number[]): number {
    if (typeof target === 'string') {
        target = JSON.parse(target) as number[]
    }

    if (!Array.isArray(target)) {
        return target
    }

    return 3 * getMagnitude(target[0]) + 2 * getMagnitude(target[1])
}

function getPartOne(input: string[]) {
    const sum = input.reduce(reducePair)
    console.log(`Final sum: ${sum}\n`)
    return getMagnitude(sum)
}

function getPartTwo(input: string[]) {
    let max = 0
    for (let x = 0; x < input.length; x++) {
        for (let y = x; y < input.length; y++) {
            max = Math.max(
                max,
                getMagnitude(reducePair(input[x], input[y])),
                getMagnitude(reducePair(input[y], input[x]))
            )
        }
    }

    return max
}

const input = getInputAsLines()

console.log('Part one:', getPartOne(input))
console.log('Part two:', getPartTwo(input))
