import axios from "axios";

export default async function handleAccountDeletion() {
    const userUUID = sessionStorage.getItem('userId');
    const sessionId = sessionStorage.getItem('sessionId');

    if (userUUID && sessionId) {
        const response = await axios.post('/api/server/user/deleteAccount', {userUUID, sessionId});
        if (response.status === 200) {
            return true;
        }
        else {
            return false;
        }
    }
    else{
        return true;
    }
}