import { checkSessionFromServer } from "../../session/checkSession";
import checkPlayersTownServer from "../utils/checkPlayersTown";
const db = require('@/pages/api/db/connection');
import { generateTownUUIDServer } from "../utils/generateUUID";
import getPlayerUUIDFromSession from "../utils/getPlayerUUIDFromSession";
import {getChunkCorners, getChunkCenter} from '@/pages/api/utils/chunkUtils';
import checkIfChunksClaimed from '@/pages/api/server/utils/checkIfChunkClaimed';
import { generateClaimUUIDServer } from "../utils/generateUUID";


export default async function createTown (req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({message: 'Method not allowed.'}) // Method not allowed.
    }
    else {
        console.log('hello!');
        try {
            const {
                userId, 
                sessionId, 
                townName, 
                townUUID, 
                townDescription, 
                townHomeX, 
                townHomeY, 
                townHomeZ, 
                chunkX, 
                chunkZ
            } = req.body;

            if ((townHomeX < 14171) && (townHomeX > 14023)) {
                if ((townHomeZ < -7653) && (townHomeZ > -7831)) {
                    console.log("Town is in spawn.");
                    return res.status(201).json({message: 'Town is spawn!'});
                }
            }

            const isValidSession = await checkSessionFromServer(sessionId, userId);
            if (isValidSession === true) {
                const isPlayerInTown = await checkPlayersTownServer(sessionId, userId);

                console.log('Player is in town: ', isPlayerInTown);


                if (isPlayerInTown !== false) {
                    return res.status(201).json({message: 'Player is already a member of a town.'});
                }
                else if (isPlayerInTown === null) {
                    return res.status(500).json({message: 'An error occured.'});
                }
                else {
                        const playersUUID = await getPlayerUUIDFromSession(sessionId, userId);
                        try {

                        console.log(req.body);
                        
                        try {
                        const [puttingTownIntoDB] = await db.query('INSERT INTO towns (townUUID, name, description, apiPass, mayor, homeX, homeY, homeZ, iconX, iconZ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        [ 
                            townUUID, 
                            townName, 
                            townDescription, 
                            await generateTownUUIDServer(),
                            playersUUID,
                            townHomeX, 
                            townHomeY, 
                            townHomeZ, 
                            townHomeX,
                            townHomeZ,
                        ]);
                    
                        }
                        catch (err) {
                            console.log(err);
                            return res.status(500).json({message: 'An error occured.'});
                        }
                        
                        try {
                            const [puttingPlayerInTown] = await db.query('UPDATE users SET townUUID = ? WHERE userUUID = ?', [townUUID, userId]);
                            console.log(puttingPlayerInTown);
                            return res.status(200).json({message: 'Successfully created town.'});
                        }
                        catch (err) {
                            console.log(err);
                            return res.status(500).json({message: 'An error occured.'})
                        }
                    }
                    catch(err) {
                        console.error(err);
                        return res.status(500).json({message: 'An error occured.'});
                    }
                }
            }
            else {
                return res.status(403).json({message: 'Forbidden.'});
            }
        }
        catch (err) {
            console.error(err);
            return res.status(500);
        }
    }
}