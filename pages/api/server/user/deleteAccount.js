import axios from 'axios';

const db = require('@/pages/api/db/connection');


export default async function deleteAccount (req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({message: 'Method not allowed.'})// Method not allowed.
    }
    else {
        try {
            const {userUUID, sessionId} = req.body;

            if (userUUID, sessionId) {
                const [gettingUserData] = await db.execute("SELECT users.mcUUID, towns.owner, towns.townUUID FROM towns, users WHERE towns.townUUID = users.townUUID AND users.userUUID = ? AND users.sessionId = ?",
                [userUUID, sessionId])
                console.log(gettingUserData);
                if (gettingUserData.length > 0){ 
                    if (gettingUserData[0].mcUUID === gettingUserData[0].owner) {
                        const [gettingNextUser] = await db.execute("SELECT users.mcUUID FROM users WHERE users.townUUID = ?", [gettingUserData[0].townUUID]);
                        if (gettingNextUser.length > 1) {
                            let foundUUID = "";
                            let index = 0
                            while (foundUUID === "") {
                                if (gettingNextUser[index]?.mcUUID !== gettingUserData[0].mcUUID) {
                                    let foundUUID = gettingUserData[index].mcUUID;
                                }
                                index++;
                            }
                            
                            const [settingNewOwner] = await db.execute("UPDATE towns SET towns.owner = ? WHERE towns.townUUID = ?", [foundUUID, gettingUserData[0].townUUID]);

                            const [deletingUser] = await db.execute("DELETE FROM users WHERE userUUID = ?", [userUUID]);

                            if (deletingUser.affectedRows > 0) {
                                return res.status(200).json({message: 'Account deleted. Changed town owner.'});
                            }
                            else {
                                return res.status(500).json({message: 'Internal server error.'});
                            }
                        }
                        else {
                            const [gettingClaims] = await db.execute(
                                "SELECT claimUUID FROM claimAreas WHERE townUUID = ?",
                                [gettingUserData[0].townUUID]
                            );
                            for (let i = 0; i < gettingClaims.length; i++) {
                                const [deletingClaim] = await db.execute(
                                    "DELETE FROM claimAreas WHERE claimUUID = ?",
                                    [gettingClaims[i].claimUUID]
                                )
                            }
            
                            const [insertingToDelete] = await db.execute(
                                "INSERT INTO deleteClaims (townUUID) VALUES (?)",
                                [gettingUserData[0].townUUID]
                            )
            
                            const [insertIntoDeleteMarker] = await db.execute(
                                "INSERT INTO deleteMarker (townUUID) VALUES (?)",
                                [gettingUserData[0].townUUID]
                            )
                            
                            const [removingFromTransactions] = await db.execute(
                                "DELETE FROM transactions WHERE townUUID = ?",
                                [gettingUserData[0].townUUID]
                            );
            
                            const [changingUsersTowns] = await db.execute(
                                "UPDATE users SET townUUID = NULL WHERE townUUID = ?",
                                [gettingUserData[0].townUUID]
                            )
            
                            const [removingTown] = await db.execute(
                                "DELETE FROM towns WHERE townUUID = ?",
                                [gettingUserData[0].townUUID]
                            );

                            const [deletingUser] = await db.execute("DELETE FROM users WHERE userUUID = ?", [userUUID]);

                            if (deletingUser.affectedRows > 0) {
                                return res.status(200).json({message: 'Account deleted. Town deleted.'});
                            }
                            else {
                                return res.status(500).json({message: 'Internal server error.'});
                            }
                        }
                    }
                    else if (gettingUserData[0]?.mcUUID) {
                        const [deletingUser] = await db.execute("DELETE FROM users WHERE userUUID = ?", [userUUID]);
                        return res.status(200).json({message: 'Account deleted.'});
                    }
                }                
                else {
                    return res.status(403).json({message: 'Forbidden.'})
                }
            }
            else {
                return res.status(304).json({message: 'Invalid parameters.'});
            }
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({message: 'Internal server error.'});
        }
    }
}