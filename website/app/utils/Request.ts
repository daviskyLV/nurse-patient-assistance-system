export type PatientRequest = {
    id?: number,
    roomNumber: number,
    bedNumber: number,
    acceptedBy?: number | string, // nurse Id or username, only set if request is accepted
    requestDateTime: Date,
    responseDateTime?: Date
}

export function isPatientRequest(obj: unknown): obj is PatientRequest {
    return typeof obj === 'object' && obj !== null &&
    'roomNumber' in obj && typeof obj.roomNumber === "number" &&
    'bedNumber' in obj && typeof obj.bedNumber === "number" &&
    'requestDateTime' in obj && typeof obj.requestDateTime === "object" && obj.requestDateTime !== null &&
    (!("id" in obj) || ("id" in obj && typeof obj.id === "number")) &&
    (!("responseDateTime" in obj) || ("responseDateTime" in obj && typeof obj.responseDateTime === "object" && obj.responseDateTime !== null));
}