import React from 'react';
import Link from 'next/link';
import './globals.css';
import { getSession, SessionPayload } from './api/actions/auth/session';
import NotificationTable, { Notification } from './requests/NotificationTable';
import NotificationPopup from './requests/NotificationPopup';
import { connectToDatabase } from './api/db-connection';
import { isError } from './utils/utilFuncs';

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

const TableViewPage: React.FC<{session: SessionPayload}> = async ({session}) => {
    const db = connectToDatabase()
    // Getting initial notifications
    const patientRequests = await db.getRequestsAsync()
    const initialNotifs: Notification[] = []
    if (!isError(patientRequests)) {
        patientRequests.forEach(async req => {
            const reqDt = req.requestDateTime
            const notif: Notification = {
                reqNo: (req.id ? req.id : -1),
                room: req.roomNumber,
                bed: req.bedNumber,
                reqDate: `${reqDt.getFullYear()}-${reqDt.getMonth()}-${reqDt.getDay()}`,
                reqTime: `${reqDt.getHours()}:${reqDt.getMinutes()}:${reqDt.getSeconds()}`
            }
            // Checking if request already accepted
            if (req.acceptedBy !== undefined) {
                const userInfo = await db.userInfoAsync(req.acceptedBy)
                notif.nurse = "Error"
                if (!isError(userInfo)) {
                    notif.nurse = userInfo.firstName
                }
                const attDt = req.requestDateTime
                if (req.responseDateTime !== undefined) {
                    notif.attendanceDate = `${attDt.getFullYear()}-${attDt.getMonth()}-${attDt.getDay()}`,
                    notif.attendanceTime = `${attDt.getHours()}:${attDt.getMinutes()}:${attDt.getSeconds()}`
                }
            }

            initialNotifs.push()
        });
    }
    
    // Getting nurse info
    const userInfo = await db.userInfoAsync(session.username)
    let nurseName = session.username
    db.close()
    if (!isError(userInfo)) {
        nurseName = userInfo.firstName
    }

    return (
        <div className="container">
            <h1>Assistance Tracking</h1>
            <div className="table-buttons">
            </div>
            <NotificationTable
                currentNurseName={nurseName}
                initialNotifications={initialNotifs}
            />
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
            <TableViewPage session={session}/>
            <NotificationPopup />  {/* Render NotificationPopup here */}
        </div>
    );
};

export default Home;