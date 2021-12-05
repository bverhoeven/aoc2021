class Bounds {
    constructor(public min: number, public max: number) {}

    update(value: number) {
        this.min = Math.min(this.min, value)
        this.max = Math.max(this.max, value)
    }
}

export class Grid<T> {
    private grid: Map<number, Map<number, T>> = new Map()
    private rowRange = new Bounds(0, 0)
    private columnRange = new Bounds(0, 0)

    get(x: number, y: number): T | undefined {
        return this.grid.get(x)?.get(y) ?? undefined
    }

    set(x: number, y: number, value: T): void {
        let row = this.grid.get(x)
        if (!row) {
            this.grid.set(x, (row = new Map()))
        }

        row.set(y, value)

        this.rowRange.update(x)
        this.columnRange.update(y)
    }

    count(condition: (value: T, x: number, y: number) => boolean) {
        return this.reduce((count, value, x, y) => count + (condition(value, x, y) ? 1 : 0), 0)
    }

    reduce<R>(callback: (previous: R, value: T, x: number, y: number) => R, result: R): R {
        for (let x = this.rowRange.min; x <= this.rowRange.max; x++) {
            const row = this.grid.get(x)
            if (!row) {
                continue
            }

            for (let y = this.columnRange.min; y <= this.columnRange.max; y++) {
                const value = row.get(y)
                if (value !== undefined) {
                    result = callback(result, value, x, y)
                }
            }
        }

        return result
    }
}

export class NumberGrid extends Grid<number> {
    increment(x: number, y: number) {
        this.set(x, y, (this.get(x, y) ?? 0) + 1)
    }
}
