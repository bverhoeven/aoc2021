class Bounds {
    constructor(public min: number, public max: number) {}

    update(value: number) {
        this.min = Math.min(this.min, value)
        this.max = Math.max(this.max, value)
    }
}

export class Grid<T> {
    protected grid: Map<number, Map<number, T>> = new Map()
    protected rowRange = new Bounds(0, 0)
    protected columnRange = new Bounds(0, 0)

    get(x: number, y: number): T | undefined {
        return this.grid.get(y)?.get(x) ?? undefined
    }

    set(x: number, y: number, value: T): void {
        let row = this.grid.get(y)
        if (!row) {
            this.grid.set(y, (row = new Map()))
        }

        row.set(x, value)

        this.rowRange.update(y)
        this.columnRange.update(x)
    }

    count(condition: (value: T, x: number, y: number) => boolean) {
        return this.reduce((count, value, x, y) => count + (condition(value, x, y) ? 1 : 0), 0)
    }

    reduce<R>(callback: (previous: R, value: T, x: number, y: number) => R, result: R): R {
        for (let y = this.rowRange.min; y <= this.rowRange.max; y++) {
            const row = this.grid.get(y)
            if (!row) {
                continue
            }

            for (let x = this.columnRange.min; x <= this.columnRange.max; x++) {
                const value = row.get(x)
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
