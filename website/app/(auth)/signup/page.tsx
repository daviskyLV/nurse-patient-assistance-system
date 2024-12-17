import React from 'react';
import SignupForm from './SignupForm';
import Link from 'next/link';

const Signup = () => {
    return (
        <div className="container">
            <h2>Create Account</h2>
            <SignupForm/>
            <p className="login-redirect">
                Already have an account?{' '}
                <Link href="/" className="login-link">
                    Log in
                </Link>
            </p>
        </div>
    );
};

export default Signup;
