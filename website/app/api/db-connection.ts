import path from "path";
import sqlite3 from "sqlite3";
import fs from "fs";
import { User, isUser } from "../(utils)/User";
import { isError, isNumber, isObject } from "../(utils)/utilFuncs";
sqlite3.verbose();

const dbPath = path.join(process.cwd(), "database.db");

export type Database = {
    close(): void,
    usernameExistsAsync(
        username: string
    ): Promise<boolean | Error>,
    userInfoAsync(
        username: string
    ): Promise<User | Error>
    createAccount(
        username: string,
        passwordWithSaltHash: Buffer,
        passwordSalt: string,
        firstName: string,
        lastName: string,
        callback: ((err: Error | null) => void) | undefined
    ): void
}

const fetchAll = async (
    db: sqlite3.Database,
    sql: string,
    params: any
) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err: Error | null, rows: unknown[]) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
};
  
const fetchFirst = async (
    db: sqlite3.Database,
    sql: string,
    params: any
) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err: Error | null, row: unknown) => {
            if (err) reject(err);
            resolve(row);
        });
    });
};

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
    db.exec(
        dbDDL,
        (err: Error | null) => {
            if (err) {
                console.warn("Failed to run database DDL!");
                console.warn(err);
            }
            console.log("Database DDL successfully ran");
        }
    )

    /// Defining returned Database type functions
    const closeDb = (): void => {
        db.close()
    }

    const usernameExistsAsync = async (
        username: string
    ): Promise<boolean | Error> => {
        try {
            const row = await fetchFirst(db,
                `SELECT COUNT(username) AS count FROM Accounts WHERE username = ?;`,
                [username]
            );
            
            // Parsing row type to object with count as number
            if (!isObject(row)) {return new Error("Unknown error!")}
            if (!("count" in row && isNumber(row.count))) {return new Error("Unknown error!")}

            if (row.count as number > 0) {
                return true
            }
            return false;
        } catch (err) {
            if (isError(err)) {
                return err
            }

            console.warn("Unknown error!")
            console.warn(err)
        }

        return new Error("Unknown error!")
    }

    const userInfoAsync = async (
        username: string
    ): Promise<User | Error> => {
        try {
            const row = await fetchFirst(db,
                `SELECT id, username, first_name as firstName, last_name as lastName, salt_hashed_password as password, password_salt as passwordSalt
                FROM Accounts
                WHERE username = ?;`,
                [username]
            );
            
            if (!isObject(row)) {return new Error("Unknown error!")}
            if (!isUser(row)) {return new Error("Unknown error!")}

            return row as User
        } catch (err) {
            if (isError(err)) {
                return err
            }

            console.warn("Unknown error!")
            console.warn(err)
        }

        return new Error("Unknown error!")
    }

    const createAccount = (
        username: string,
        passwordWithSaltHash: Buffer,
        passwordSalt: string,
        firstName: string,
        lastName: string,
        callback: ((err: Error | null) => void) | undefined
    ) => {
        db.run(`
            INSERT INTO Accounts (first_name, last_name, username, password_salt, salt_hashed_password)
            VALUES (?, ?, ?, ?, ?);
            `,
            [firstName, lastName, username, passwordSalt, passwordWithSaltHash],
            callback
        )
    }

    return {
        close: closeDb,
        usernameExistsAsync,
        createAccount,
        userInfoAsync
    };
}