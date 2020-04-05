export interface IModule<T extends string> {
    getType(): T,
    getName(): string,
}
