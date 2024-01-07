import { generateUUID } from "@/pages/api/utils/generateUUID";
const db = require('@/pages/api/db/connection');


export default async function signupStage2Backend(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({message: 'Method not allowed.'}); // Method not allowed.
    }
    else {
        try {
            const { userId } = req.body;

            const [checkingIfLinked] = await db.execute('SELECT mcUUID FROM users WHERE userUUID = ?', [userId]);
            console.log(checkingIfLinked);
            if (checkingIfLinked[0].mcUUID) {
                return res.status(200).json({message: 'Linked to account.'});
            }
            else {
                return res.status(201).json({message: 'Not yet linked.'});
            }
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({message: 'An internal error occured.'});
        }
    }
}
