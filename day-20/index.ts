import { getInput, getTestInput } from '../shared/input'

enum Pixel {
    Dark = 0,
    Light = 1,
}

function parsePixel(str: string) {
    switch (str) {
        case '#':
            return Pixel.Light
        case '.':
            return Pixel.Dark
        default:
            throw new Error(`Invalid pixel: ${str}`)
    }
}

class Image {
    private pixels: Record<string, Pixel> = {}
    private algorithm: Pixel[]
    private lowerBound = 0
    private upperBound = 0
    private runs = 0

    constructor(input: string) {
        const [algorithm, image] = input.split('\n\n')
        this.algorithm = algorithm.split('').map(parsePixel)

        image.split('\n').forEach((pixels, row) => {
            pixels
                .split('')
                .map(parsePixel)
                .forEach((pixel, col) => {
                    this.pixels[[row, col].join()] = pixel
                })

            this.upperBound = row
        })
    }

    enhanced(iterations: number) {
        for (let i = 0; i < iterations; i++) {
            this.enhance()
        }

        return this
    }

    private enhance() {
        const updated: Record<string, Pixel> = {}
        this.runs++

        let border = Pixel.Dark
        if (this.algorithm[0] === Pixel.Light) {
            border = this.runs % 2 === 0 ? Pixel.Light : Pixel.Dark
        }

        for (let row = this.lowerBound - 1; row <= this.upperBound + 1; row++) {
            for (let col = this.lowerBound - 1; col <= this.upperBound + 1; col++) {
                // a b c
                // d - e
                // f g h

                const directions = [
                    [row - 1, col - 1], // a
                    [row - 1, col + 0], // b
                    [row - 1, col + 1], // c
                    [row + 0, col - 1], // d
                    [row + 0, col + 0], // - (current pixel)
                    [row + 0, col + 1], // e
                    [row + 1, col - 1], // f
                    [row + 1, col + 0], // g
                    [row + 1, col + 1], // h
                ]

                const binaryIndex = directions
                    .map((coords) => coords.join())
                    .map((location) => this.pixels[location] ?? border)
                    .join('')

                updated[[row, col].join()] = this.algorithm[parseInt(binaryIndex, 2)]
            }
        }

        this.pixels = updated
        this.lowerBound--
        this.upperBound++
    }

    get litPixels(): number {
        return Object.values(this.pixels).filter((pixel) => pixel === Pixel.Light).length
    }
}

const input = getInput()
const image = new Image(input)

const partOne = image.enhanced(2).litPixels
const partTwo = image.enhanced(48).litPixels

console.log('Part one:', partOne)
console.log('Part two:', partTwo)
