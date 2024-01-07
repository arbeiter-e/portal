import generateUUID from "@/pages/api/utils/generateUUID";
import { useReducer } from "react";
const bcrypt = require('bcrypt');
const usernameRegex = /^[a-zA-Z0-9_]+$/;
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{8,}$/;
const db = require('@/pages/api/db/connection');

export default async function loginBackend(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: 'Method not allowed.' });
    } else {
        try {
            const { username, password } = req.body;
            const [gettingPasswordHash] = await db.query('SELECT password_hash, userUUID FROM users WHERE username = ?', [username]);
            console.log(gettingPasswordHash);
            if (!gettingPasswordHash || gettingPasswordHash.length === 0) {
                return res.status(401).json({ message: 'Invalid username or password.' });
            }

            const userId = gettingPasswordHash[0].userUUID;
            const passwordMatch = await bcrypt.compare(password, gettingPasswordHash[0].password_hash);

            console.log(userId, passwordMatch);

            if (passwordMatch) {
                const sessionId = generateUUID();

                try {
                    // Update the session ID in the database
                    await db.query('UPDATE users SET sessionId = ? WHERE userUUID = ?', [sessionId, userId]);

                    return res.status(200).json({ message: `Authentication successful. Welcome, ${username}`, sessionId, userId });
                } catch (err) {
                    console.error(err);
                    return res.status(500).json({ message: "Authentication successful, but couldn't store session data." });
                }
            } else {
                return res.status(401).json({ message: 'Invalid username or password.' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    }
}
