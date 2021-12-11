class Bounds {
    constructor(public min: number, public max: number) {}

    update(value: number) {
        this.min = Math.min(this.min, value)
        this.max = Math.max(this.max, value)
    }

    *iterator() {
        let index = this.min
        while (index <= this.max) {
            yield index++
        }
    }
}

function defaultGridPrinter<T>(cell: GridCell<T>) {
    return cell.value === undefined ? ' ' : `${cell.value}`
}

export class Grid<T> {
    protected rows: Map<number, Map<number, T>> = new Map()
    protected rowRange = new Bounds(0, 0)
    protected columnRange = new Bounds(0, 0)

    constructor(rows = 0, columns = 0) {
        this.rowRange.max = rows
        this.columnRange.max = columns
    }

    get(rowIndex: number, columnIndex: number): T | undefined {
        return this.rows.get(rowIndex)?.get(columnIndex) ?? undefined
    }

    set(rowIndex: number, columnIndex: number, value: T): void {
        let row = this.rows.get(rowIndex)
        if (!row) {
            this.rows.set(rowIndex, (row = new Map()))
        }

        row.set(columnIndex, value)

        this.rowRange.update(rowIndex)
        this.columnRange.update(columnIndex)
    }

    count(condition: (cell: GridCell<T>) => boolean): number {
        return this.reduce((count, cell) => count + (condition(cell) ? 1 : 0), 0)
    }

    reduce<R>(callback: (result: R, cell: GridCell<T>) => R, result: R): R {
        for (const cell of this.populatedCells()) {
            result = callback(result, cell)
        }

        return result
    }

    filterValues(callback: (cell: GridCell<T>) => boolean): T[] {
        return this.filter(callback).map((cell) => cell.value)
    }

    filter(callback: (cell: GridCell<T>) => boolean): GridCell<T>[] {
        const results: GridCell<T>[] = []
        for (const cell of this.populatedCells()) {
            if (callback(cell)) {
                results.push(cell)
            }
        }

        return results
    }

    toString(cellPrinter: (cell: GridCell<T | undefined>) => string = defaultGridPrinter) {
        let str = ''
        for (const row of this.rowRange.iterator()) {
            for (const column of this.columnRange.iterator()) {
                str += cellPrinter(new GridCell(this, row, column))
            }

            str += '\n'
        }

        return str
    }

    *populatedCells(): Generator<GridCell<T>> {
        for (const row of this.rowRange.iterator()) {
            for (const column of this.columnRange.iterator()) {
                const value = this.get(row, column)
                if (value !== undefined) {
                    yield new GridCell(this, row, column)
                }
            }
        }
    }

    get height() {
        return this.rowRange.max + 1
    }

    get width() {
        return this.columnRange.max + 1
    }
}

export class NumberGrid extends Grid<number> {
    increment(x: number, y: number) {
        this.set(x, y, (this.get(x, y) ?? 0) + 1)
    }
}

export class GridCell<T = unknown> {
    constructor(private grid: Grid<T>, readonly row = 0, readonly column = 0) {
        Object.defineProperty(this, 'grid', { enumerable: false })
    }

    get x() {
        return this.row
    }

    get y() {
        return this.column
    }

    get value() {
        return this.grid.get(this.row, this.column) as T
    }

    set value(value: T) {
        this.grid.set(this.row, this.column, value)
    }

    equalsPosition(other: GridCell<unknown>) {
        return other.row === this.row && other.column === this.column
    }

    getNeighbors(includeDiagonals = false): GridCell<T>[] {
        const candidates = [
            [this.row, this.column - 1],
            [this.row + 1, this.column],
            [this.row, this.column + 1],
            [this.row - 1, this.column],
        ]

        if (includeDiagonals) {
            candidates.push([this.row + 1, this.column - 1])
            candidates.push([this.row + 1, this.column + 1])
            candidates.push([this.row - 1, this.column + 1])
            candidates.push([this.row - 1, this.column - 1])
        }

        const neighbors: GridCell<T>[] = []
        for (const [row, column] of candidates) {
            const value = this.grid.get(row, column)
            if (value !== undefined) {
                neighbors.push(new GridCell(this.grid, row, column))
            }
        }

        return neighbors
    }
}
