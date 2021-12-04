import { readFileSync } from 'node:fs'

export function getInput(filename = 'input.txt'): string {
    return readFileSync(filename, 'utf8').trim()
}

export function getInputAsLines(filename = 'input.txt'): string[] {
    return getInput(filename).split('\n')
}

export function getTestInput(filename = 'test_input.txt'): string {
    return getInput(filename)
}

export function getTestInputAsLines(filename = 'test_input.txt'): string[] {
    return getInputAsLines(filename)
}
