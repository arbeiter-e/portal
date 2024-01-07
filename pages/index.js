import React, { useEffect, useState } from 'react';
import playerStore from '@/components/states/gettingPlayersInformation';
import { checkSession } from '@/pages/api/client/utils/checkSession';
import Sidebar from '@/components/nav';
import CreateTownModal from '@/components/modals/createTownModal';
import { forceLogin } from './api/client/utils/forceLogin';

function MainPage() {
  const { data, fetchData } = playerStore();
  const [validSession, setValidSession] = useState(false);
  const [inTown, setInTown] = useState(false);
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
  
    if (data?.user.townUUID === null || data?.user.townUUID === 'None') {
      setInTown(false);
    } else if (data) {
      console.log(data);
      console.log("Setting inTown to true");
      setInTown(true);
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

export default MainPage;
