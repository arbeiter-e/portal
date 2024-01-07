import React, { useEffect, useState } from 'react';
import playerStore from '@/components/states/gettingPlayersInformation';
import { checkSession } from '@/pages/api/client/utils/checkSession';
import generateColor from '@/pages/api/utils/generateColour';
import {generateTownUUID} from '@/pages/api/utils/generateUUID';
import { minecraftToChunkCoordinates } from '@/pages/api/client/utils/minecraftCoordsToChunkCoords';
import Sidebar from '@/components/nav';
import CreateTownModal from '@/components/modals/createTownModal';
import ManageTable from '@/components/town/manage/ManageTable';


function SlashTownSlashMembers() {
  const { data, fetchData } = playerStore();
  const [validSession, setValidSession] = useState(false);
  const [inTown, setInTown] = useState(false);
  const [townName, setTownName] = useState("");
  const [townDescription, setTownDescription] = useState("");
  const [townIdeology, setTownIdeology] = useState("");
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
  
    if (data && (data.user.townUUID === null || data.user.townUUID === 'None')) {
      setInTown(false);
    } else if (data) {
      console.log(data);
      console.log("Setting inTown to true");
      setInTown(true);
      setTownName(data.name);
      setTownIdeology(data.ideology);
      setTownDescription(data.description);
    }
    else {
      setInTown(false);
    }
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
            <ManageTable data={data} townName={townName} townDescription={townDescription} townIdeology={townIdeology} setTownName={setTownName} setTownDescription={setTownDescription} setTownIdeology={setTownIdeology} />
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
