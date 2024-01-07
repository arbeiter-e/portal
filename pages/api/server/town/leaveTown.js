const db = require('@/pages/api/db/connection');

export default async function leaveTown(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({message: 'Method not allowed.'}) // Method not allowed.
    }
    else {
        const {userUUID, sessionId} = req.body;
        if (userUUID && sessionId) {
            const [removingFromTown] = await db.execute(
                "UPDATE users SET users.townUUID = NULL WHERE users.userUUID = ?",
                [userUUID]
            )
            if (removingFromTown.affectedRows > 0) {
                return res.status(200).json({message: 'User left successfully.'});
            }
            else{ 
                return res.status(500).json({message: 'An unknown error has occured.'});
            }
        }
        else {
            // Either sessionId or userId have not been supplied.
            console.error("Invalid parameters", userUUID, sessionId);
            return res.status(400).json({message: 'Invalid parameters.'});
        }
    }
}