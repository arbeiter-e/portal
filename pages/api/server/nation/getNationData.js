const db = require('@/pages/api/db/connection');

export default async function getNationMembersFromUUID(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: 'Method not allowed.' });
    } else {
        try {
            const { nationUUID } = req.query;
            if (!nationUUID) {
                return res.status(400).json({ message: 'Invalid parameters.', nationUUID: nationUUID ?? '' });
            } else {
                const [gettingNationData] = await db.query("SELECT * FROM nations WHERE nationUUID = ?", [nationUUID]);
                if (!gettingNationData[0]?.name) {
                    return res.status(422).json({ message: 'Nation not found.' });
                } else {
                    const [gettingCapitalData] = await db.query("SELECT * FROM towns WHERE townUUID = ?", [gettingNationData[0]?.capital]);
                    if (gettingCapitalData[0]?.name) {
                        const [gettingUsers] = await db.query("SELECT userUUID, username, mcUUID FROM users WHERE townUUID = ?", [gettingNationData[0]?.capital]);
                        const [gettingNumberofClaims] = await db.query("SELECT COUNT(*) as count FROM claimAreas WHERE nationUUID = ?", [nationUUID]);
                        const [gettingNumberofCapitalClaims] = await db.query("SELECT COUNT(*) as count FROM claimAreas WHERE townUUID = ?", [gettingNationData[0]?.capital]);
                        const [gettingAllTowns] = await db.query("SELECT * FROM towns WHERE nationUUID = ? AND townUUID != ?", [nationUUID, gettingNationData[0]?.capital]);

                        // Loop through gettingAllTowns and layout in a similar way to capital, but in the towns: {} object. It must include all of the members too.
                        const townsData = {};
                        for (const town of gettingAllTowns) {
                            const [townMembers] = await db.query("SELECT userUUID, username, mcUUID FROM users WHERE townUUID = ?", [town.townUUID]);
                            const [gettingNumberofClaims] = await db.query("SELECT COUNT(*) as count FROM claimAreas WHERE townUUID = ?", [town.townUUID]);
                            townsData[town.townUUID] = {
                                townUUID: town.townUUID,
                                name: town.name,
                                description: town.description,
                                mayor: {
                                    userUUID: gettingCapitalData[0]?.mayor ? 
                                        gettingUsers.find(user => user.mcUUID === town?.mayor)?.userUUID
                                        : null,
                                    username: gettingCapitalData[0]?.mayor ?
                                        gettingUsers.find(user => user.mcUUID === town?.mayor)?.username
                                        : null,
                                    mcUUID: town?.mayor,
                                },
                                upkeep: town.upkeep,
                                claimCount: gettingNumberofClaims[0].count,
                                homeX: town.homeX,
                                homeY: town.homeY,
                                homeZ: town.homeZ,
                                iconX: town.iconX,
                                iconZ: town.iconZ,
                                members: townMembers,
                            };
                        }

                        const finalData = {
                            balance: gettingNationData[0]?.balance,
                            outgoings: gettingNationData[0]?.outgoings,
                            claimCount: gettingNumberofClaims[0].count,
                            members: ((gettingUsers?.length ?? 0) + (townsData?.members?.length ?? 0)) ?? 0,
                            capital: {
                                townUUID: gettingCapitalData[0]?.townUUID,
                                name: gettingCapitalData[0]?.name,
                                description: gettingCapitalData[0]?.description,
                                mayor: {
                                    userUUID: gettingCapitalData[0]?.mayor ? 
                                        gettingUsers.find(user => user.mcUUID === gettingCapitalData[0]?.mayor)?.userUUID
                                        : null,
                                    username: gettingCapitalData[0]?.mayor ?
                                        gettingUsers.find(user => user.mcUUID === gettingCapitalData[0]?.mayor)?.username
                                        : null,
                                    mcUUID: gettingCapitalData[0]?.mayor,
                                },
                                upkeep: gettingCapitalData[0]?.upkeep,
                                claimCount: gettingNumberofCapitalClaims[0]?.count,
                                homeX: gettingCapitalData[0]?.homeX,
                                homeY: gettingCapitalData[0]?.homeY,
                                homeZ: gettingCapitalData[0]?.homeZ,
                                iconX: gettingCapitalData[0]?.iconX,
                                iconZ: gettingCapitalData[0]?.iconZ,
                                members: gettingUsers,
                            },
                            towns: townsData,
                        };
                        
                        return res.status(200).json(finalData);
                        
                    }
                }
            }
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    }
}
