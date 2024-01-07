import axios from "axios";
import Router from 'next/router';

export default async function createTownClient(
    townName, 
    townUUID, 
    townOutline, 
    townFill, 
    townDescription, 
    townHomeX, 
    townHomeY, 
    townHomeZ, 
    chunkX, 
    chunkZ, 
    ideology,
    setSuccessNotif,
    setFailureNotif,
    setInTown
    ) {
        if (townName === "") {
            setFailureNotif("You must set a town name");
        }
        else {
            console.log('hello.');
            const sessionId = sessionStorage.getItem('sessionId');
            const userId = sessionStorage.getItem('userId');
            console.log(sessionId, userId);
            axios.post('/api/server/create/createTown', {
                sessionId, 
                userId,     
                townName, 
                townUUID, 
                townOutline, 
                townFill, 
                townDescription, 
                townHomeX, 
                townHomeY, 
                townHomeZ, 
                chunkX, 
                chunkZ, 
                ideology
            })
            .then((response) => {
                if (response.status === 200) {
                    setSuccessNotif(`Successfully created ${townName}.`);
                    setTimeout(() => Router.reload(), 2500);                
                }
                else if (response.status === 201) {
                    setFailureNotif(response.data.message);
                }
                else if (response.status === 403) {
                    setFailureNotif(response.data.message);
                }
                else if (response.status === 500) {
                    setFailureNotif('An error occured');
                }
            })
        }
        
    }