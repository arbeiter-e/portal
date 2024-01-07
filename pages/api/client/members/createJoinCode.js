import axios from "axios";

export default async function createJoinCode(townUUID, sessionId) {
    try {
        if (townUUID && sessionId) {
            const response = await axios.post('/api/server/join/createCode', { townUUID, sessionId });

            if (response.status === 200) {
                return response.data.joinCode;
            }
            else if (response.status === 201) {
                return true;
            } else {
                return false;
            }
        }
    } catch (error) {
        // Handle the error, log it, or throw it further
        console.error('Error in createJoinCode:', error);
        return false; // or throw error; depending on your use case
    }
}
