const db = require('@/pages/api/db/connection');

export default async function getPlayerUUIDFromSession(sessionId, userId) {
    try {
        const [gettingUUID] = await db.query('SELECT mcUUID FROM users WHERE sessionId = ? AND userUUID = ?', 
        [
            sessionId, userId
        ]);
        console.log('HELLO UGHHHH', gettingUUID[0]);
        return gettingUUID[0].mcUUID;
    }
    catch(err) {
        console.log(err);
        return;
    } 
} 