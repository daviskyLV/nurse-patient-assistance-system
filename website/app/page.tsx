import React from 'react';
import './globals.css';
import { getSession, SessionPayload } from './api/actions/auth/session';
import NotificationTable, { Notification } from './requests/NotificationTable';
import NotificationPopup from './requests/NotificationPopup';
import { connectToDatabase } from './api/db-connection';
import { isError } from './utils/utilFuncs';
import DefaultPage from './defaultPage';


// const defaultNotifs: Notification[] = [
//     { reqNo: 1, room: 1, bed: 3, reqDate: '3/11/2024', reqTime: '18:37' },
//     { reqNo: 2, room: 2, bed: 2, reqDate: '3/11/2024', reqTime: '18:40' },
//     // Add more data as necessary
// ];

const TableViewPage: React.FC<{session: SessionPayload}> = async ({session}) => {
    const db = connectToDatabase()
    // Getting initial notifications
    const patientRequests = await db.getRequestsAsync()
    const initialNotifs: Notification[] = []
    if (!isError(patientRequests)) {
        for (let i = 0; i < patientRequests.length; i++) {
            const req = patientRequests[i]
            const reqDt = req.requestDateTime
            const notif: Notification = {
                reqNo: (req.id ? req.id : -1),
                room: req.roomNumber,
                bed: req.bedNumber,
                reqDate: reqDt.toLocaleDateString(),
                reqTime: reqDt.toLocaleTimeString()
            }
            // Checking if request already accepted
            if (req.acceptedBy !== undefined) {
                const userInfo = await db.userInfoAsync(req.acceptedBy)
                notif.nurse = "Error"
                if (!isError(userInfo)) {
                    notif.nurse = userInfo.firstName
                }
                
                if (req.responseDateTime !== undefined) {
                    const attDt = req.responseDateTime
                    notif.attendanceDate = attDt.toLocaleDateString(),
                    notif.attendanceTime = attDt.toLocaleTimeString()
                }
            }

            initialNotifs.push(notif)
        }
    }
    
    // Getting nurse info
    const userInfo = await db.userInfoAsync(session.username)
    let nurseName = session.username
    let nurseId = -1
    db.close()
    if (!isError(userInfo)) {
        nurseName = userInfo.firstName
        if (userInfo.id !== undefined) {
            nurseId = userInfo.id
        }
    }

    return (
        <div className="container">
            <h1>Assistance Tracking</h1>
            <div className="table-buttons">
            </div>
            <NotificationTable
                currentNurseName={nurseName}
                initialNotifications={initialNotifs}
                currentNurseId={nurseId}
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
            <NotificationPopup />
        </div>
    );
};

export default Home;