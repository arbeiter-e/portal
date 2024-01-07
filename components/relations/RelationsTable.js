import { faArrowUpRightFromSquare, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AllianceRequest from "./AllianceRequest";
import { useEffect, useState } from "react";

export default function RelationsTable({data}) {
    const [isTownOwner, setIsTownOwner] = useState(false);

    useEffect(() => {
        if (data.owner === data.mcUUID) {
            setIsTownOwner(true)
        }
    }, [data]);
    return (
        <>
            <div className="col-span-4 row-span-2 bg-zinc-800 rounded-flg grid grid-cols-8 grid-rows-6 p-8">
                <span className="col-span-4 font-bold text-xl">Alliance Requests</span>
                <div className="col-span-8 flex flex-col gap-1 row-span-5 bg-zinc-900 rounded-flg overflow-y-auto">
                    <AllianceRequest townName={"SpoonVille"} notificationName={"Alliance Request"} acceptDeny={true} townUUID={"xx"} isTownOwner={isTownOwner} />
                    <span className="text-zinc-500 font-bold h-[2rem] flex items-center justify-center">No more notifications</span>
                </div>
            </div>
        </>
    )
}