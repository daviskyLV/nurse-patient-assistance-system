export function isError(obj: unknown): obj is Error {
    return typeof obj === 'object' && obj !== null && 'message' in obj && 'name' in obj;
}