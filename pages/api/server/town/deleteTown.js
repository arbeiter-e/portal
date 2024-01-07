const db = require('@/pages/api/db/connection');


export default async function deleteTown(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({message: 'Method not allowed'}) // Method not allowed.
    }
    else {
        try {
            const {userUUID, sessionId} = req.body;

            console.log(userUUID, sessionId);

            const [gettingUserInfo] = await db.execute(

                "SELECT users.sessionId, users.userUUID, towns.townUUID FROM users, towns WHERE towns.owner = users.mcUUID AND users.userUUID = ?"
            
            , [userUUID]);


            console.log(gettingUserInfo[0]);

            if (gettingUserInfo[0]?.sessionId === sessionId) {
                console.log("hey");
                const [gettingClaims] = await db.execute(
                    "SELECT claimUUID FROM claimAreas WHERE townUUID = ?",
                    [gettingUserInfo[0].townUUID]
                );
                for (let i = 0; i < gettingClaims.length; i++) {
                    const [deletingClaim] = await db.execute(
                        "DELETE FROM claimAreas WHERE claimUUID = ?",
                        [gettingClaims[i].claimUUID]
                    )
                }

                const [insertingToDelete] = await db.execute(
                    "INSERT INTO deleteClaims (townUUID) VALUES (?)",
                    [gettingUserInfo[0].townUUID]
                )

                const [insertIntoDeleteMarker] = await db.execute(
                    "INSERT INTO deleteMarker (townUUID) VALUES (?)",
                    [gettingUserInfo[0].townUUID]
                )
                
                const [removingFromTransactions] = await db.execute(
                    "DELETE FROM transactions WHERE townUUID = ?",
                    [gettingUserInfo[0].townUUID]
                );

                const [changingUsersTowns] = await db.execute(
                    "UPDATE users SET townUUID = NULL WHERE townUUID = ?",
                    [gettingUserInfo[0].townUUID]
                )

                const [removingTown] = await db.execute(
                    "DELETE FROM towns WHERE townUUID = ?",
                    [gettingUserInfo[0].townUUID]
                );

                console.log(removingFromTransactions);

                return res.status(200).json({message: 'Town deleted.'});
            }
            else {
                return res.status(403).json({message: 'Unauthorised.'});
            }
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({message: 'Internal server error.'});
        }
    }
}