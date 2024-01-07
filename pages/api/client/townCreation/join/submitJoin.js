import axios from "axios";
import { useRouter } from "next/router";

export default async function submitJoin(joinCode, router) {
    const sessionId = sessionStorage.getItem('sessionId');
    const userUUID = sessionStorage.getItem('userId');

    try {
        const response = await axios.post('/api/server/join/joinTown', { joinCode, sessionId, userUUID });

        if (response.status === 200) {
            router.reload();
        } else {
            // Handle other responses if needed
            console.error('Unexpected response:', response);
        }
    } catch (error) {
        // Handle errors from the axios request
        console.error('Error in submitJoin:', error);
    }
}
