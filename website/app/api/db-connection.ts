import path from "path";
import sqlite3 from "sqlite3";
import fs from "fs";
sqlite3.verbose();

const dbPath = path.join(process.cwd(), "database.db");

export type Database = {
    close(): void,
    
}

/**
 * Gets a connection to the database and creates the tables if necessary
 */
export const connectToDatabase = (): Database => {
    const db = new sqlite3.Database(
        dbPath,
        sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
        (err: Error | null) => {
            if (err) {
                console.error(err);
            }
            console.log("Connected to the profile database.");
        }
    )

    const dbDDL = fs.readFileSync(process.cwd() + '/app/database/ddl.sql', 'utf8');
    db.run(
        dbDDL,
        (err: Error | null) => {
            if (err) {
                console.warn("Failed to run database DDL!");
                console.warn(err);
            }
            console.log("Database DDL successfully ran");
        }
    )

    const closeDb = () => {
        db.close()
    }

    return {
        close: closeDb
    };
}