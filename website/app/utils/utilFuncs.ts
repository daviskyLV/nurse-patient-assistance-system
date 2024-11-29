export function isError(obj: unknown): obj is Error {
    return typeof obj === 'object' && obj !== null && 'message' in obj && 'name' in obj;
}

export function isNumber(obj: unknown): obj is number {
    return typeof obj === 'number';
}

export function isObject(obj: unknown): obj is object {
    return typeof obj === 'object' && obj !== null
}

export function isArray(obj: unknown): obj is unknown[] {
    return Array.isArray(obj)
}