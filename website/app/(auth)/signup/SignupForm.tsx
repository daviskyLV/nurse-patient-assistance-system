"use client";
import { ZodErrors } from '@/app/(utils)/(components)/ZodErrors';
import { signupState, registerUserAction } from '@/app/api/actions/auth-actions';
import React from 'react'
import { useFormState } from 'react-dom';

const INITIAL_STATE: signupState = {
    zodErrors: null,
    message: ""
}

const SignupForm = () => {
    const [formState, formAction] = useFormState(
        registerUserAction,
        INITIAL_STATE
    );

    return (
        <div>
            <form action={formAction}>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" required />
                <ZodErrors error={formState?.zodErrors?.username} />

                <label htmlFor="firstName">First Name:</label>
                <input type="text" id="firstName" name="firstName" required />
                <ZodErrors error={formState?.zodErrors?.firstName} />

                <label htmlFor="lastName">Last Name:</label>
                <input type="text" id="lastName" name="lastName" required />
                <ZodErrors error={formState?.zodErrors?.lastName} />

                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required />
                <ZodErrors error={formState?.zodErrors?.password} />

                <button type="submit">Create Account</button>
            </form>
        </div>
    )
}

export default SignupForm
