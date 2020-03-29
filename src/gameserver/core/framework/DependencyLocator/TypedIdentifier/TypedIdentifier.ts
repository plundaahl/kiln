export class TypedIdentifier<T> {
    public readonly symbol: Symbol;
    private readonly name: String;

    constructor(name: string) {
        if (name.length === 0) {
            throw new Error(`Name must be greater than 0 characters`);
        }

        this.symbol = Symbol.for(name);
        this.name = name;
    }

    toString() {
        return this.name;
    }
}
