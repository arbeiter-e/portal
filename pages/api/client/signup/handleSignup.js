import axios from 'axios';
import Router from 'next/router';

export default function handleSignup(username, password, isTermsAccepted, setDisplayError, setDisplaySuccess, setStage1) {
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{8,}$/;

    if (passwordRegex.test(password) && usernameRegex.test(username) && isTermsAccepted) {
        axios.post('/api/session/signup', {username, password, isTermsAccepted})
            .then((response) => {
                if (response.status === 200) {
                    setStage1(response.data.userId);
                }
                else if (response.status === 203) {
                    setStage1(response.data.userId);
                }
                else if (response.status === 201) {
                    setDisplayError(response.data.message);
                }
                else if (response.status === 409) {
                    setDisplayError("Username already taken")
                }
                else {
                    setDisplayError('An unknown error occured');
                }
            })
            .catch((error) => {
                // Handle login error
                setDisplayError("Invalid username or password");
            });
    } else {
        if (!passwordRegex.test(password)) {
            setDisplayError("Password must be at least 8 characters, contain at least one digit and at least one special character.")
        }
        if (!usernameRegex.test(username)) {
            setDisplayError("Username must consist of alphanumeric characters (both uppercase and lowercase) and underscores")
        }
        if (!isTermsAccepted) {
            setDisplayError("Accept the privacy policy.");
        }
    }
}


export function handleSignupStage2(userId, setDisplayError) {
    axios.post('/api/session/checkAccountLink', {userId})
        .then((response) => {
            if (response.status === 200) {
                Router.push('/login');
            }
            if (response.status === 201) {
                setDisplayError("You haven't yet linked your account");
            }
            else if (response.status === 500) {
                setDisplayError("An unknown error occured. Please try again later");
            }
        })
}