/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import { useEffect, useState } from 'react';
import LoginFields from '@/components/fields/LoginFields';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLockOpen, faLock, faClose, faExclamationTriangle, faCheck, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import handleLogin from '@/pages/api/client/login/handleLogin';
import handleResetPassword, {handleCheckCommandRun, handleFinishPasswordReset} from '@/pages/api/client/login/handleResetPassword';
import { useRouter } from 'next/router';
export default function Login() {
    const [displayError, setDisplayError] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);
    const [currentUsername, setCurrentUsername] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [currentPasswordForgot, setCurrentPasswordForgot] = useState("");
    const [currentConfirmPasswordForgot, setCurrentConfirmPasswordForgot] = useState("");
    const [resetPassword, setResetPassword] = useState(false);
    const [successfulPasswordReset, setSuccessfulPasswordReset]= useState(false);
    const [successfullyConfirmedAccount, setSuccessfullyConfirmedAccount]= useState(false);
    function closeError() {
        setDisplayError(false);
    }

    function sendToHandle() {
        handleLogin(currentUsername, currentPassword, setDisplayError, setDisplaySuccess);
    }

    function sendToHandleReset() {
        handleResetPassword(currentUsername, setDisplayError, setSuccessfulPasswordReset);
    }

    function sendToConfirmCommand() {
        handleCheckCommandRun(successfulPasswordReset, setSuccessfullyConfirmedAccount, setDisplayError);
    }

    function sendToFinishPasswordReset() {
        if (currentPasswordForgot === currentConfirmPasswordForgot) {
            handleFinishPasswordReset(successfullyConfirmedAccount, currentPasswordForgot, setDisplaySuccess, setDisplayError);
        }
        else {
            setDisplayError("Passwords do not match.");
        }
    }
    return (
        <main className='h-screen bg-zinc-950 overflow-hidden'>
            <Image src="/assets/logos/square.png" className='z-10 fixed right-6 bottom-6 w-12 h-12 hidden md:block' width="48" height="48" alt="Arbeiter Square Logo" /> 
            <img src="/assets/ingame_images/1.png" className='w-full h-full translate-x-60 fixed z-0 scale-110 object-cover hidden md:block' alt='Ingame image' draggable={false}/> 
            <div className='w-full md:w-7/12 bg-white h-full bg-gradient-to-b from-cyan-700 to-cyan-900 md:pr-4 absolute z-5 md:rounded-br-[12rem] md:overflow-hidden md:pb-4'>
                <div className='w-full bg-zinc-950 h-full md:rounded-br-[11.4rem] justify-center flex flex-col items-center'>
                    <Image src="/assets/logos/long.png" className='hidden md:block w-1/3' width="400" height="400" alt="Arbeiter Logo" />
                    <div className='w-3/4 flex flex-col justify-center rounded-xl'>
                        <div className='w-full md:p-16'>
                        { displayError != false ? <div className='w-full text-center text-white bg-zinc-900 p-4 rounded-full flex justify-between px-12 items-center' onClick={closeError}><FontAwesomeIcon icon={faExclamationTriangle} /> {displayError}. <FontAwesomeIcon icon={faClose} /></div> : <></> }
                        {displaySuccess !== false ? (
                            <div className='w-full text-center text-white bg-green-800 p-4 rounded-full flex justify-between px-12 items-center'>
                                <FontAwesomeIcon icon={faCheckCircle} />
                                {displaySuccess === true ? (
                                <>Welcome back, {currentUsername}. Redirecting.. </>
                                ) : (
                                <>{displaySuccess}</>
                                )}
                                <div></div>
                            </div>
                            ) : (
                            <></>
                        )}

                        <LoginFields className="w-full transition-all duration-75" 
                        setCurrentUsername={setCurrentUsername} setCurrentPassword={setCurrentPassword} currentUsername={currentUsername} 
                        currentPassword={currentPassword} displaySuccess={displaySuccess} sendToHandle={sendToHandle} resetPassword={resetPassword} 
                        setResetPassword={setResetPassword} successfulPasswordReset={successfulPasswordReset} sendToHandleReset={sendToHandleReset}
                        sendToConfirmCommand={sendToConfirmCommand} successfullyConfirmedAccount={successfullyConfirmedAccount} setSuccessfullyConfirmedAccount={setSuccessfullyConfirmedAccount}
                        currentPasswordForgot={currentPasswordForgot} setCurrentPasswordForgot={setCurrentPasswordForgot} currentConfirmPasswordForgot={currentConfirmPasswordForgot} setCurrentConfirmPasswordForgot={setCurrentConfirmPasswordForgot}
                        sendToFinishPasswordReset={sendToFinishPasswordReset}/>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}