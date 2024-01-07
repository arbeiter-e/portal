import React, { useEffect, useState, useRef } from 'react';
import playerStore from '@/components/states/gettingPlayersInformation';
import { checkSession } from '@/pages/api/client/utils/checkSession';
import generateColor from '@/pages/api/utils/generateColour';
import { generateTownUUID } from '@/pages/api/utils/generateUUID';
import { minecraftToChunkCoordinates } from '@/pages/api/client/utils/minecraftCoordsToChunkCoords';
import checkJoinTownCode from '@/pages/api/client/utils/checkJoinTownCode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRepeat } from '@fortawesome/free-solid-svg-icons';
import submitJoin from '@/pages/api/client/townCreation/join/submitJoin';
import { useRouter } from 'next/router';

export default function JoinTownModal() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const [successfulTownFetch, setSuccessfulTownFetch] = useState(null);

  const handleChange = (index, value) => {
    const capitalizedValue = value.toUpperCase().replace(/[^a-zA-Z0-9]/g, '');
    const newCode = [...code];
    newCode[index] = capitalizedValue;

    setCode(newCode);

    // Move focus to the next input field
    if (index < 5 && value !== '' && !/[^a-zA-Z0-9]/.test(value)) {
      inputRefs[index + 1].current.focus();
    }

    if (newCode.every((digit) => digit !== '')) {
      checkJoinTownCode(newCode.join(''), setSuccessfulTownFetch);
    }
  };

  const handleBackspace = (index) => {
    setSuccessfulTownFetch(null);

    // Clear all values and move focus to the first input field
    if (index > 0) {
      const newCode = Array(6).fill(''); // Create a new array with empty values
      setCode(newCode);
      inputRefs[0].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedValue = e.clipboardData.getData('text/plain').substr(0, 6);
    if (/^[a-zA-Z0-9]{6}$/.test(pastedValue)) {
      const newCode = pastedValue.split('');
      setCode(newCode);
      inputRefs[newCode.length - 1].current.focus();
      checkJoinTownCode(newCode.join(''), setSuccessfulTownFetch);
    }
  };

  const handleJoinTown = () => {
    if (successfulTownFetch) {
      submitJoin(code.join(''), router);
    }
  };

  return (
    <>
      <div className='bg-zinc-900 row-span-3 col-span-8 flex justify-evenly items-start flex-col p-6 gap-6'>
        <span className='text-3xl text-center font-bold w-full'>Join Code<br /><span className='text-xl font-light'>Get one from a <strong>Town Leader</strong>.</span></span>
        <div className='w-full flex justify-evenly items-center gap-4 flex-col md:flex-row'>
          {code.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit || ''}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => e.key === 'Backspace' && handleBackspace(index)}
              onPaste={handlePaste}
              ref={inputRefs[index]}
              className='bg-zinc-700 h-[3rem] w-[3rem] md:h-[5rem] md:w-[5rem] lg:h-[10rem] lg:w-[10rem] outline-none rounded-xl text-center font-mono font-bold text-xl'
            />
          ))}
        </div>
      </div>

      <div
        className={`bg-zinc-800 row-span-1 m-8 col-span-8 rounded-lg flex justify-center items-center 
      ${(successfulTownFetch != null) ? 'cursor-pointer' : null}`}
      >
        <span
          className={`text-xl font-semibold transition-all h-[4rem] flex items-center duration-200 ${(successfulTownFetch != null) ? 'text-gray-50 hover:text-green-400' : 'text-zinc-400'} tracking-wider select-none`}
          onClick={handleJoinTown}
        >
          {(successfulTownFetch != null) ? `Join ${successfulTownFetch}` : 'Enter a code to join.'}
        </span>
      </div>
    </>
  )
}
