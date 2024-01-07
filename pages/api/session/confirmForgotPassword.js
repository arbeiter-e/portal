const db = require('@/pages/api/db/connection');


export default async function confirmForgotPassword(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({message: 'Method not allowed.'})
    }
    else { 
        try {
            const { oldToken } = req.body;

            const [checkingIfInDB] = await db.execute("SELECT token, userUUID, id FROM passwordResetMC2Web WHERE oldToken = ?", [oldToken]);

            if (checkingIfInDB.length > 0) {
                const [removingThatOne] = await db.execute("DELETE FROM passwordResetMC2Web WHERE id = ?", [checkingIfInDB[0].id]);
                if (removingThatOne.affectedRows > 0) {
                    const [insertingIntoPasswordReset] = await db.execute("INSERT INTO passwordReset (userUUID, resetToken) VALUES (?, ?)", [checkingIfInDB[0].userUUID, checkingIfInDB[0].token]);
                    if (insertingIntoPasswordReset.affectedRows === 1) {
                        return res.status(200).json({message: 'Token created.', token: checkingIfInDB[0].token});
                    }
                    else {
                        return res.status(500).json({message: 'Fuck knows.'});
                    }
                }
                else {
                    return res.status(500).json({message: 'An error occured.'});
                }
            }
            else {
                return res.status(403).json({message: 'Hmm. Doing a bit of tomfoolery, are we?'});
            }
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({message: 'An error occured.'})
        }
    }
}