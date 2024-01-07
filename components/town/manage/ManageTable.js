import deleteTownClient from "@/pages/api/client/town/deleteTown";
import { faDove, faScroll, faSignature, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getTime } from "date-fns";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MembersTable from "@/components/town/members/membersTable";

export default function ManageTable({data, townName, townDescription, setTownName, setTownDescription, townMembers}) {
    console.log(data);
    const router = useRouter();
    const [narwhalName, setNarwhalName] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    useEffect(() => {
        if (townName === "Tuskicorn") {
            setNarwhalName(true);
        }
    }, [townName]);

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

    const handleDeleteButtonPress = async (event) => {
        if (deleteConfirm === false) {
            setDeleteConfirm(true);
        }
        else {
            const response = await deleteTownClient();

            if (response === true) {
                router.reload();
            }
            else {
                alert(`An error occured. Please report this code: ${new Date().getTime()}`);
            }
        }
    }

    const deleteText = deleteConfirm ? "Are you sure?" : "Delete Town"

    return (
        <>
            <div className="col-span-3 flex justify-center items-center">
                <span className="font-extrabold text-3xl">Manage {data.town.name}</span>
            </div>
            <div className="col-span-3">
                <button className="bg-zinc-800 w-full h-[4rem] rounded-flg font-bold" onClick={handleDeleteButtonPress}><FontAwesomeIcon icon={faTrash} /> {deleteText}</button>
            </div>
            <div className="col-span-3 row-span-1 bg-zinc-800 rounded-flg min-h-[6rem] items-center px-8 basis-2 flex gap-8">
                <abbr title="Town Name"><FontAwesomeIcon icon={faSignature} className="text-4xl text-zinc-100"/></abbr>
                <div className="flex flex-col w-full">
                    <span className="text-xl font-bold text-zinc-200">Town Name</span>
                    <input className="bg-zinc-700 w-full h-[2rem] outline-none px-4 rounded-flg font-semibold" value={townName} onChange={handleTownNameChange}></input>
                </div>
            </div>  
            <div className="col-span-3 row-span-1 bg-zinc-800 rounded-flg min-h-[6rem] items-center px-8 basis-2 flex gap-8">
                <abbr title="Town Description"><FontAwesomeIcon icon={faScroll} className="text-4xl text-zinc-100"/></abbr>
                <div className="flex flex-col w-full">
                    <span className="text-xl font-bold text-zinc-200">Town Description</span>
                    <input className="bg-zinc-700 w-full h-[2rem] outline-none px-4 rounded-flg font-semibold" value={townDescription} onChange={handleTownDescriptionChange}></input>
                </div>
            </div>  
            <div className='col-span-6 gap-12'>
                <MembersTable membersArray={townMembers} userArray={data} />
            </div>
        </>
    )
}