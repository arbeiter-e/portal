import axios from "axios";


export default async function handleResetPassword(username, setDisplayError, setSuccessfulPasswordReset) {
    const response = await axios.post('/api/session/forgotPassword', {username});

    if (response.status === 200) {
        setSuccessfulPasswordReset(response.data.resetToken);
    }
    else {
        setDisplayError(response.data.message);
    }
}

export async function handleCheckCommandRun(token, setSuccessfullyConfirmedAccount, setDisplayError) {
    const response = await axios.post('/api/session/confirmForgotPassword', {
        oldToken: token
    });

    if (response.status === 200) {
        setSuccessfullyConfirmedAccount(response.data.token);
    }
    else {
        setDisplayError(response.data.message);
    }
}

export async function handleFinishPasswordReset(token, pass, setDisplaySuccess, setDisplayError, router) {
    const response = await axios.post('/api/session/resetPassword', {token, pass});
    if (response.status === 200) {
        setDisplaySuccess("Password reset successfully. Reload the page to login");
    }
    else {
        setDisplayError(response.data.message);
    }
}