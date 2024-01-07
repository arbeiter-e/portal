import { faCrown, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Image from "next/image"

export default function NationTownMembersTable({membersArray, mayor}) {
    return (
        <div className="grid grid-cols-12 gap-8 p-4">
            <div className="col-span-4 p-4 bg-zinc-950 rounded-flg flex items-center gap-4">
                <FontAwesomeIcon icon={faCrown} />
                <span className="font-semibold">{mayor.username}</span>
            </div>
            {membersArray
            .filter((member) => member.userUUID !== mayor.userUUID)
            .map((member, index) => (
                <>
                <div key={index} className="col-span-4 p-4 bg-zinc-950 rounded-flg flex items-center gap-4">
                    <FontAwesomeIcon icon={faUser} />
                    <span className="font-semibold">{member.username}</span>
                </div>
                </>
            ))
            }
        </div>
    )
}