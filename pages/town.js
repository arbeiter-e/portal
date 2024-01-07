import React, { useEffect, useState } from 'react';
import playerStore from '@/components/states/gettingPlayersInformation';
import { checkSession } from '@/pages/api/client/utils/checkSession';
import generateColor from '@/pages/api/utils/generateColour';
import {generateTownUUID} from '@/pages/api/utils/generateUUID';
import { minecraftToChunkCoordinates } from '@/pages/api/client/utils/minecraftCoordsToChunkCoords';
import Sidebar from '@/components/nav';
import CreateTownModal from '../components/modals/createTownModal';
import ManageTable from '../components/town/manage/ManageTable';
import pullTownMembers from './api/client/town/getTownMembers';

function SlashTownSlashMembers() {
  const { data, fetchData } = playerStore();
  const [validSession, setValidSession] = useState(false);
  const [inTown, setInTown] = useState(true);
  const [townName, setTownName] = useState("");
  const [townDescription, setTownDescription] = useState("");
  const [townMembers, setTownMembers] = useState([]);
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
    const fetchData = async () => {
      if (data && (data.user.townUUID === 'None')) {
        setInTown(false);
      } else if (data) {
        console.log(data);
        console.log("Setting inTown to true");
        const townMembers = await pullTownMembers(data.user.townUUID);
        setInTown(true);
        setTownName(data.town.name);
        setTownDescription(data.town.description);
        setTownMembers(townMembers);
      }
    };
  
    fetchData();  // Call the async function
  
  }, [data]);
  


  


  return (
    <div>
      {validSession == true ? (
        // Render content for a valid session
        <>
        {!inTown ? <CreateTownModal setInTown={setInTown} /> 
        : 
        <>
          <Sidebar />

          <div className='px-3 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12'>
            <ManageTable data={data} townName={townName} townDescription={townDescription} setTownName={setTownName} 
            setTownDescription={setTownDescription} townMembers={townMembers} />
          </div>
        </>
        
        }
        </>
      ) : (
        // Render content for an invalid session
        null
      )}
    </div>
  );
}

export default SlashTownSlashMembers;
