import { getInput } from '../shared/input'

class BingoCell {
    isMarked = false
    constructor(readonly number: number) {}
}

class BingoCard {
    rows: BingoCell[][]

    constructor(cardInput: string) {
        this.rows = cardInput.split('\n').map((row) =>
            row
                .split(' ')
                .filter((num) => num != '')
                .map((num) => new BingoCell(Number(num)))
        )
    }

    play(number: number) {
        for (const row of this.rows) {
            const cell = row.find((cell) => cell.number === number)
            if (cell) {
                cell.isMarked = true
            }
        }
    }

    get hasBingo(): boolean {
        const columns = this.rows[0].map((_, column) => this.rows.map((row) => row[column]))
        return (
            this.rows.some((row) => row.every((cell) => cell.isMarked)) ||
            columns.some((column) => column.every((cell) => cell.isMarked))
        )
    }

    get score(): number {
        const unmarked = this.rows.map((row) =>
            row.filter((cell) => !cell.isMarked).map((cell) => cell.number)
        )

        const sum = (prev: number, current: number) => prev + current
        return unmarked.map((row) => row.reduce(sum, 0)).reduce(sum)
    }
}

function play(cards: BingoCard[], drawn: number[]): number | undefined {
    for (const number of drawn) {
        cards.forEach((card) => card.play(number))

        const winner = cards.find((card) => card.hasBingo)
        if (winner) {
            return number * winner.score
        }
    }
}

function playSquidGame(cards: BingoCard[], drawn: number[]): number | undefined {
    for (const number of drawn) {
        cards.forEach((card) => card.play(number))

        if (cards.length > 1) {
            cards = cards.filter((card) => !card.hasBingo)
        } else if (cards[0].hasBingo) {
            return number * cards[0].score
        }
    }
}

const input = getInput().split('\n\n')
const drawn = input[0].split(',').map(Number)
const cards = input.slice(1).map((card) => new BingoCard(card))

const partOne = play(cards, drawn)
const partTwo = playSquidGame(cards, drawn)

console.log('Part one:', partOne)
console.log('Part two:', partTwo)
