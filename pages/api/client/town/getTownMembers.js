import axios from "axios";

export default async function pullTownMembers(townUUID) {
    try {
        const response = await axios.post('/api/server/town/getMembersFromUUID', { townUUID });

        if (response.status === 200) {
            return response.data.members;
        }
    } catch (err) {
        console.log(err);
        // Rethrow the error to indicate that the operation failed
        throw err;
    }
}
