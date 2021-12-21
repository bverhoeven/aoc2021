import { getInput, getTestInput } from '../shared/input'
import { max } from '../shared/reducers'

function countOverlap<T>(lhs: Set<T> | T[], rhs: Set<T> | T[]) {
    const search = [...lhs]
    const other = new Set([...rhs])

    return new Set(search.filter((it) => other.has(it))).size
}

function beaconsToString(beacons: Beacon[]) {
    return beacons.map((b) => b.toString())
}

class Vector {
    constructor(readonly x: number, readonly y: number, readonly z: number) {}

    toString() {
        return [this.x, this.y, this.z].join()
    }

    asVector() {
        return new Vector(this.x, this.y, this.z)
    }

    subtract(other: Vector) {
        return new Vector(this.x - other.x, this.y - other.y, this.z - other.z)
    }

    manhattanDistanceTo(other: Vector): number {
        return Math.abs(this.x - other.x) + Math.abs(this.y - other.y) + Math.abs(this.z - other.z)
    }
}

class Beacon extends Vector {
    constructor(x: number, y: number, z: number) {
        super(x, y, z)
    }

    static parse(input: string) {
        const [x, y, z] = input.split(',').map(Number)
        return new Beacon(x, y, z)
    }

    distanceTo(other: Beacon): number {
        return this.manhattanDistanceTo(other)
    }

    *rotations() {
        let target = new Beacon(this.x, this.y, this.z)

        for (let cycle = 0; cycle < 2; cycle++) {
            for (let step = 0; step < 3; step++) {
                yield (target = target.roll())
                for (let i = 0; i < 3; i++) {
                    yield (target = target.turn())
                }
            }

            target = target.roll().turn().roll()
        }
    }

    private roll() {
        return new Beacon(this.x, this.z, -this.y)
    }

    private turn() {
        return new Beacon(-this.y, this.x, this.z)
    }
}

class Scanner {
    public position = new Vector(0, 0, 0)
    public isComplete = false
    readonly distances = new Set<number>()

    private constructor(readonly id: number, public beacons: Beacon[]) {
        this.distances = new Set(beacons.flatMap((a) => beacons.map((b) => b.distanceTo(a))))
    }

    public static parse(input: string): Scanner {
        const data = input.split('\n')
        const header = data.shift()?.match(/-- scanner (\d+) --/)
        if (!header) {
            throw new Error(`Failed to parse scanner header: ${input}`)
        }

        return new Scanner(Number(header[1]), data.map(Beacon.parse))
    }

    hasSufficientOverlapWith(other: Scanner) {
        if (other === this) {
            return false
        }

        return countOverlap(this.distances, other.distances) >= (12 * 11) / 2
    }

    findOverlappingBeacons(other: Scanner) {
        if (this.isComplete) {
            throw new Error(`Scanner ${this.id} has already finished.`)
        }

        const theirBeacons = beaconsToString(other.beacons)
        const rotations = this.beacons
            .map((b) => [...b.rotations()])
            .reduce((r, z) => z.map((v, i) => [...(r[i] ?? []), v]), [] as Beacon[][])

        for (const rotatedBeacons of rotations) {
            for (const theirBeacon of other.beacons) {
                for (const beacon of rotatedBeacons) {
                    const offset = beacon.subtract(theirBeacon)
                    const rotated = rotatedBeacons.map(
                        (beacon) => beacon.subtract(offset) as Beacon
                    )

                    if (countOverlap(beaconsToString(rotated), theirBeacons) >= 12) {
                        this.beacons = rotated
                        this.position = offset
                        this.isComplete = true
                        return true
                    }
                }
            }
        }

        return false
    }

    manhattanDistanceTo(other: Scanner) {
        return this.position.manhattanDistanceTo(other.position)
    }
}

function solve(input: string) {
    const scanners = input.split('\n\n').map(Scanner.parse)

    const pairs: [Scanner, Scanner][] = []
    for (const a of scanners) {
        for (const b of scanners) {
            if (a.hasSufficientOverlapWith(b)) {
                pairs.push([a, b])
            }
        }
    }

    console.log(`Filtered pairs: ${pairs.length} (out of ${scanners.length ** 2})`)
    scanners[0].isComplete = true

    let next = pairs.shift()
    while (next) {
        const [complete, pending] = next
        if (!pending.findOverlappingBeacons(complete)) {
            throw new Error(`Expected overlapping beacons but found none.`)
        }

        next = pairs.find(([a, b]) => a.isComplete && !b.isComplete)
    }

    const beacons = new Set(scanners.flatMap(({ beacons }) => beaconsToString(beacons)))
    const largestDistance = scanners
        .map((scanner) => scanners.map((other) => scanner.manhattanDistanceTo(other)).reduce(max))
        .reduce(max)

    return { beacons, largestDistance }
}

const label = 'Time taken'
console.time(label)
const result = solve(getInput())
console.timeEnd(label)

console.log()
console.log('Part one:', result.beacons.size)
console.log('Part two:', result.largestDistance)
