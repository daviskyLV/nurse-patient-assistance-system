"use server";
import { z } from "zod"
import { isError } from '@/app/utils/utilFuncs';
import { redirect } from 'next/navigation';
import { encryptPassword } from '@/app/utils/encryption';
import { createSession } from './session';
import { connectToDatabase } from "../../db-connection";


export type authenticationState = {
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

    createSession(userInfo.username)
    redirect("/"); // Going to homepage
}