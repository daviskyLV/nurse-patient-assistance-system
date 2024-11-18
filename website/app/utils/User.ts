export type User = {
    id?: number,
    username: string,
    firstName: string,
    lastName: string,
    password: string | Buffer,
    passwordSalt?: string
}

export function isUser(obj: unknown): obj is User {
    return typeof obj === 'object' && obj !== null &&
    'username' in obj && typeof obj.username === "string" &&
    'firstName' in obj && typeof obj.firstName === "string" &&
    'lastName' in obj && typeof obj.lastName === "string" &&
    'password' in obj && (typeof obj.password === "string" || typeof obj.password === "object") &&
    (!("id" in obj) || ("id" in obj && typeof obj.id === "number")) &&
    (!("passwordSalt" in obj) || ("passwordSalt" in obj && typeof obj.passwordSalt === "string"));
}