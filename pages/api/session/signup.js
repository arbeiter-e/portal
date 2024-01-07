// Import statements...
import generateUUID from "@/pages/api/utils/generateUUID";
const bcrypt = require('bcrypt');
const usernameRegex = /^[a-zA-Z0-9_]+$/;
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{8,}$/;
const db = require('@/pages/api/db/connection');

async function createUserInDatabase(username, password) {
    const password_hash = await bcrypt.hash(password, 10);
    const userId = generateUUID();
    const sessionId = generateUUID();

    await db.query('INSERT INTO users (userUUID, username, password_hash, sessionId) VALUES (?, ?, ?, ?)', [userId, username, password_hash, sessionId]);

    return { userId, username, password_hash };
}

export default async function signupBackend(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: 'Method not allowed.' });
    }

    try {
        const { username, password, isTermsAccepted } = req.body;

        const [existingUser] = await db.query('SELECT username, mcUUID, password_hash, userUUID FROM users WHERE username = ?', [username]);
        console.log(existingUser);
        if (existingUser.length > 0) {
            const passwordMatch = await bcrypt.compare(password, existingUser[0].password_hash);
            if ((passwordMatch === true) && (!existingUser[0]?.mcUUID)) {
                return res.status(203).json({message: 'Welcome back, lets get you linked.', userId: existingUser[0].userUUID});
            }
            else {
                return res.status(409).json({ message: 'Username already taken.' });
            }
        }
        else {
            if (passwordRegex.test(password) && usernameRegex.test(username)) {
                if (isTermsAccepted === true) {
                    const newUser = await createUserInDatabase(username, password);
                    return res.status(200).json({ message: 'User successfully created!', ...newUser });
                } else {
                    return res.status(400).json({ message: 'You must accept the Privacy Policy to continue.' });
                }
            } else {
                return res.status(400).json({ message: 'Invalid Username or Password.' });
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}
