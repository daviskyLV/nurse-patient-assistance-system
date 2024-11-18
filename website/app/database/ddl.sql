--DDL for the SQLite database
CREATE TABLE IF NOT EXISTS NurseRequests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,           -- Request id
    room_number INT NOT NULL,                       -- Room number for the request
    bed_number INT NOT NULL,                        -- Bed number within the room
    acceptedBy INT,                                 -- Id of the nurse account handling the request
    request_timestamp INT NOT NULL,                 -- Request timestamp in seconds since epoch
    response_timestamp INT,                         -- Response timestamp in seconds since epoch
    FOREIGN KEY(acceptedBy) REFERENCES Accounts(id)
);

CREATE TABLE IF NOT EXISTS Accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,   -- Account id
    first_name VARCHAR(255),                -- Nurse's first name
    last_name VARCHAR(255),                 -- Nurse's last name
    username VARCHAR(255) UNIQUE,           -- Account's username
    salt_hashed_password BLOB,              -- Password+Salt combination hashed
    password_salt TEXT                      -- Random characters added to password before hashing
);