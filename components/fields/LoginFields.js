
import { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faUnlock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';

export default function LoginFields({setCurrentPassword, setCurrentUsername, currentPassword, 
    currentUsername, displaySuccess, sendToHandle, resetPassword, setResetPassword, successfulPasswordReset, 
    sendToHandleReset, sendToConfirmCommand, successfullyConfirmedAccount, setSuccessfullyConfirmedAccount, 
    currentPasswordForgot, setCurrentPasswordForgot, currentConfirmPasswordForgot, setCurrentConfirmPasswordForgot,
    sendToFinishPasswordReset}) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const router = useRouter();
    const handleUsernameChange = (event) => {
        setCurrentUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setCurrentPassword(event.target.value);
    };

    const redirectSignup = () => {
        router.push('/signup');
    }
    const redirectForgot = () => {
        setResetPassword(true);
    }

    const rememberedPassword = () => {
        setResetPassword(false);
    }

    const togglePasswordView = () => {
        setIsPasswordVisible(!isPasswordVisible);
    }

    const handleCurrentPasswordForgotChange = (event) => {
        setCurrentPasswordForgot(event.target.value);
    }
    const handleCurrentConfirmPasswordForgotChange = (event) => {
        setCurrentConfirmPasswordForgot(event.target.value);
    }
    const lockIcon = displaySuccess ? faUnlock : faLock;

    return (
        <div className='flex flex-col p-4 gap-4 text-zinc-950 w-full'>
                <div className='flex flex-col gap-4 transition-all duration-200'>
                {resetPassword === false ? 
                    <>
                        <span className='text-white text-4xl font-bold text-center pb-4'>Login</span>
                        <div className='flex gap-4 p-4 text-zinc-950 items-center bg-gray-300 rounded-flg'>
                            <FontAwesomeIcon icon={faUser} />
                            <input type="text" id="username" value={currentUsername} onChange={handleUsernameChange} placeholder={'Username'} className='placeholder-text-zinc-600 bg-transparent w-full p-2 outline-none'></input>
                        </div>

                        <div className='flex gap-4 p-4 text-zinc-950 items-center bg-gray-300 rounded-flg'>
                                    <FontAwesomeIcon icon={lockIcon} />
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

                        <div>
                            <button className='bg-gradient-to-r from-cyan-600 to-cyan-900 text-white w-full py-4 rounded-flg outline-none' onClick={sendToHandle}>Login</button>
                        </div>
                        <div className='w-full flex justify-between'>
                            <span className='font-bold text-center text-white w-full cursor-pointer' onClick={redirectSignup}>Create an account</span>
                            <span className='font-bold text-center text-white w-full cursor-pointer' onClick={redirectForgot}>Forgotten Password?</span>
                        </div> 
                    </> : 
                    <>
                        <span className='text-white text-4xl font-bold text-center pb-4'>Forgot Password</span>
                        {successfulPasswordReset === false ? 
                            <>
                                <div className='flex gap-4 p-4 text-zinc-950 items-center bg-gray-300 rounded-flg'>
                                    <FontAwesomeIcon icon={faUser} />
                                    <input type="text" id="username" value={currentUsername} onChange={handleUsernameChange} placeholder={'Username'} className='placeholder-text-zinc-600 bg-transparent w-full p-2 outline-none'></input>
                                </div>                         
                                <div>
                                    <button className='bg-gradient-to-r from-cyan-600 to-cyan-900 text-white w-full py-4 rounded-flg outline-none' onClick={sendToHandleReset}>Reset Password</button>
                                </div>
                            </>
                        : 
                        (successfullyConfirmedAccount === false ?
                            <>
                                <div className='flex gap-4 p-4 text-zinc-950 items-center bg-gray-300 rounded-flg'>
                                    <code className='text-zinc-600 bg-transparent w-full p-2 text-xl outline-none text-center font-semibold'>/reset {successfulPasswordReset}</code>
                                </div>
                                <div>
                                    <button className='bg-gradient-to-r from-cyan-600 to-cyan-900 text-white w-full py-4 rounded-flg outline-none' onClick={sendToConfirmCommand}>I&apos;ve done this!</button>
                                </div>
                            </>
                            : 
                            <>
                                <div className='flex gap-4 p-4 text-zinc-950 items-center bg-gray-300 rounded-flg'>
                                    <FontAwesomeIcon icon={faUnlock} />
                                    <input
                                        type={isPasswordVisible ? 'text' : 'password'}
                                        id="password"
                                        value={currentPasswordForgot}
                                        onChange={handleCurrentPasswordForgotChange}
                                        placeholder={'Password'}
                                        className='placeholder-text-zinc-600 bg-transparent w-full p-2 outline-none'
                                    />
                                    <FontAwesomeIcon
                                        icon={isPasswordVisible ? faEye : faEyeSlash}
                                        onClick={togglePasswordView}
                                    />
                                </div>
                                <div className='flex gap-4 p-4 text-zinc-950 items-center bg-gray-300 rounded-flg'>
                                    <FontAwesomeIcon icon={faLock} />
                                    <input
                                        type={isPasswordVisible ? 'text' : 'password'}
                                        id="password"
                                        value={currentConfirmPasswordForgot}
                                        onChange={handleCurrentConfirmPasswordForgotChange}
                                        placeholder={'Password'}
                                        className='placeholder-text-zinc-600 bg-transparent w-full p-2 outline-none'
                                    />
                                    <FontAwesomeIcon
                                        icon={isPasswordVisible ? faEye : faEyeSlash}
                                        onClick={togglePasswordView}
                                    />
                                </div>                                
                                <div>
                                    <button className='bg-gradient-to-r from-cyan-600 to-cyan-900 text-white w-full py-4 rounded-flg outline-none' onClick={sendToFinishPasswordReset}>Reset Password</button>
                                </div>
                        </>
                        )
                        }


                        <div className='w-full flex justify-between'>
                            <span className='font-bold text-center text-white w-full cursor-pointer' onClick={redirectSignup}>Create an account</span>
                            <span className='font-bold text-center text-white w-full cursor-pointer' onClick={rememberedPassword}>I remember my password</span>
                        </div> 
                    </> }
                </div>
        </div>
    );
}