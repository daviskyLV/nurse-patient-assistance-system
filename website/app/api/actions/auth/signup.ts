"use server"

import { z } from "zod"
import { isError } from "@/app/utils/utilFuncs"
import { connectToDatabase } from "../../db-connection"
import { redirect } from 'next/navigation';
import { encryptPassword } from "@/app/utils/encryption";

export type signupState = {
    zodErrors: any,
    message: string
}

const inputValidator = z.object({
    username: z.string().trim().min(3, {
        message: "Username must be between 3 and 30 characters"
    }).max(30, {
        message: "Username must be between 3 and 30 characters"
    }),
    password: z.string().trim().min(10)
    .max(100, {message: "Password must be between 10 and 100 characters"})
    .regex(/[a-zA-Z]/, {message: "Password must contain at least one letter."})
    .regex(/[0-9]/, {message: "Password must contain at least one number."})
    .regex(/[^a-zA-Z0-9]/, {message: "Password must contain at least one special character."}),
    firstName: z.string().trim().min(1, {
        message: "First name must be at least 1 character"
    }),
    lastName: z.string().trim().min(1, {
        message: "Last name must be at least 1 character"
    }),
})

export async function registerUserAction(prevState: signupState, formData: FormData) {
    const newState: signupState = {
        zodErrors: null,
        message: ""
    }
    
    // Validating inputs
    const validatedFields = inputValidator.safeParse({
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

    redirect("/login"); // Going to login page
}