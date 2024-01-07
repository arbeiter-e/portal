import axios from "axios";

export default async function getBankData(nationUUID) {
    const sessionId = sessionStorage.getItem('sessionId');
    const userUUID = sessionStorage.getItem('userId');

    const response = await axios.get('/api/server/nation/getBankData', {params:{
        sessionId: sessionId, 
        userUUID: userUUID, 
        nationUUID: nationUUID,
    }})
    if (response.status === 200) {
        return response.data;
    }
    else {
        return false;
    }
}