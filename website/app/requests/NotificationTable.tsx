"use client";

import React, { useState } from 'react';
import AttendButton from './AttendButton';
import CSVButton from './CSVButton'; 
import LogoutButton from './LogoutButton';

type Notification = {
    reqNo: number;
    room: string;
    bed: number;
    reqDate: string;
    reqTime: string;
    nurse?: string;
    attendanceDate?: string;
    attendanceTime?: string;
};

const initialNotifications: Notification[] = [
    { reqNo: 1, room: 'A1', bed: 3, reqDate: '3/11/2024', reqTime: '18:37' },
    { reqNo: 2, room: 'D2', bed: 2, reqDate: '3/11/2024', reqTime: '18:40' },
    // Add more data as necessary
];

// Assume "Maria Dan" is the currently logged-in nurse
const currentNurseName = "Maria Dan"; 

const NotificationTable: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

    const handleAttend = (reqNo: number, attendanceDate: string, attendanceTime: string, nurseName: string) => {
        setNotifications((prevNotifications) =>
            prevNotifications.map((notification) =>
                notification.reqNo === reqNo
                    ? {
                        ...notification,
                        nurse: nurseName,
                        attendanceDate: attendanceDate,
                        attendanceTime: attendanceTime,
                    }
                    : notification
            )
        );
    };

    return (
        <div className="notification-table-container">
            <div className="table-buttons">
                <CSVButton data={notifications} fileName="notifications" />
                <LogoutButton />
            </div>

            <table className="notification-table">
                <thead>
                    <tr>
                        <th>Req No</th>
                        <th>Room</th>
                        <th>Bed</th>
                        <th>Req Date</th>
                        <th>Req Time</th>
                        <th>Nurse</th>
                        <th>Attendance Date</th>
                        <th>Attendance Time</th>
                    </tr>
                </thead>
                <tbody>
                    {notifications.map((notification) => (
                        <tr key={notification.reqNo}>
                            <td>{notification.reqNo}</td>
                            <td>{notification.room}</td>
                            <td>{notification.bed}</td>
                            <td>{notification.reqDate}</td>
                            <td>{notification.reqTime}</td>
                            <td>
                                {notification.nurse ? (
                                    notification.nurse
                                ) : (
                                    <AttendButton 
                                        reqNo={notification.reqNo} 
                                        nurseName={currentNurseName}
                                        onAttend={handleAttend} />
                                )}
                            </td>
                            <td>{notification.attendanceDate || '-'}</td>
                            <td>{notification.attendanceTime || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default NotificationTable;
