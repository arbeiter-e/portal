import React, { useEffect, useState, useRef } from 'react';
import generateColor from '@/pages/api/utils/generateColour';
import {generateTownUUID} from '@/pages/api/utils/generateUUID';
import { minecraftToChunkCoordinates } from '@/pages/api/utils/chunkUtils';
import checkJoinTownCode from '@/pages/api/client/utils/checkJoinTownCode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faDice, faRepeat, faShuffle } from '@fortawesome/free-solid-svg-icons';
import createTownClient from '@/pages/api/client/townCreation/create/createTown';
import JoinTownModal from './joinTownModal';

export default function CreateTownModal(setInTown) {

    // States for fields.
    const [fillColour, setFillColour] = useState(generateColor());
    const [outlineColour, setOutlineColour] = useState(generateColor());
    const [townUUID, setTownUUID] = useState("");
    const [townName, setTownName] = useState("");
    const [townDescription, setTownDescription] = useState('');
    const [xCoordinate, setXCoordinate] = useState('');
    const [yCoordinate, setYCoordinate] = useState('');
    const [zCoordinate, setZCoordinate] = useState('');
    const [zChunkCoordinate, setZChunkCoordinate] = useState('');
    const [xChunkCoordinate, setXChunkCoordinate] = useState('');
    const [narwhalName, setNarwhalName] = useState(false);
    const [createOrJoin, setCreateOrJoin] = useState('create');
    const [successNotif, setSuccessNotif] = useState('');
    const [failureNotif, setFailureNotif] = useState('');
    const [ideology, setIdeology] = useState('');

    useEffect(() => {
        const fetchDataAndSession = async () => {
          try {
            const townUUID = await generateTownUUID();
            setTownUUID(townUUID);
          } catch (error) {
            console.error('Error creating UUID', error);
          }
        };
    
        fetchDataAndSession();
      }, []);

    const handleFillChange = (event) => {
        setFillColour(event.target.value);
      }
      const handleOutlineChange = (event) => {
        setOutlineColour(event.target.value);
      }
      const handleTownNameChange = (event) => {
        setTownName((event.target.value).replace(" ", "_"))
        if (event.target.value === "Tuskicorn") {
          setNarwhalName(true);
        }
        else {
          setNarwhalName(false);
        }
      }
      const handleTownDescriptionChange = (event) => {
        setTownDescription(event.target.value);
      }
    
    
      const handleXChange = (event) => {
        setXCoordinate(event.target.value.replace(/[^0-9.-]/g, ''));
      };

      const handleYChange = (event) => {
        setYCoordinate(event.target.value.replace(/[^0-9.-]/g, ''));
      }  

      const handleZChange = (event) => {
        setZCoordinate(event.target.value.replace(/[^0-9.-]/g, ''));
      };

      useEffect(() => {
        calculateChunks();
      }, [xCoordinate, zCoordinate]);

      const handleIdeologyChange = (event) => {
        setIdeology(event.target.value);
      }
    
      function calculateChunks() {
        if ((xCoordinate !== null) && (zCoordinate !== null)) {
          let chunkCoords = minecraftToChunkCoordinates(xCoordinate, zCoordinate);
          console.log({
            coordsInputted: {
              xCoordinate: xCoordinate,
              zCoordinate: zCoordinate
            },
            chunkCoords: chunkCoords
          })
          if (!isNaN(chunkCoords.chunkX) && !isNaN(chunkCoords.chunkZ)) {
            setXChunkCoordinate(chunkCoords.chunkX);
            setZChunkCoordinate(chunkCoords.chunkZ);
          }
        }
      }

      const shuffleColours = (event) => {
        setFillColour(generateColor());
        setOutlineColour(generateColor());

      }

      const handleSwitchToJoin = () => {
        setCreateOrJoin('join');
      }
      const handleSwitchToCreate = () => {
        setCreateOrJoin('create');
      }


      const handleCreate = () => {
        createTownClient(    
          townName, 
          townUUID, 
          outlineColour, 
          fillColour, 
          townDescription, 
          xCoordinate, 
          yCoordinate, 
          zCoordinate, 
          xChunkCoordinate, 
          zChunkCoordinate, 
          ideology,
          setSuccessNotif,
          setFailureNotif,
          setInTown)
      }

    return (
        <div className='w-screen h-screen absolute z-100 bg-zinc-950 p-20 gap-4 flex flex-col'>
          <span className='text-5xl font-extrabold text-center col-span-8 row-span-1 items-center justify-center gap-16 hidden md:flex'><img src='/assets/logos/square.png' className='h-24 w-24 transition-all duration-200'/> {createOrJoin === 'create' ? 'Create your' : 'Join a' } town</span>
          <div className='flex flex-col md:flex-row w-full justify-evenly gap-4 mb-8'>
            <div className={` flex justify-center items-center w-full h-[4rem] flex-col gap-2 ${createOrJoin === 'create' ? 'bg-zinc-800 font-semibold text-lg' : 'bg-zinc-900'} transition-all`} onClick={handleSwitchToCreate}>
              <span>Create a town</span>
            </div>
            <div className={` row-span-1 col-span-4 flex w-full h-[4rem] justify-center items-center flex-col gap-2 ${createOrJoin === 'join' ? 'bg-zinc-800 font-semibold text-lg' : 'bg-zinc-900'} transition-all`} onClick={handleSwitchToJoin}>
              <span>Join a town</span>
            </div>
          </div>
          {createOrJoin === 'create' ? <>
          
          <div className='flex flex-col lg:flex-row justify-evenly col-span-8 gap-4'>
            <div className='bg-zinc-900 flex justify-evenly items-start flex-col p-6 gap-2 w-full'>
              <span className='text-xl font-semibold'>Town Name</span>
              <input className='w-full p-2 rounded-lg bg-zinc-700 outline-none px-4' placeholder='Town Name' value={townName} onChange={handleTownNameChange}></input>
            </div>
            <div className='bg-zinc-900 row-auto flex justify-evenly items-center p-6 gap-2 w-full'>
              <div className='flex flex-col justify-center w-full gap-2'>
              <span className='text-xl font-semibold select-none'>Outline Colour</span>
              <input className='w-full h-10 p-2 rounded-lg bg-zinc-700 outline-none transition-all duration-200' type='color' onChange={handleOutlineChange} id="outline" value={outlineColour}></input>
              </div>
              <FontAwesomeIcon icon={faDice} className='p-4 m-6 rounded-full h-4 w-4 bg-zinc-800 transition-all duration-200 hover:rotate-[20deg]' onClick={shuffleColours} />
              <div className='flex flex-col justify-center w-full gap-2'>
              <span className='text-xl font-semibold text-right select-none'>Fill Colour</span>
              <input className='w-full h-10 p-2 rounded-lg bg-zinc-700 outline-none transition-all duration-200' type='color' onChange={handleFillChange} id="fill" value={fillColour}></input>
            </div>
          </div>
          </div>
          <div className='flex flex-col row-auto lg:flex-row justify-evenly col-span-8 gap-4'>
            <div className='bg-zinc-900 w-full flex justify-evenly items-start flex-col p-6 gap-2'>
              <span className='text-xl font-semibold'>Town UUID</span>
              <input className='w-full p-2 rounded-lg bg-zinc-700 outline-none px-4 select-none' disabled value={townUUID}></input>
            </div>
            <div className='bg-zinc-900 w-full flex justify-evenly items-start flex-col p-6 gap-2'>
              <span className='text-xl font-semibold'>Town Description</span>
              <input className='w-full h-full p-2 px-4 rounded-lg bg-zinc-700 outline-none' placeholder='A short description of your town' value={townDescription} onChange={handleTownDescriptionChange}></input>
            </div>
          </div>
          
          <div className='bg-zinc-900 flex flex-col justify-evenly items-start p-6 gap-2'>
            <div>
            <span className='text-xl font-semibold text-center'>Home Chunks - <span className='font-light text-lg'>don&apos;t worry, you can claim more later.</span></span>
            </div>
            <div className='flex flex-col lg:flex-row justify-between w-full gap-2'>
              <div className='flex justify-evenly w-full gap-2'>
                <input className='p-2 rounded-lg bg-zinc-700 outline-none w-full' placeholder='X' value={xCoordinate} onChange={handleXChange}></input>
                <input className='p-2 rounded-lg bg-zinc-700 outline-none w-full' placeholder='Y' value={yCoordinate} onChange={handleYChange}></input>
                <input className='p-2 rounded-lg bg-zinc-700 outline-none w-full' placeholder='Z' value={zCoordinate} onChange={handleZChange}></input>
              </div>
            </div>
          </div>
          <div className='bg-zinc-900 row-span-1 col-span-2 flex justify-evenly items-start flex-col p-6 gap-2'>
            <span className='text-xl font-semibold'>Ideology</span>
            <select className='bg-zinc-700 w-full px-4 py-2 rounded-lg outline-none' value={ideology} onChange={handleIdeologyChange}>
              <option>Non-Aligned</option>
              <option>Democracy</option>
              <option>Capitalist</option>
              <option>Socialist</option>
              <option>Authoritarian</option>
              <option>Monarchist</option>
              <option>Facist</option>
              <option>Anarchist</option>
              <option>Imperialist</option>
              <option>Totalitarian</option>
              <option>Ingsoc</option>
              <option>Theocracy</option>
              <option>Caliphate</option>
              {narwhalName ? <option >Narwhal</option> : null}
            </select>
          </div>
          <div className='bg-zinc-800 m-8 h-[6rem] rounded-lg flex justify-center items-center cursor-pointer' onClick={handleCreate}>
          {
  successNotif ? (
    <span className='text-xl font-semibold text-green-500 tracking-wider my-4'>{successNotif}</span>
  ) : (
    failureNotif ? (
      <span className='text-xl font-semibold text-red-500 tracking-wider my-4'>{failureNotif}</span>
    ) : (
      <span className='text-xl font-semibold text-gray-300 tracking-wider my-4'>Create</span>
    )
  )
}
          </div></> 
          : <>
            <JoinTownModal  />
          </>}
          
        </div>

)}