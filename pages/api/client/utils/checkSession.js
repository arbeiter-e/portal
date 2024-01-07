import axios from 'axios';
import { forceLogin } from './forceLogin';

export async function checkSession() {
    const sessionId = sessionStorage.getItem('sessionId');
    const userId = sessionStorage.getItem('userId');
    if (sessionId && userId) {
        axios.post('/api/session/checkSession', {userId, sessionId})
        .then((response) => {
            try {
            if (response.status !== 200) {
                forceLogin();
                return false;
            }
            else {
                return true;
            }
            }
            catch {
                forceLogin();
            }
        })
    }
    else {
        forceLogin();
    }
}