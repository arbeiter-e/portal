const db = require('@/pages/api/db/connection');


export default async function getNotifications(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({message: 'Method not allowed.'}) // Method not allowed
    }
    else {
        try {
            const {sessionId, userUUID} = req.body;

            const [gettingNotifications] = await db.execute(
                "SELECT allianceRequests.allianceRequestId, allianceRequests.townUUID, allianceRequests.fromTownUUID, allianceRequests.type " +
                "FROM allianceRequests " +
                "JOIN users ON users.townUUID = allianceRequests.townUUID " +
                "WHERE users.sessionId = ? AND users.userUUID = ? " +
                "ORDER BY dateCreated ASC;",
                [sessionId, userUUID]
            );

            console.log(gettingNotifications);

            return res.status(200).json({message: 'Thank you!'});
        }
        catch(err) {
            console.log(err);
            return res.status(500).json({message: 'Internal server error.'});
        }
    }
}