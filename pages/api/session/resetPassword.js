const bcrypt = require('bcrypt');
const db = require('@/pages/api/db/connection');
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{8,}$/;
const usernameRegex = /^[a-zA-Z0-9_]+$/;

export default async function resetPassword(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: 'Method not allowed.' });
    } else {
        try {
            const { token, pass } = req.body;

            // Validate password against regex
            if (!passwordRegex.test(pass)) {
                return res.status(400).json({ message: 'Password must be at least 8 characters, contain at least one digit and at least one special character.' });
            }

            const password_hash = await bcrypt.hash(pass, 10);

            const [gettingUserUUID] = await db.execute("SELECT userUUID, id FROM passwordReset WHERE resetToken = ?", [token]);

            if (gettingUserUUID.length > 0) {
                const [removingFromTable] = await db.execute("DELETE FROM passwordReset WHERE id = ?", [gettingUserUUID[0].id]);
                const [updatePasswordResult] = await db.execute("UPDATE users SET password_hash = ? WHERE userUUID = ?", [password_hash, gettingUserUUID[0].userUUID]);

                if (updatePasswordResult.affectedRows > 0) {
                    return res.status(200).json({ message: 'Password reset successfully.' });
                } else {
                    return res.status(500).json({ message: 'Failed to update password.' });
                }
            } else {
                return res.status(403).json({ message: 'Unauthorized.' });
            }
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error.', error: err.message });
        }
    }
}
