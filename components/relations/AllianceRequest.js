import { faArrowUpRightFromSquare, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import denyNotification from "@/pages/api/client/relations/denyNotification";
import { useRouter } from "next/router";
export default function AllianceRequest({townName, townUUID, notificationName, acceptDeny, isTownOwner, notificationId}) {
    const router = useRouter();
    const accept = async () => {

    }

    const deny = async () => {
        if (isTownOwner) {
            const isDenied = await denyNotification(notificationId, townUUID);
            if (isDenied === true) {
                router.reload();
            }
        }
    }

    return (
        <div className="w-full bg-zinc-700 p-4 flex justify-between">
            <div className="flex items-center gap-4">
                <div>
                <span className="font-bold">{townName}</span>
                </div>
                {/* <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-zinc-400 hover:text-zinc-300 transition-all cursor-pointer" onClick={openTown} /> */}
            </div>
            {acceptDeny === true && isTownOwner === true && (
                <div className="mr-1 flex gap-2 items-center">
                    <FontAwesomeIcon icon={faCheck} className="cursor-pointer bg-green-700 p-3 rounded-flg hover:bg-green-800 transition-all aspect-square" onClick={accept}/>
                    <FontAwesomeIcon icon={faXmark} className="cursor-pointer bg-red-700 p-3 rounded-flg hover:bg-red-800 transition-all aspect-square" onClick={deny} />
                </div>
            )
            }
        </div>
    )
}