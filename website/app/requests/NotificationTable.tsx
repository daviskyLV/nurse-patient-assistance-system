"use client";

import React, { useState } from 'react';
import AttendButton from './buttons/AttendButton';
import CSVButton from './buttons/CSVButton'; 
import LogoutButton from './buttons/LogoutButton';

export type Notification = {
    reqNo: number;
    room: number;
    bed: number;
    reqDate: string;
    reqTime: string;
    nurse?: string;
    attendanceDate?: string;
    attendanceTime?: string;
};

type NotificationTableProps = {
    currentNurseName: string;
    currentNurseId: number;
    initialNotifications: Notification[];
}

const NotificationTable: React.FC<NotificationTableProps> = ({
    currentNurseName, initialNotifications, currentNurseId
}) => {
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

    const handleAttend = (reqNo: number, attendanceDate: string, attendanceTime: string, nurseName: string) => {
        // updating the modified row
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
                                        onAttend={handleAttend}
                                        nurseId={currentNurseId} />
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
