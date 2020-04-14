import { IUpdatable } from './IUpdatable';

type TUpdatableEntry<T extends string> = [IUpdatable<T>, T]

export interface IUpdatableEntry<T extends string> extends TUpdatableEntry<T> { }
