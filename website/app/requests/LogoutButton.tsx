"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { logoutSession } from '@/app/api/actions/auth/session';

const LogoutButton: React.FC = () => {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logoutSession();
            console.log("Logged out successfully");

            router.push('/');
        } catch (error) {
            console.error("Logout failed:", error);
        }

    };

    return (
        <button onClick={handleLogout} className="logout-btn">Log Out</button>
    );
};

export default LogoutButton;