import { getInput, getTestInput } from '../shared/input'
import { max, min, multiply, sum } from '../shared/reducers'

const TYPE_LITERAL = 4

class Packet {
    readonly packets: Packet[] = []
    constructor(readonly version: number, readonly type: number) {}

    getVersion(): number {
        return this.packets.reduce((prev, packet) => prev + packet.getVersion(), this.version)
    }

    getValue(): number {
        const { type, packets } = this
        switch (type) {
            case 0:
                return packets.map((p) => p.getValue()).reduce(sum)
            case 1:
                return packets.map((p) => p.getValue()).reduce(multiply)
            case 2:
                return packets.map((p) => p.getValue()).reduce(min)
            case 3:
                return packets.map((p) => p.getValue()).reduce(max)
            case 5:
                return packets[0].getValue() > packets[1].getValue() ? 1 : 0
            case 6:
                return packets[0].getValue() < packets[1].getValue() ? 1 : 0
            case 7:
                return packets[0].getValue() === packets[1].getValue() ? 1 : 0
            default:
                throw new Error(`Invalid type: ${type}`)
        }
    }
}

class LiteralPacket extends Packet {
    constructor(version: number, readonly value: number) {
        super(version, TYPE_LITERAL)
    }

    getValue() {
        return this.value
    }
}

class Transmission {
    private bits: string
    readonly root: Packet

    constructor(input: string) {
        this.bits = input
            .split('')
            .map((char) => parseInt(char, 16).toString(2).padStart(4, '0'))
            .join('')

        this.root = this.parse()
    }

    getVersion() {
        return this.root.getVersion()
    }

    getValue() {
        return this.root.getValue()
    }

    private parse(): Packet {
        const version = this.readNumber(3)
        const type = this.readNumber(3)

        let packet: Packet
        if (type === TYPE_LITERAL) {
            packet = new LiteralPacket(version, this.readLiteral())
        } else {
            packet = new Packet(version, type)

            const lengthType = this.readNumber(1)
            if (lengthType === 0) {
                const length = this.readNumber(15)
                for (let start = this.bits.length; start - this.bits.length < length; ) {
                    packet.packets.push(this.parse())
                }
            } else {
                const count = this.readNumber(11)
                while (packet.packets.length < count) {
                    packet.packets.push(this.parse())
                }
            }
        }

        return packet
    }

    private readString(length: number): string {
        const string = this.bits.slice(0, length)
        this.bits = this.bits.slice(length)
        return string
    }

    private readNumber(length: number): number {
        return parseInt(this.readString(length), 2)
    }

    private readLiteral(): number {
        let bits = ''

        let read = true
        while (read) {
            read = this.readNumber(1) === 1
            bits += this.readString(4)
        }

        return parseInt(bits, 2)
    }
}

const transmission = new Transmission(getInput())

console.log('Part one:', transmission.getVersion())
console.log('Part two:', transmission.getValue())
