import React, { useEffect, useState } from 'react';
import playerStore from '@/components/states/gettingPlayersInformation';
import { checkSession } from '@/pages/api/client/utils/checkSession';
import generateColor from '@/pages/api/utils/generateColour';
import {generateTownUUID} from '@/pages/api/utils/generateUUID';
import { minecraftToChunkCoordinates } from '@/pages/api/client/utils/minecraftCoordsToChunkCoords';
import Sidebar from '@/components/nav';
import CreateTownModal from '@/components/modals/createTownModal';
import { useRouter } from 'next/router';
import handleAccountDeletion from './api/client/user/handleAccountDeletion';

function SlashTownSlashMembers() {
  const { data, fetchData } = playerStore();
  const router = useRouter();
  const [validSession, setValidSession] = useState(false);
  const [inTown, setInTown] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  useEffect(() => {
    const fetchDataAndSession = async () => {
      try {
        const userId = sessionStorage.getItem('userId');
        const sessionId = sessionStorage.getItem('sessionId');
        if (!userId && !sessionId) {
          setValidSession(false);
          forceLogin();
        }
        else {
          await checkSession();
          fetchData(userId, sessionId);
          setValidSession(true);
        }
      } catch (error) {
        console.error('Error checking session or fetching data:', error);
        setValidSession(false);
      }
    };

    fetchDataAndSession();
  }, []);


  // Setting relevant values.
  useEffect(() => {  
    console.log(data);
    if (data && (data.user.townUUID === null || data.user.townUUID === 'None')) {
      setInTown(false);
    } else {
      setInTown(true);
    }
  }, [data]);


  const handleDeletion = async () => {
    if (confirmDelete === false) {
      setConfirmDelete(true)
    }
    else if (confirmDelete === true) {
      const deletingAccount = await handleAccountDeletion();

      if (deletingAccount === true) {
        router.push('/login');
      }
      else {
        alert('An error occured. Please open a ticket in the discord.');
      }
    }
    else {
      router.reload();
    }
  }


  return (
    <div>
      {validSession ? (
        // Render content for a valid session
        <>
        {!inTown ? <CreateTownModal setInTown={setInTown} /> 
        : 
        <>
          <Sidebar />

          <div className='px-12 grid grid-cols-8 grid-rows-6 gap-4'>
            <span className='font-extrabold text-4xl text-center col-span-8'>Hey there, {data.username}</span>
            <button className='col-span-2 bg-zinc-800 row-span-2 font-bold' onClick={handleDeletion}>
              {confirmDelete === false ? "Delete account" : "Are you sure?" }
            </button>
          </div>
        </>
        
        }
        </>
      ) : (
        null
      )}
    </div>
  );
}

export default SlashTownSlashMembers;
