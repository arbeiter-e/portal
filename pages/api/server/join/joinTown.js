const db = require('@/pages/api/db/connection');

export default async function joinTown(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Invalid method.' });
    } else {
        try {
            const { joinCode, userUUID, sessionId } = req.body;
            console.log('Received request:', joinCode, userUUID, sessionId);

            // Check if the join code is valid
            const [joinCodeCheck] = await db.execute('SELECT townUUID FROM join_codes WHERE joinCode = ?', [joinCode]);

            if (joinCodeCheck.length === 0) {
                // Join code is not valid
                return res.status(404).json({ message: 'Invalid join code.' });
            }

            const townUUID = joinCodeCheck[0].townUUID;

            // Update the user's townUUID
            const [updateUserTown] = await db.execute('UPDATE users SET townUUID = ? WHERE userUUID = ? AND sessionId = ?', [townUUID, userUUID, sessionId]);

            console.log('Result of updating user town:', updateUserTown);

            if (updateUserTown.affectedRows > 0) {
                // Remove the used join code from the database
                const [removeJoinCode] = await db.execute('DELETE FROM join_codes WHERE joinCode = ?', [joinCode]);

                console.log('Result of removing join code:', removeJoinCode);

                // Update and removal were successful
                return res.status(200).json({ message: 'Town joined successfully.' });
            } else {
                // No rows were affected, indicating no match for the provided criteria
                return res.status(404).json({ message: 'Invalid user UUID or session ID.' });
            }
        } catch (err) {
            console.error('Error in joinTown:', err);
            return res.status(500).json({ message: 'Uh oh!' });
        }
    }
}
