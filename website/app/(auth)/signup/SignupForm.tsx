"use client";
import { registerUserAction, signupState } from '@/app/api/actions/auth/signup';
import { ZodErrors } from '@/app/utils/components/ZodErrors';
import React from 'react'
import { useFormState, useFormStatus } from 'react-dom';
import '../auth-styles.css';

const INITIAL_STATE: signupState = {
    zodErrors: null,
    message: ""
}

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <button disabled={pending} type="submit">
            Create an Account
        </button>
    )
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

                <SubmitButton/>
            </form>
        </div>
    )
}

export default SignupForm