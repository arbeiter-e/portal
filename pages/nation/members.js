import React, { useEffect, useState } from 'react';
import playerStore from '@/components/states/gettingPlayersInformation';
import { checkSession } from '@/pages/api/client/utils/checkSession';
import generateColor from '@/pages/api/utils/generateColour';
import {generateTownUUID} from '@/pages/api/utils/generateUUID';
import { minecraftToChunkCoordinates } from '@/pages/api/client/utils/minecraftCoordsToChunkCoords';
import Sidebar from '@/components/nav';
import CreateTownModal from '@/components/modals/createTownModal';
import getNationMembers from '../api/client/town/getNationMembers';
import NationsMemberTable from '@/components/members/NationsMemberTable';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuildingUser, faSquare, faUser } from '@fortawesome/free-solid-svg-icons';
import numberToWords from 'number-to-words';
import { Toaster } from "@/components/ui/sonner";

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function renderSection(icon, title, count) {
  const totalCount = count ? Object.keys(count).length + 1 : 0;
  const pluralSuffix = totalCount !== 1 ? 's' : '';

  return (
    <div className='col-span-4 bg-zinc-800 row-span-1 rounded-flg flex items-center p-5 gap-4 w-full'>
      <FontAwesomeIcon icon={icon} className='text-3xl' />
      <div className='flex flex-col'>
        <span className='font-bold text-xl'>
          {capitalize(numberToWords.toWords(totalCount))} {title}{pluralSuffix}
        </span>
      </div>
    </div>
  );
}



function SlashNationSlashMembers() {
  const { data, fetchData } = playerStore();
  const router = useRouter();
  const [validSession, setValidSession] = useState(false);
  const [inTown, setInTown] = useState(true);
  const [nationMembers, setNationMembers] = useState([]);


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
    const fetchNationMembers = async () => {
      try {
        if (data.user.townUUID === null || data.user.townUUID !== 'None') {
          setInTown(true);
          console.log("hello!");
          const nationMembers = await getNationMembers(data.nation.nationUUID);
          if (nationMembers && (nationMembers !== false)) {
            console.log(`nation members:`, nationMembers);
          }
          setNationMembers(nationMembers);
        } else {
          setInTown(false);
        }
      } catch (error) {
        console.error('Error fetching town members:', error);
      }
    };
  
    fetchNationMembers();
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

          <div className='px-3 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-12'>
            <span className='font-extrabold text-4xl text-center col-span-8'>{data.nation.name}&apos;s members<br /><span className='font-medium text-2xl tracking-widest'>Nation Members.</span></span>
            <div className='flex col-span-8 justify-between gap-12'>
              {renderSection(faBuildingUser, 'town', nationMembers.towns)}
              {renderSection(faUser, (nationMembers.members === 1 ? `member` : `members`), nationMembers.members)}
              {renderSection(faSquare, (nationMembers.claimCount === 1 ? `claim` : `claims`), nationMembers.claimCount)}
            </div>
            <NationsMemberTable capital={nationMembers.capital} data={data} />
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

export default SlashNationSlashMembers;
