const db = require('@/pages/api/db/connection');
import generateUUID from "@/pages/api/utils/generateUUID";


export default async function forgotPassword1(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({message: 'Method not allowed.'})
    }
    else {
        try {
        const {username} = req.body;
        
        const [gettingUsername] = await db.execute("SELECT userUUID, mcUUID FROM users WHERE username = ?", [username]);

        if (gettingUsername.length > 0) {
            const resetToken = generateUUID();
            const [deletingOldRequests] = await db.execute("DELETE FROM passwordResetWeb2MC WHERE userUUID = ?", [gettingUsername[0].userUUID]);
            const [puttingTokenIntoDatabase] = await db.execute("INSERT INTO passwordResetWeb2MC (token, userUUID, mcUUID) VALUES (?, ?, ?)", [resetToken, gettingUsername[0].userUUID, gettingUsername[0].mcUUID]);

            if (puttingTokenIntoDatabase.affectedRows > 0) {
                return res.status(200).json({message: 'Success.', resetToken: resetToken});
            }
            else {
                return res.status(500).json({message: 'An error occured.'});
            }
        }
        else {
            return res.status(403).json({message: "Username not found."})
        }
        }
        catch (err) {
            return res.status(500).json({message: 'Uh oh. Something went wrong.'});
        }
    }
}