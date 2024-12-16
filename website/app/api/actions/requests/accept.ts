"use server"

import { connectToDatabase } from "../../db-connection"

export async function acceptPatientRequest(
    requestId: number, nurseId: number, acceptedDatetime: Date
) {
    const db = connectToDatabase()
    db.acceptPatientRequest(
        requestId, nurseId, acceptedDatetime
    )
    db.close()
}