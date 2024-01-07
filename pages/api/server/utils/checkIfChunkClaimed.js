const db = require('@/pages/api/db/connection');
export default async function checkIfChunksClaimed(chunkX, chunkZ) {
    try {
        const [check] = await db.query('SELECT townUUID FROM claimAreas WHERE chunkX = ? AND chunkZ = ?', 
        [chunkX, chunkZ]);
        console.log(check);
        if (check.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (err) {
        console.error(err);
        return null;
    }
}