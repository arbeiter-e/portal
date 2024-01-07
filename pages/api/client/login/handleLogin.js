import axios from 'axios';
import Router from 'next/router';

export default function handleLogin(username, password, setDisplayError, setDisplaySuccess) {
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{8,}$/;

    if (passwordRegex.test(password) && usernameRegex.test(username)) {
        axios.post('/api/session/login', {username, password})
            .then((response) => {
                if (response.status === 200) {
                    sessionStorage.setItem('userId', response.data.userId);
                    sessionStorage.setItem('sessionId', response.data.sessionId);

                    setDisplaySuccess(true);

                    setTimeout(function() {
                        Router.push('/');
                    }, 2500)
                }
            })
            .catch((error) => {
                // Handle login error
                setDisplayError("Invalid username or password");
            });
    } else {
        setDisplayError("Invalid username or password");
    }
}
