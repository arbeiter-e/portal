import axios from 'axios';
export default function checkJoinTownCode(code, setSuccessfulTownFetch) {
    const sessionId = sessionStorage.getItem('sessionId');
    const userId = sessionStorage.getItem('userId');
    axios.post('/api/server/join/checkCode', {code, sessionId, userId})
    .then((response) => {
        if (response.status === 200) {
            setSuccessfulTownFetch(response.data.town);
        }
    });
}