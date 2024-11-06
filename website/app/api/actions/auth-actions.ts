"use server";
import * as crypto from 'crypto';
import { connectToDatabase } from '../db-connection';
import { z } from "zod"
import { isError } from '@/app/(utils)/utilFuncs';


/// SIGN UP
export type signupState = {
    zodErrors: any,
    message: string
}

const signupInputValidator = z.object({
    username: z.string().min(3).max(30, {
        message: "Username must be between 3 and 30 characters"
    }),
    password: z.string().min(10).max(100, {
        message: "Password must be between 10 and 100 characters"
    }),
    firstName: z.string().min(1, {
        message: "First name must be at least 1 character"
    }),
    lastName: z.string().min(1, {
        message: "Last name must be at least 1 character"
    }),
})

export async function registerUserAction(prevState: signupState, formData: FormData) {
    const newState: signupState = {
        zodErrors: null,
        message: ""
    }
    
    // Validating inputs
    const validatedFields = signupInputValidator.safeParse({
        username: formData.get("username"),
        password: formData.get("password"),
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName")
    })

    // Invalid form input
    if (!validatedFields.success) {
        newState.zodErrors = validatedFields.error.flatten().fieldErrors
        newState.message = "Missing Fields!"
        console.log(newState)

        return {...prevState, ...newState}
    }

    // Checking does user exist
    const dbCon = connectToDatabase()
    const usernameCheck = await dbCon.usernameExistsAsync(validatedFields.data.username)
    if (isError(usernameCheck)) {
        newState.message = usernameCheck.message
        dbCon.close()
        return {...prevState, ...newState}
    }
    if (usernameCheck === true) {
        newState.zodErrors = {username: ["Username taken!"]}
        newState.message = "Registration failed!"
        dbCon.close()
        return {...prevState, ...newState}
    }
    
    // Username is free, generating password
    const encryptedPassword = await encryptPassword(validatedFields.data.password, undefined)
    // Creating the user
    dbCon.createAccount(
        validatedFields.data.username,
        encryptedPassword.hash,
        encryptedPassword.salt,
        validatedFields.data.firstName,
        validatedFields.data.lastName,
        undefined
    )
    dbCon.close()
    newState.message = "ok"

    return {...prevState, ...newState}
}


/// AUTHENTICATION
export type authenticationState = {
    auth: {
        cookie: string,
        username: string
    },
    zodErrors: any,
    message: string
}

const authInputValidator = z.object({
    username: z.string().min(3).max(30, {
        message: "Username must be between 3 and 30 characters"
    }),
    password: z.string().min(10).max(100, {
        message: "Password must be between 10 and 100 characters"
    })
})

export async function authenticateUserAction(prevState: authenticationState, formData: FormData) {
    const newState: authenticationState = {
        auth: {
            cookie: "",
            username: ""
        },
        zodErrors: null,
        message: ""
    }

    // Validating inputs
    const validatedFields = authInputValidator.safeParse({
        username: formData.get("username"),
        password: formData.get("password")
    })

    // Invalid form input
    if (!validatedFields.success) {
        newState.zodErrors = validatedFields.error.flatten().fieldErrors
        newState.message = "Missing Fields!"
        console.log(newState)

        return {...prevState, ...newState}
    }

    // Checking credentials
    const dbCon = connectToDatabase()
    const usernameCheck = await dbCon.usernameExistsAsync(validatedFields.data.username)
    if (isError(usernameCheck)) {
        newState.message = usernameCheck.message
        dbCon.close()
        return {...prevState, ...newState}
    }
    if (usernameCheck === false) {
        newState.zodErrors = {username: ["Username not found!"]}
        newState.message = "Authentication failed!"
        dbCon.close()
        return {...prevState, ...newState}
    }

    // Username exists, checking does password match
    const userInfo = await dbCon.userInfoAsync(validatedFields.data.username)
    if (isError(userInfo)) {
        newState.message = userInfo.message
        dbCon.close()
        return {...prevState, ...newState}
    }
    
    // Checking did database return a Buffer for database and the salt exists
    if (typeof userInfo.password !== "object" || !("passwordSalt" in userInfo)) {
        newState.message = "Unknown error!"
        dbCon.close()
        return {...prevState, ...newState}
    }
    // Comparing passwords
    const encryptedPassword = await encryptPassword(validatedFields.data.password, userInfo.passwordSalt)
    if (userInfo.password.toString("hex") !== encryptedPassword.hash.toString("hex")) {
        newState.zodErrors = {password: ["Invalid password!"]}
        newState.message = "Authentication failed!"
        dbCon.close()
        return {...prevState, ...newState}
    }
    dbCon.close()

    // Passwords match
    newState.message = "ok"
    newState.auth = {
        cookie: "yay",
        username: userInfo.username
    }

    return {...prevState, ...newState}
}

/// ENCRYPTION
export async function encryptPassword(password: string, salt: string | undefined): Promise<{hash: Buffer, salt: string}> {
    if (salt === undefined) {
        salt = crypto.randomBytes(16).toString("hex")
    }

    const hash = crypto.createHash("sha256").update(password+salt).digest()
    return {hash: hash, salt: salt}
}