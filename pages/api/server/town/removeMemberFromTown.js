const db = require('@/pages/api/db/connection');

export default async function removeMemberFromTown(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({message: 'Method not allowed.'})
    }
    else {
        try {
            const {sessionId, userUUID, userToDelete} = req.body;
            const [selectingTownOwner] = await db.execute(
                "SELECT towns.mayor, towns.townUUID FROM towns JOIN users ON users.townUUID = towns.townUUID WHERE users.userUUID = ?",
                [userUUID]
              );
                          
            let townOwner = selectingTownOwner[0].mayor;
            const [gettingOwnerSession] = await db.execute(
                "SELECT users.sessionId, users.userUUID FROM users WHERE mcUUID = ?",
                [townOwner]
            )
            let ownerSession = gettingOwnerSession[0];
            if ((ownerSession.sessionId === sessionId) && (ownerSession.userUUID === userUUID)) {

                // User authenticated
                try {
                    const [removeUserFromTown] = await db.execute(
                        "UPDATE users SET users.townUUID = NULL WHERE userUUID = ? AND users.townUUID = ?",
                        [userToDelete, selectingTownOwner[0].townUUID]
                    );
                    if (removeUserFromTown.affectedRows > 0) {
                        return res.status(200).json({message: 'User deleted successfully.'});
                    }
                    else {
                        return res.status(403).json({message: "This user isn't in your town."});
                    }
                }
                catch (err) {
                    console.log(err);
                    return res.status(500).json({message: 'An error occured.'});
                }
            }
            else {
                return res.status(403).json({message: 'User does not have privilege.'});
            }
        }
        catch(err) {
            console.error(err);
            return res.status(500).json({message: 'An error occured.'});
        }
    }
}