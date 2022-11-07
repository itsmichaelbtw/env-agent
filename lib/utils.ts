export function isUndefined(value: unknown): value is undefined {
    return typeof value === "undefined";
}

export function hasOwnProperty<X extends {}, Y extends PropertyKey>(
    obj: X,
    prop: Y
): obj is X & Record<Y, unknown> {
    return obj.hasOwnProperty(prop);
}

export function shallowMerge<T, U>(target: T, source: U): T & U {
    return Object.assign({}, target, source);
}

export function removeQuotes(value: string): string {
    return value.replace(/(^['"]|['"]$)/g, "");
}
