import { getInput, getTestInput } from '../shared/input'

function solveTrajectory(input: string) {
    const [minX, maxX, minY, maxY] = [...input.matchAll(/[0-9-]+/g)].map(Number)

    let highestY = 0
    let initialVelocityCount = 0

    for (let x = 1; x < 512; x++) {
        for (let y = -512; y < 512; y++) {
            let myHighestY = 0

            let xVelocity = x
            let yVelocity = y
            let stepX = 0
            let stepY = 0

            do {
                stepX += xVelocity
                stepY += yVelocity
                myHighestY = Math.max(stepY, myHighestY)

                if (stepX >= minX && stepX <= maxX && stepY >= minY && stepY <= maxY) {
                    highestY = Math.max(highestY, myHighestY)
                    initialVelocityCount++
                    break
                }

                yVelocity--
                xVelocity -= Math.sign(xVelocity)
            } while (stepY >= minY && stepX <= maxX)
        }
    }

    return { highestY, initialVelocityCount }
}

const result = solveTrajectory(getInput())

console.log('Part one:', result.highestY)
console.log('Part two:', result.initialVelocityCount)
