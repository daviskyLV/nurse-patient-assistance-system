import * as crypto from 'crypto';

export async function encryptPassword(password: string, salt: string | undefined): Promise<{hash: Buffer, salt: string}> {
    if (salt === undefined) {
        salt = crypto.randomBytes(16).toString("hex")
    }

    const hash = crypto.createHash("sha256").update(password+salt).digest()
    return {hash: hash, salt: salt}
}