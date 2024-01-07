// Gets the members of a town from the TownsUUID

const db = require('@/pages/api/db/connection');


export default async function getMembersFromUUID(req, res) {
    if (req.method !== "POST") {
        return req.status(405).json({message: 'Method not allowed.'});
    }
    else {
        try {
            const {townUUID} = req.body;
            const [pullingMembersFromDB] = await db.execute("SELECT users.userUUID, users.username, users.mcUUID, towns.mayor FROM users, towns WHERE users.townUUID = ? AND towns.townUUID = ?", [townUUID, townUUID]);

            return res.status(200).json({message: 'Success', members: pullingMembersFromDB});
        }
        catch(err) {
            console.log(err);

        }
    }
}