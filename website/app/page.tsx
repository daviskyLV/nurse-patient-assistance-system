import React from 'react';
import Link from 'next/link';
import './globals.css';

const Home: React.FC = () => {
    return (
        <div className="container">
            <h1>Assistance Tracking</h1>
            <Link href="/signup">
                <button>Create Account</button>
            </Link>
            <Link href="/login">
                <button>Login</button>
            </Link>
        </div>
    );
};

export default Home;