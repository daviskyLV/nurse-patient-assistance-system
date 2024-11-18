"use client";
import React from 'react'
import { useFormState } from 'react-dom';
import { ZodErrors } from '@/app/utils/components/ZodErrors';
import { authenticateUserAction, authenticationState } from '@/app/api/actions/auth/login';

const INITIAL_STATE: authenticationState = {
    zodErrors: null,
    message: ""
}

const LoginForm = () => {
    const [formState, formAction] = useFormState(
        authenticateUserAction,
        INITIAL_STATE
    );
    //const [credentials, setCredentials] = useState({ username: '', password: '' });

    /*const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };*/

    return (
        <div>
            <form action={formAction}>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" required />
                <ZodErrors error={formState?.zodErrors?.username} />

                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required />
                <ZodErrors error={formState?.zodErrors?.password} />

                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default LoginForm
