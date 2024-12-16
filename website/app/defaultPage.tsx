"use client";
import "./defaultPage.css";
import { useFormState } from "react-dom";
import { authenticateUserAction, authenticationState } from "./api/actions/auth/login";
import { ZodErrors } from "./utils/components/ZodErrors";
import Link from "next/link";

const INITIAL_STATE: authenticationState = {
    zodErrors: null,
    message: "",
};

const DefaultPage: React.FC = () => {
    const [formState, formAction] = useFormState(authenticateUserAction, INITIAL_STATE);

    return (
        <div className="container">
            <div className="login-box">
                <h1>Assistance Tracking</h1>
                <form action={formAction}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        className="input-field"
                        required
                    />
                    <ZodErrors error={formState?.zodErrors?.username} />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="input-field"
                        required
                    />
                    <ZodErrors error={formState?.zodErrors?.password} />

                    <button type="submit" className="btn primary">
                        Log In
                    </button>
                </form>
                <p className="signup-text">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="signup-link">
                        Sign Up
                    </Link>
                </p>
                {formState?.message && <p className="error-message">{formState.message}</p>}
            </div>
        </div>
    );
};

export default DefaultPage;