import { getInputAsLines } from '../shared/input'
import { numericSort } from '../shared/sorting'

const symbolPairs: Record<string, string> = {
    '(': ')',
    '[': ']',
    '{': '}',
    '<': '>',
}

const errorScores: Record<string, number> = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137,
}

const completionScores: Record<string, number> = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4,
}

type ParseResult = { errorScore: number; completionScore: number }

function calculateScores(line: string): ParseResult {
    const stack: string[] = []
    let errorScore = 0

    for (const character of line.split('')) {
        if (symbolPairs[character]) {
            stack.push(character)
        } else {
            const previousSymbol = stack.pop()
            if (!previousSymbol) {
                throw new Error(`Invalid input: ${character}, stack is empty.`)
            }

            const expected = symbolPairs[previousSymbol]
            if (character !== expected) {
                errorScore = errorScores[character]
                break
            }
        }
    }

    const completionScore = stack
        .reverse()
        .reduce((score, symbol) => score * 5 + completionScores[symbolPairs[symbol]], 0)

    return { errorScore, completionScore }
}

function getPartOne(lines: string[]): number {
    return lines.map(calculateScores).reduce((score, result) => score + result.errorScore, 0)
}

function getPartTwo(lines: string[]) {
    const incompleteLineScores = lines
        .map(calculateScores)
        .filter((result) => result.errorScore === 0)
        .map((result) => result.completionScore)

    return incompleteLineScores.sort(numericSort)[Math.floor(incompleteLineScores.length / 2)]
}

const input = getInputAsLines()

console.log('Part one:', getPartOne(input))
console.log('Part two:', getPartTwo(input))
