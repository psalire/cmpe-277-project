
import mysql from "mysql2";

export default class MySQLDatabase {

    private static connection: mysql.Connection = mysql.createConnection({
        host: "localhost",
        user: "Yappa_user",
        password: "PtNxHCk9",
        database: "Yappa",
    });

    private constructor() { }

    public static selectUser(email: string, username: string, callback: any) {
        MySQLDatabase.connection.execute(
            "SELECT * FROM Users WHERE username=? OR email=?",
            [username, email],
            callback
        )
    }

    public static insertUser(
        email: string,
        username: string,
        password: Buffer,
        salt: Buffer,
        phone?: string,
        callback?: any,
    ): void {
        var query;
        var args;
        if (phone === undefined) {
            query = "INSERT INTO Users(email, username, salt, password) VALUES(?,?,?,?)";
            args = [email, username, salt, password];
        }
        else {
            query = "INSERT INTO Users(email, username, salt, password, phone) VALUES(?,?,?,?,?)"
            args = [email, username, salt, password, phone];
        }
        MySQLDatabase.connection.execute(
            query,
            args,
            callback ? callback : (
                (err, results, fields) => {
                    if (err) {
                        console.error(err);
                    }
                }
            )
        )
    }

    public static getUsernameSaltPassword(username: string, callback: any): void {
        MySQLDatabase.connection.execute(
            "SELECT salt, password FROM Users WHERE username=?",
            [username],
            callback
        );
    }
}
