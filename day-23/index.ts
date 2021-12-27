import { getInputAsLines, getTestInputAsLines } from '../shared/input'
import { min } from '../shared/reducers'

type CachedState = {
    leastFromHere: number
    costs: number
}

const NO_OCCUPANT = -1

const previousStateData = new Map<string, CachedState>()
let lowestEnergyCost: number

class GameState {
    static fromInput(input: string[]) {
        const data = input.slice(2, -1).map((row) =>
            row
                .trim()
                .split('#')
                .filter(Boolean)
                .map((cell) => cell.charCodeAt(0) - 65)
        )

        const rooms = []
        for (let i = 0; i < data[0].length; i++) {
            rooms.push(data.map((_, j) => data[j][i]))
        }

        return new GameState(rooms)
    }

    constructor(
        readonly rooms: number[][],
        readonly hallway = new Array(11).fill(NO_OCCUPANT),
        readonly costs = 0
    ) {}

    get isFinished() {
        return this.rooms.every((room, roomId) => room.every((occupant) => occupant === roomId))
    }

    get key() {
        return JSON.stringify([this.rooms, this.hallway])
    }

    *getPossibleHallwayMoves() {
        const { hallway } = this
        for (let i = 0; i < hallway.length; i++) {
            if (hallway[i] === NO_OCCUPANT) {
                continue
            }

            const move = this.tryMovingThroughHallway(i, hallway[i])
            if (move) {
                yield move
            }
        }
    }

    *getPossibleRoomMoves() {
        const { rooms } = this
        for (let i = 0; i < rooms.length; i++) {
            yield* this.getRoomMoves(i)
        }
    }

    private tryMovingThroughHallway(hallwayPos: number, roomId: number) {
        const { rooms, hallway, costs } = this
        if (this.roomHasInvalidOccupants(roomId)) {
            return
        }

        const roomEntryPos = this.getRoomEntryPosition(roomId)
        const path = hallway.slice(
            Math.min(roomEntryPos, hallwayPos + 1),
            Math.max(roomEntryPos, hallwayPos - 1) + 1
        )

        if (path.some((pos) => pos !== NO_OCCUPANT)) {
            return
        }

        const roomPos = rooms[roomId].indexOf(NO_OCCUPANT)
        return new GameState(
            rooms.map((room, index) => {
                const copy = [...room]
                if (index === roomId) {
                    copy[roomPos] = roomId
                }

                return copy
            }),
            hallway.map((pos, index) => (hallwayPos === index ? -1 : pos)),
            costs + (Math.abs(hallwayPos - roomEntryPos) + (roomPos + 1)) * 10 ** roomId
        )
    }

    private *getRoomMoves(roomId: number) {
        const { rooms, hallway, costs } = this
        if (!this.roomHasInvalidOccupants(roomId)) {
            return
        }

        const roomPos = rooms[roomId].findIndex((pos) => pos !== NO_OCCUPANT)
        const roomEntryPos = this.getRoomEntryPosition(roomId)

        const moveThroughHallway = (hallwayPos: number) => {
            const room = rooms[roomId]
            return new GameState(
                rooms.map((room, index) => {
                    const copy = [...room]
                    if (index === roomId) {
                        copy[roomPos] = NO_OCCUPANT
                    }

                    return copy
                }),
                hallway.map((pos, index) => (hallwayPos === index ? room[roomPos] : pos)),
                costs + (Math.abs(hallwayPos - roomEntryPos) + (roomPos + 1)) * 10 ** room[roomPos]
            )
        }

        for (let pos = roomEntryPos - 1; pos >= 0; pos--) {
            if (hallway[pos] !== NO_OCCUPANT) {
                break
            }

            if (pos !== 0 && pos % 2 === 0) {
                continue
            }

            yield moveThroughHallway(pos)
        }

        for (let pos = roomEntryPos + 1; pos < this.hallway.length; pos++) {
            if (hallway[pos] !== NO_OCCUPANT) {
                break
            }

            if (pos !== hallway.length - 1 && pos % 2 === 0) {
                continue
            }

            yield moveThroughHallway(pos)
        }
    }

    private roomHasInvalidOccupants(roomId: number) {
        return this.rooms[roomId].some((pos) => pos !== NO_OCCUPANT && pos !== roomId)
    }

    private getRoomEntryPosition(roomId: number) {
        return 2 + roomId * 2
    }
}

function findLeastEnergy(state: GameState): number {
    const previousState = previousStateData.get(state.key)
    if (state.costs > lowestEnergyCost) {
        return Infinity
    }

    if (previousState && previousState.costs <= state.costs) {
        return previousState.leastFromHere
    }

    if (state.isFinished) {
        lowestEnergyCost = Math.min(lowestEnergyCost, state.costs)
        return state.costs
    }

    const leastFromHere = [...state.getPossibleHallwayMoves(), ...state.getPossibleRoomMoves()]
        .map(findLeastEnergy)
        .reduce(min, Infinity)

    previousStateData.set(state.key, { leastFromHere, costs: state.costs })
    return leastFromHere
}

function solve(input: string[]): number {
    previousStateData.clear()
    lowestEnergyCost = Infinity

    return findLeastEnergy(GameState.fromInput(input))
}

const input = getInputAsLines()
const partTwoInput = input
    .slice(0, 3)
    .concat('  #D#C#B#A#')
    .concat('  #D#B#A#C#')
    .concat(input.slice(3))

console.log('Part one:', solve(input))
console.log('Part two:', solve(partTwoInput))
