import { connectToDatabase } from "../db-connection"

const iotKey = process.env.IOT_SECRET ? process.env.IOT_SECRET : "test"

export async function POST(request: Request) {
    const patientRequest = await request.json()
    
    // Checking for invalid requests
    if (!('room' in patientRequest && typeof patientRequest.room === "number" &&
        'bed' in patientRequest && typeof patientRequest.bed === "number" &&
        'secret' in patientRequest && typeof patientRequest.secret === "string"
    )) {
        return new Response(null, {status: 400})
    }
    if (patientRequest.secret !== iotKey) {
        return new Response(null, {status: 401})
    }
    

    // Creating the request
    const dateNow = new Date(Date.now())
    const db = connectToDatabase()
    db.createPatientRequest(
        patientRequest.room,
        patientRequest.bed,
        dateNow
    )
    db.close()

    // TODO: Return the newly made request
    return new Response(null, {status: 201})
}