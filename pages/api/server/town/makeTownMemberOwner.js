const db = require('@/pages/api/db/connection');


export default async function makeTownMemberOwner(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({message: 'Method not allowed.'}) // Method not allowed.
    }
    else {
        try {
            const {userToPromote, sessionId, userUUID} = req.body;

            if (userToPromote && sessionId && userUUID) {
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
                if ((ownerSession.sessionId === sessionId) && (ownerSession.userUUID === userUUID) && (userToPromote !== ownerSession.userUUID)) {

                    // User authenticated
                    try {
                        console.log(2)
                        console.log(userToPromote, userUUID, selectingTownOwner[0].mayor)

                        const [isUserInTown] = await db.execute(
                            "SELECT townUUID FROM users WHERE mcUUID = ?",
                            [userToPromote]
                        );

                        if (isUserInTown[0]?.townUUID === selectingTownOwner[0].townUUID) {
                            const [promoteUser] = await db.execute(
                                "UPDATE towns SET towns.mayor = ? WHERE mayor = ? AND towns.townUUID = ?",
                                [userToPromote, selectingTownOwner[0].mayor, selectingTownOwner[0].townUUID]
                            );
                            if (promoteUser.affectedRows > 0) {
                                return res.status(200).json({message: 'User promoted successfully.'});
                            }
                            else {
                                return res.status(500).json({message: 'Uh oh!'});
                            }
                        }
                        else {
                            return res.status(403).json({message: "What are you even doing? The user isn't in your town."});
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
            else {
                return res.status(400).json({message: 'Incorrect parameters.'})
            }
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({message: 'Internal server error'});
        }
    }
}