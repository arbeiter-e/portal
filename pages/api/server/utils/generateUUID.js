const { v4: uuidv4 } = require('uuid');
const db = require('@/pages/api/db/connection'); // Replace with your actual database connection
export default async function generateTownUUID(req, res) {
    try {
        let uuid = null;

        while (uuid === null) {
            const potentialUUID = uuidv4();
            const [existingRecords] = await db.query('SELECT COUNT(*) as count FROM towns WHERE townUUID = ?', [potentialUUID]);

            if (existingRecords[0].count === 0) {
                uuid = potentialUUID;
            }
        }
        return res.status(200).json({uuid});
    }
    catch(err) {
        console.error(err)
        return res.status(500);
    }
}


export async function generateTownUUIDServer() {
    try {
        let uuid = null;

        while (uuid === null) {
            const potentialUUID = uuidv4();
            const [existingRecords] = await db.query('SELECT COUNT(*) as count FROM towns WHERE townUUID = ?', [potentialUUID]);

            if (existingRecords[0].count === 0) {
                uuid = potentialUUID;
            }
        }
        return uuid;
    }
    catch(err) {
        console.error(err);
        return null;
    }
}

export async function generateClaimUUIDServer() {
    try {
        let uuid = null;

        while (uuid === null) {
            const potentialUUID = uuidv4();
            const [existingRecords] = await db.query('SELECT COUNT(*) as count FROM claimAreas WHERE claimUUID = ?', [potentialUUID]);

            if (existingRecords[0].count === 0) {
                uuid = potentialUUID;
            }
        }
        return uuid;
    }
    catch(err) {
        console.error(err);
        return null;
    }
}