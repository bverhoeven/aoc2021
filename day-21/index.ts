import { getInputAsLines, getTestInput, getTestInputAsLines } from '../shared/input'
import { max } from '../shared/reducers'

type PlayerIndex = 0 | 1

class Player {
    constructor(public position: number, public score = 0) {}

    static parse(input: string) {
        const match = /Player \d starting position: (\d+)/.exec(input)?.slice(1)?.map(Number)
        if (!match) {
            throw new Error(`Invalid player: ${input}`)
        }

        return new Player(match[0])
    }

    moveForward(steps: number) {
        this.position = ((this.position + steps - 1) % 10) + 1
        this.score += this.position
    }

    clone(): Player {
        return new Player(this.position, this.score)
    }

    get cacheData() {
        return [this.position, this.score].join()
    }
}

class DeterministicDice {
    public rolls = 0
    private value = 1

    constructor(readonly sides = 100) {}

    roll() {
        this.rolls++
        return ((this.value++ - 1) % this.sides) + 1
    }

    rollAndAdd(rolls = 1) {
        let result = 0
        for (let i = 0; i < rolls; i++) {
            result += this.roll()
        }

        return result
    }
}

function countWinningUniverses(
    players: Player[],
    playerIndex: PlayerIndex = 0,
    cache = new Map<string, number[]>()
): number[] {
    const cacheKey = [playerIndex, ...players.map((p) => p.cacheData)].join()
    const wins = cache.get(cacheKey) ?? [0, 0]

    players.forEach(({ score }, index) => {
        if (score >= 21) {
            wins[index]++
        }
    })

    if (wins.some(Boolean)) {
        return wins
    }

    const dimensionsByRoll = [
        [3, 1],
        [4, 3],
        [5, 6],
        [6, 7],
        [7, 6],
        [8, 3],
        [9, 1],
    ]

    for (const [roll, dimensions] of dimensionsByRoll) {
        countWinningUniverses(
            players
                .map((player) => player.clone())
                .map((player, index) => {
                    if (index === playerIndex) {
                        player.moveForward(roll)
                    }

                    return player
                }),
            playerIndex === 1 ? 0 : 1,
            cache
        ).forEach((count, index) => (wins[index] += dimensions * count))
    }

    cache.set(cacheKey, wins)
    return wins
}

const input = getInputAsLines()

function getPartOne(input: string[]) {
    const players = input.map(Player.parse)
    const dice = new DeterministicDice()

    const otherPlayer = () => (playerIndex == 1 ? 0 : 1)

    let playerIndex = 1
    while (players[playerIndex].score < 1000) {
        playerIndex = otherPlayer()
        players[playerIndex].moveForward(dice.rollAndAdd(3))
    }

    return players[otherPlayer()].score * dice.rolls
}

function getPartTwo(input: string[]) {
    return countWinningUniverses(input.map(Player.parse)).reduce(max)
}

console.log('Part one:', getPartOne(input))
console.log('Part two:', getPartTwo(input))
