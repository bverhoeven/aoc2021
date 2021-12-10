import { GridCell, NumberGrid } from '../shared/grid'
import { getInputAsLines } from '../shared/input'
import { multiply } from '../shared/reducers'
import { numericSort } from '../shared/sorting'

function isLowestAmongNeighbors(cell: GridCell<number>) {
    return cell.getNeighbors().every((neighbor) => cell.value < neighbor.value)
}

function expandBasin(cell: GridCell<number>, visited: GridCell[] = []) {
    visited.push(cell)

    for (const neighbor of cell.getNeighbors()) {
        if (neighbor.value < 9 && !visited.some((visit) => visit.equalsPosition(neighbor))) {
            visited = expandBasin(neighbor, visited)
        }
    }

    return visited
}

function getPartOne() {
    function riskLevel(level: number, height: number) {
        return level + (height + 1)
    }

    return map.filterValues(isLowestAmongNeighbors).reduce(riskLevel, 0)
}

function getPartTwo() {
    return map
        .filter(isLowestAmongNeighbors)
        .map((start) => expandBasin(start))
        .map((basin) => basin.length)
        .sort(numericSort)
        .slice(-3)
        .reduce(multiply)
}

const map = new NumberGrid()
const input = getInputAsLines()

input.forEach((line, row) =>
    line.split('').forEach((value, column) => map.set(row, column, Number(value)))
)

console.log('Part one:', getPartOne())
console.log('Part two:', getPartTwo())
