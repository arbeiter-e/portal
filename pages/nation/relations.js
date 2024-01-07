import React, { useEffect, useState } from 'react';
import playerStore from '@/components/states/gettingPlayersInformation';
import { checkSession } from '@/pages/api/client/utils/checkSession';
import generateColor from '@/pages/api/utils/generateColour';
import {generateTownUUID} from '@/pages/api/utils/generateUUID';
import { minecraftToChunkCoordinates } from '@/pages/api/client/utils/minecraftCoordsToChunkCoords';
import Sidebar from '@/components/nav';
import CreateTownModal from '@/components/modals/createTownModal';
import RelationsTable from '@/components/relations/RelationsTable';
import { useRouter } from 'next/router';


function SlashTownSlashMembers() {
  const { data, fetchData } = playerStore();
  const [validSession, setValidSession] = useState(false);
  const [inTown, setInTown] = useState(true);
  const router = useRouter();
  useEffect(() => {
    router.push('/');
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


  


  return (
    <div>
      {validSession ? (
        // Render content for a valid session
        <>
        {!inTown ? <CreateTownModal setInTown={setInTown} /> 
        : 
        <>
          <Sidebar />

          <div className='fixed top-0 ml-[15rem] w-[100vw] h-full p-[5rem] grid grid-cols-8 grid-rows-6 gap-4 pr-[20rem]'>
            <RelationsTable data={data} />
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
