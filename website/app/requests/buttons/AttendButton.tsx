"use client";

import React from 'react';
import { acceptPatientRequest } from '@/app/api/actions/requests/accept'; 

interface AttendButtonProps {
    reqNo: number;
    nurseId: number;
    nurseName: string;
    onAttend: (requestNumber: number, attendanceDate: string, attendanceTime: string, nurseName: string) => void;
}

const AttendButton: React.FC<AttendButtonProps> = ({ reqNo, nurseName, nurseId, onAttend }) => {
    const handleAttend = () => {
        const currentDate = new Date();
        const dateStr = currentDate.toLocaleDateString();
        const timeStr = currentDate.toLocaleTimeString();

        // accepting request on the server
        acceptPatientRequest(reqNo, nurseId, currentDate)
        onAttend(reqNo, dateStr, timeStr, nurseName);
    };

    return <button onClick={handleAttend}>+</button>;
};

export default AttendButton;
