--DDL for the SQLite database
CREATE TABLE IF NOT EXISTS NurseRequests (
    request_id INTEGER PRIMARY KEY AUTOINCREMENT,   -- Request id
    room_number INT NOT NULL,                       -- Room number for the request
    bed_number INT NOT NULL,                        -- Bed number within the room
    acceptedBy INT,                                 -- Id of the nurse account handling the request
    request_date DATE NOT NULL,                     -- Date of the request
    request_time TIME NOT NULL,                     -- Time of the request
    response_date DATE,                             -- Date of the response
    response_time TIME                              -- Time of the response
);

CREATE TABLE IF NOT EXISTS Accounts (
    id INTEGER PRIMARY KEY,         -- Account id
    first_name VARCHAR(255),        -- Nurse's first name
    last_name VARCHAR(255),         -- Nurse's last name
    username VARCHAR(255),          -- Account's username
    salt_hashed_password BLOB,      -- Password+Salt combination hashed
    password_salt TEXT              -- Random characters added to password before hashing
);