const db = require('@/pages/api/db/connection')

export default async function checkPlayersTownServer(sessionId, userId) {
    try {
        const [gettingPlayersTown] = await db.query('SELECT townUUID FROM users WHERE sessionId = ? AND userUUID = ?', [sessionId, userId]);

        if (gettingPlayersTown[0].townUUID !== null) {
            return gettingPlayersTown[0].townUUID;
        }
        else {
            return false;
        }
    }
    catch(err) {
        console.error(err);
        return null;
    }
}