import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faCheck, faEye, faEyeSlash, faSquareCheck, faSquareXmark, faXmark } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function SignupFields({ setCurrentPassword, setCurrentUsername, currentPassword, currentUsername, displaySuccess, sendToHandle, setIsTermsAccepted, isTermsAccepted }) {
    const router = useRouter();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleUsernameChange = (event) => {
        setCurrentUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setCurrentPassword(event.target.value);
    };

    const togglePasswordView = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    const toggleTermsAcceptance = () => {
        setIsTermsAccepted((prev) => !prev);
    };

    const passOntoSignup = () => {
        // Add your signup logic here, considering isTermsAccepted
        if (isTermsAccepted) {
            // Perform signup
            sendToHandle();
        } else {
            // Display an error or prompt to accept terms
            console.log('Please accept terms and conditions.');
        }
    };

    const redirectLogin = () => {
        router.push('/login');
    }

    return (
        <div className='flex flex-col p-4 gap-4 text-zinc-950 w-full'>
            <div className='flex flex-col gap-4 transition-all duration-200'>
                <span className='text-white text-4xl font-bold text-center pb-4'>Signup</span>
                <div className='flex gap-4 p-4 text-zinc-950 items-center bg-gray-300 rounded-flg'>
                    <FontAwesomeIcon icon={faUser} />
                    <input
                        type="text"
                        id="username"
                        value={currentUsername}
                        onChange={handleUsernameChange}
                        placeholder={'Username'}
                        className='placeholder-text-zinc-600 bg-transparent w-full p-2 outline-none'
                    />
                </div>

                <div className='flex gap-4 p-4 text-zinc-950 items-center bg-gray-300 rounded-flg'>
                    <FontAwesomeIcon icon={faLock} />
                    <input
                        type={isPasswordVisible ? 'text' : 'password'}
                        id="password"
                        value={currentPassword}
                        onChange={handlePasswordChange}
                        placeholder={'Password'}
                        className='placeholder-text-zinc-600 bg-transparent w-full p-2 outline-none'
                    />
                    <FontAwesomeIcon
                        icon={isPasswordVisible ? faEye : faEyeSlash}
                        onClick={togglePasswordView}
                    />
                </div>

                <div className='flex gap-4 p-4 text-zinc-950 items-center bg-gray-300 rounded-flg'>
                    <FontAwesomeIcon icon={isTermsAccepted === true ? faCheck : faXmark} 
                        onClick={toggleTermsAcceptance} />
                    <span className="ml-2">I accept the  <Link href={'https://arbeiter.uk/privacy'} className='font-semibold'> Privacy Policy </Link> </span>
                </div>

                <div>
                    <button className='bg-gradient-to-r from-cyan-600 to-cyan-900 text-white w-full py-4 rounded-flg outline-none' onClick={passOntoSignup}>Signup</button>
                </div>
                <div className='w-full flex'>
                        <span className='font-bold text-center text-white w-full cursor-pointer' onClick={redirectLogin}>I already have an account</span>
                    </div>
            </div>
        </div>
    );
}


export function SignupFieldsStage2({userId, sendToHandleStage2}) {

    const sendToHandle = () => {
        sendToHandleStage2(userId);
    }

    return (
        <div className='flex flex-col p-4 gap-4 text-zinc-950 w-full'>
            <div className='flex flex-col gap-4 transition-all duration-200'>
                <span className='text-white text-4xl font-bold text-center pb-4'>Signup</span>
                
                <div className='flex gap-4 p-4 text-zinc-950 items-center bg-gray-300 rounded-flg'>
                    <code className='text-zinc-600 bg-transparent w-full p-2 text-xl outline-none text-center font-semibold'>/link {userId}</code>
                </div>

                <div>
                    <button className='bg-gradient-to-r from-cyan-600 to-cyan-900 text-white w-full py-4 rounded-flg outline-none' onClick={sendToHandle}>Complete Signup</button>
                </div>
            </div>
        </div>
    )
}