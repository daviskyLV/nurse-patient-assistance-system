"use server"
import { cookies } from "next/headers";
import * as jwt from "jsonwebtoken"

const cookiesConfig = {
    maxAge: 60 * 60 * 24 * 1, // 1 day
    path: "/",
    domain: process.env.HOST ?? "localhost",
    httpOnly: true,
    secure: false, //process.env.NODE_ENV === "production"
};

export type SessionPayload = {
    username: string,
    expiresAt: Date
}

const secretKey = process.env.SESSION_SECRET ? process.env.SESSION_SECRET : "test"

/**
 * 
 * @param payload 
 * @returns 
 */
export async function encryptJWT(payload: SessionPayload): Promise<string> {
    return jwt.sign(payload, secretKey, {algorithm: "HS256"})
}

/**
 * Decrypts the JWT using HS256 algorithm
 */
export async function decryptJWT(session: string ): Promise<SessionPayload> {
    try {
        const payload = jwt.verify(session, secretKey, {algorithms: ["HS256"]})
        return payload as SessionPayload
    } catch (error) {
        console.log('Failed to verify session')
        throw error
    }
}

/**
 * Delete the session cookie
 */
export async function logoutSession() {
    (await cookies()).delete("session")
}

/**
 * Gets the session cookie info, undefined if not logged in
 */
export async function getSession(): Promise<SessionPayload | undefined> {
    const sessionJWT = (await cookies()).get("session")
    if (!sessionJWT) return undefined
    try {
        const decrypted = await decryptJWT(sessionJWT.value)
        return decrypted
    } catch (error) {
        return undefined
    }
}

/**
 * Creates and sets a session cookie of the user
 * @param username The username for which to create a session cookie
 */
export async function createSession(username: string) {
    const expiresAt = new Date(Date.now() + cookiesConfig.maxAge*1000)
    const encryptedJWT = await encryptJWT({username, expiresAt})
    const session = (await cookies()).set(
        'session',
        encryptedJWT,
        {
            ...cookiesConfig,
            sameSite: "lax"
        }
    )
}