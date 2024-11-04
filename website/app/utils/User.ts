export type User = {
    id?: number,
    username: string,
    firstName: string,
    lastName: string,
    password: string | Buffer,
    passwordSalt?: string
}