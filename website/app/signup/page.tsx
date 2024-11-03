"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Signup: React.FC = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Account Created Successfully');
        router.push('/');
    };

    return (
        <div className="container">
            <h2>Create Account</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" onChange={handleChange} required />

                <label htmlFor="firstName">First Name:</label>
                <input type="text" id="firstName" name="firstName" onChange={handleChange} required />

                <label htmlFor="lastName">Last Name:</label>
                <input type="text" id="lastName" name="lastName" onChange={handleChange} required />

                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" onChange={handleChange} required />

                <button type="submit">Create Account</button>
            </form>
        </div>
    );
};

export default Signup;