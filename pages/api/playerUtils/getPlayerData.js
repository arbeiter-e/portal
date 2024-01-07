const db = require('@/pages/api/db/connection');

export default async function getPlayerData(req, res) {
    try {
        if (req.method !== "GET") {
            return res.status(405).json({ message: 'Method not allowed.' });
        }

        const { userId, sessionId } = req.query;

        if (!userId || !sessionId) {
            return res.status(400).json({ message: 'Invalid parameters.', userId: userId || '', sessionId: sessionId || '' });
        }
        try {
            const [getUserData] = await db.query('SELECT users.userUUID, users.username, users.mcUUID, users.townUUID FROM users WHERE userUUID = ? AND sessionId = ?', [userId, sessionId]);

            if (!getUserData[0]?.userUUID) {
                return res.status(403).json({ message: 'Unauthorised' });
            }

            let getTownData = [];
            if (getUserData[0]?.townUUID) {
                [getTownData] = await db.query('SELECT towns.name, towns.description, towns.mayor, towns.nationUUID FROM towns WHERE towns.townUUID = ?', [getUserData[0].townUUID]);
            }

            let getNationData = [];
            if (getTownData[0]?.name) {
                [getNationData] = await db.query('SELECT nations.nationUUID, nations.name, nations.description, nations.ideology, nations.capital, nations.owner, nations.founder, nations.mapHexFill, nations.mapHexLine FROM nations WHERE nations.nationUUID = ?', [getTownData[0].nationUUID]);
            }

            let capitalName = '';
            let capitalDescription = '';
            let capitalMayor = '';

            if (getNationData[0]?.capital === getUserData[0].townUUID) {
                capitalName = getTownData[0].name;
                capitalDescription = getTownData[0].description;
                capitalMayor = getTownData[0].mayor;
            } else if (getNationData[0]?.capital) {
                try {
                    const [getCapitalData] = await db.query('SELECT towns.name, towns.description, towns.mayor FROM towns WHERE townUUID = ?', [getNationData[0]?.capital]);
                    capitalName = getCapitalData[0]?.name || '';
                    capitalDescription = getCapitalData[0]?.description || '';
                    capitalMayor = getCapitalData[0]?.mayor || '';
                } catch (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'An error occurred. (5)' });
                }
            }

            const finalData = {
                user: {
                    userUUID: getUserData[0].userUUID,
                    username: getUserData[0].username,
                    mcUUID: getUserData[0].mcUUID || '',
                    townUUID: getUserData[0].townUUID || 'None',
                },
                town: {
                    name: getTownData[0]?.name || '',
                    description: getTownData[0]?.description || '',
                    mayor: getTownData[0]?.mayor || '',
                    nationUUID: getTownData[0]?.nationUUID || '',
                },
                nation: {
                    nationUUID: getNationData[0]?.nationUUID || '',
                    name: getNationData[0]?.name || 'None',
                    description: getNationData[0]?.description || '',
                    ideology: getNationData[0]?.ideology || '',
                    capital: getNationData[0]?.capital || '',
                    owner: getNationData[0]?.owner || '',
                    founder: getNationData[0]?.founder || '',
                    mapHexFill: getNationData[0]?.mapHexFill || '',
                    mapHexLine: getNationData[0]?.mapHexLine || '',
                },
                capital: {
                    name: capitalName,
                    description: capitalDescription,
                    mayor: capitalMayor,
                },
            };

            return res.status(200).json(finalData);
        } catch (err) {
            console.error(err);
            return res.status(403).json({ message: 'Forbidden.' });
        }
    } catch (err) {
        console.error(err);
        return res.status(403).json({message: 'Forbidden.'});
    }
}
