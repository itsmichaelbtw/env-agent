export declare function isUndefined(value: unknown): value is undefined;
export declare function hasOwnProperty<X extends {}, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown>;
