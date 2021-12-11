import { getInputAsLines } from '../shared/input'
import { sum } from '../shared/reducers'

class SegmentEntry {
    readonly inputs: string[]
    readonly outputs: string[]

    constructor(line: string) {
        const [inputs, outputs] = line.split(' | ').map((part) => part.split(' '))
        function sort(str: string) {
            return str.split('').sort().join('')
        }

        this.inputs = inputs.map(sort)
        this.outputs = outputs.map(sort)
    }
}

function countSimilarities(a: string, b: string): number {
    return a.split('').reduce((sum, c) => sum + (b.includes(c) ? 1 : 0), 0)
}

function getPartOne(entries: SegmentEntry[]) {
    //  1:       4:       7:       8:
    //  2 seg    4 seg    3 seg    7 seg
    //
    //   ....     ....     1111     1111
    //  .    1   1    2   .    2   2    3
    //  .    1   1    2   .    2   2    3
    //   ....     3333     ....     4444
    //  .    2   .    4   .    3   5    6
    //  .    2   .    4   .    3   5    6
    //   ....     ....     ....     7777

    return entries
        .map((entry) => entry.outputs.filter(({ length }) => [2, 4, 3, 7].includes(length)).length)
        .reduce(sum)
}

function getPartTwo(entries: SegmentEntry[]) {
    let total = 0
    for (const entry of entries) {
        // Each entry is completely shuffled, but does contain a representation
        // for each possible digit.

        // We know from part one that if we find an input with 2 segments that
        // it must be trying to represent the number 1, and by doing so, we know
        // what two vertical lines to the right (the representation of "1")
        // looks like.

        // We do the same for the number 4, as we can use it to both determine
        // the more complex numbers:
        //
        // Five segments:
        // - 2 shares two segments with 4.
        // - 3 includes all the segments of 1.
        //
        // Six segments:
        // - 0 includes all the segments of 1.
        // - 9 includes all the segments of 4.

        const one = entry.inputs.find(({ length }) => length === 2)
        const four = entry.inputs.find(({ length }) => length === 4)
        if (!one || !four) {
            throw new Error('Incomplete input')
        }

        let value = 0
        for (const output of entry.outputs) {
            value *= 10
            switch (output.length) {
                // Get the easy ones out of the way, based on the number of
                // segments in the output signal.

                // We know, from part one, that a length of 2 means that it's
                // trying to display "1", a length of 3 means that it's trying
                // to display a "7", etc.

                case 2:
                    value += 1
                    break
                case 3:
                    value += 7
                    break
                case 4:
                    value += 4
                    break
                case 7:
                    value += 8
                    break

                case 5:
                    // Numbers with 5 segments:
                    //
                    //  ####    ####    ####
                    // .    #  .    #  #    .
                    // .    #  .    #  #    .
                    //  ####    ####    ####
                    // #    .  .    #  .    #
                    // #    .  .    #  .    #
                    //  ####    ####    ####

                    if (countSimilarities(output, one) === 2) {
                        //  ####    ....
                        // .    1  .    #
                        // .    1  .    #
                        //  ####    ....
                        // .    2  .    #
                        // .    2  .    #
                        //  ####    ....

                        value += 3
                    } else if (countSimilarities(output, four) === 2) {
                        //  ####    ....
                        // .    1  #    #
                        // .    1  #    #
                        //  2222    ####
                        // #    .  .    #
                        // #    .  .    #
                        //  ####    ....

                        value += 2
                    } else {
                        value += 5
                    }
                    break

                case 6:
                    // Numbers with 6 segments:
                    //
                    //  ####    ####    ####
                    // #    #  #    #  #    .
                    // #    #  #    #  #    .
                    //  ....    ####    ####
                    // #    #  .    #  #    #
                    // #    #  .    #  #    #
                    //  ####    ####    ####

                    if (countSimilarities(output, four) === 4) {
                        //  ####    ....
                        // 1    2  #    #
                        // 1    2  #    #
                        //  3333    ####
                        // .    4  .    #
                        // .    4  .    #
                        //  ####    ....

                        value += 9
                    } else if (countSimilarities(output, one) === 2) {
                        //  ####    ....
                        // #    1  .    #
                        // #    1  .    #
                        //  ....    ....
                        // #    2  .    #
                        // #    2  .    #
                        //  ####    ....

                        value += 0
                    } else {
                        value += 6
                    }
                    break
                default:
                    throw new Error(`Invalid output value: ${output} ${output.length}`)
            }
        }

        total += value
    }

    return total
}

const input = getInputAsLines()
const entries = input.map((line) => new SegmentEntry(line))
console.log('Part one:', getPartOne(entries))
console.log('Part two:', getPartTwo(entries))
