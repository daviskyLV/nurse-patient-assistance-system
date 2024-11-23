import React from 'react';
import Link from 'next/link';
import './globals.css';
import { getSession } from './api/actions/auth/session';
import NotificationTable from './requests/NotificationTable';
import NotificationPopup from './requests/NotificationPopup';

const DefaultPage: React.FC = () => {
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

const TableViewPage: React.FC = () => {
    return (
        <div className="container">
            <h1>Assistance Tracking</h1>
            <div className="table-buttons">
            </div>
            <NotificationTable />
        </div>
    );
};

const Home = async () => {
    const session = await getSession();

    if (!session) {
        // Not logged in
        return (
            <div>
                <DefaultPage/>
            </div>
        );
    }

    // Logged in, showing notification requests page
    // TODO: display based on logged in user?
    return (
        <div>
            <TableViewPage/>
            <NotificationPopup />  {/* Render NotificationPopup here */}
        </div>
    );
};

export default Home;