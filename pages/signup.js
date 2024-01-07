import Image from 'next/image';
import { useEffect, useState } from 'react';
import SignupFields from '@/components/fields/SignupFields';
import {SignupFieldsStage2} from '@/components/fields/SignupFields';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLockOpen, faLock, faClose, faExclamationTriangle, faCheck, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import handleSignup from '@/pages/api/client/signup/handleSignup';
import {handleSignupStage2} from '@/pages/api/client/signup/handleSignup';

export default function Login() {
    const [displayError, setDisplayError] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);
    const [currentUsername, setCurrentUsername] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [stage1, setStage1] = useState(true);

    function closeError() {
        setDisplayError(false);
    }

    function sendToHandle() {
        handleSignup(currentUsername, currentPassword, isTermsAccepted, setDisplayError, setDisplaySuccess, setStage1);
    }


    function sendToHandleStage2(userId) {
        handleSignupStage2(userId, setDisplayError);
    }

    
    return (
        <main className='h-screen bg-zinc-950 overflow-hidden'>
            <Image src="/assets/logos/square.png" className='z-10 fixed right-6 bottom-6 w-12 h-12 hidden md:block' width="48" height="48" alt="Arbeiter Square Logo" /> 
            <img src="/assets/ingame_images/1.png" className='w-full h-full translate-x-60 fixed z-0 scale-110 object-cover hidden md:block' alt='Ingame image' draggable={false}/> 
            <div className='w-full md:w-7/12 bg-white h-full bg-gradient-to-b from-cyan-700 to-cyan-900 md:pr-4 absolute z-5 md:rounded-br-[12rem] md:overflow-hidden md:pb-4'>
                <div className='w-full bg-zinc-950 h-full md:rounded-br-[11.4rem] justify-center flex flex-col items-center'>
                    <Image src="/assets/logos/long.png" className='hidden md:block w-1/3' width="400" height="400" alt="Arbeiter Logo" />
                    <div className='w-3/4 flex flex-col justify-center rounded-xl'>
                        <div className='w-full p-16'>
                            { displayError != false ? <div className='w-full text-center text-white bg-zinc-900 p-4 rounded-full flex justify-between px-12 items-center' onClick={closeError}><FontAwesomeIcon icon={faExclamationTriangle} /> {displayError}. <FontAwesomeIcon icon={faClose} /></div> : <></> }
                            { displaySuccess != false ? <div className='w-full text-center text-white bg-green-800 p-4 rounded-full flex justify-between px-12 items-center'><FontAwesomeIcon icon={faCheckCircle} /> Hey there, {currentUsername}.<div></div></div> : <></> }
                            {stage1 === true ? <SignupFields className="w-full transition-all duration-75" setCurrentUsername={setCurrentUsername} setCurrentPassword={setCurrentPassword} currentUsername={currentUsername} currentPassword={currentPassword} displaySuccess={displaySuccess} sendToHandle={sendToHandle} setIsTermsAccepted={setIsTermsAccepted} isTermsAccepted={isTermsAccepted} /> : <SignupFieldsStage2 userId={stage1} sendToHandleStage2={sendToHandleStage2} />}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}