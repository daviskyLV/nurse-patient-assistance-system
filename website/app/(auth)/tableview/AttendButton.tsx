"use client";

import React from 'react';

interface AttendButtonProps {
    reqNo: number;
    nurseName: string;
    onAttend: (requestNumber: number, attendanceDate: string, attendanceTime: string, nurseName: string) => void;
}

const AttendButton: React.FC<AttendButtonProps> = ({ reqNo, nurseName, onAttend }) => {
    const handleAttend = () => {
        const currentDate = new Date();
        const dateStr = currentDate.toLocaleDateString();
        const timeStr = currentDate.toLocaleTimeString();

        onAttend(reqNo, dateStr, timeStr, nurseName);
    };

    return <button onClick={handleAttend}>+</button>;
};

export default AttendButton;
