export declare function isUndefined(value: unknown): value is undefined;
export declare function hasOwnProperty<X extends {}, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown>;
export declare function shallowMerge<T, U>(target: T, source: U): T & U;
export declare function removeQuotes(value: string): string;
