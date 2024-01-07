const db = require('@/pages/api/db/connection');
import generateUUID from "@/pages/api/utils/generateUUID";
import { checkTownOwnerServer } from "../../session/checkSession";


export default async function createJoinCode(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({message: 'Invalid method.'})
    }
    else {
        try {
            const {townUUID, sessionId} = req.body;


            const allowedToBeHere = await checkTownOwnerServer(sessionId, townUUID);


            if (allowedToBeHere === true) {
                const joinCode = (generateUUID()).substring(0, 6).toUpperCase();
                const [insertinCodeIntoDB] = await db.execute('INSERT INTO join_codes (joinCode, townUUID) VALUES (?, ?)', [joinCode, townUUID]);
                return res.status(200).json({message: 'Join code created.', joinCode: joinCode});
            }
            else {
                return res.status(201).json({message: 'Not the owner.'});
            }
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({message: 'An unknown error occured.'});
        }
    }
}