const db = require('@/pages/api/db/connection');

export default async function checkSession(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({message: 'Invalid method.'});
    }
    else {
        try {
            const {sessionId, userId} = req.body;

            const [gettingDBSession] = await db.query('SELECT sessionId FROM users WHERE userUUID = ?', [userId]);
            if (sessionId === gettingDBSession[0]?.sessionId) {
                return res.status(200).json({message: 'Valid sesion'})
            }
            else {
                return res.status(201).json({message: 'Invalid session'});
            }
        }
        catch (err) {
            console.error(err);
        }
    }
}

export async function checkSessionFromServer(sessionId, userId) {
    console.log(sessionId, userId);
    try {
        const [gettingDBSession] = await db.query('SELECT sessionId FROM users WHERE userUUID = ?', [userId]);
        if (sessionId === gettingDBSession[0]?.sessionId) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (err) {
        console.error(err);
        return false;
    }
}

export async function checkTownOwnerServer(sessionId, townUUID) {
    try {
        const [gettingUserData] = await db.execute('SELECT users.mcUUID, nations.owner FROM users, nations WHERE users.townUUID = nations.townUUID AND sessionId = ? AND users.townUUID = ?', [sessionId, townUUID]);

        console.log(gettingUserData[0]);

        if (gettingUserData[0].mcUUID === gettingUserData[0].owner) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (err) {
        console.error(err);
        return false;
    }
}