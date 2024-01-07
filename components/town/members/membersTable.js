import { faCross, faCrown, faRightFromBracket, faUser, faUserPlus, faX, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import createJoinCode from "@/pages/api/client/members/createJoinCode";
import axios from "axios";
import playerStore from '@/components/states/gettingPlayersInformation';
import Image from "next/image";
import { toast } from "sonner";



export default function MembersTable({ membersArray, userArray, router }) {
    const { data, fetchData } = playerStore();
    const [membersSorted, setMembersSorted] = useState([]);
    const [sessionId, setSessionId] = useState(null);
    const [userId, setUserId] = useState(null);
    const [joinCode, setJoinCode] = useState(false);
    const [isMemberOwner, setIsMemberOwner] = useState(false);
    const [removedUsers, setRemovedUsers] = useState([]);

    useEffect(() => {
        setMembersSorted(membersArray);
        setSessionId(sessionStorage.getItem('sessionId'));
        setUserId(sessionStorage.getItem('userId'));

        // Sort the array based on owner status
        const sortedMembers = [...membersArray].sort((a, b) => {
            if (a.mayor === a.mcUUID) return -1; // Move owner to the beginning
            if (b.mayor === b.mcUUID) return 1; // Move owner to the beginning
            if (a.mcUUID !== data?.user?.mcUUID) return 1; // Move current user to the second position
            if (b.mcUUID !== data?.user?.mcUUID) return -1; // Move current user to the second position
            return 0; // Maintain the original order for non-owners and non-current users
        });

        setMembersSorted(sortedMembers);

        // Check if the current user is the owner of the town
        if (sortedMembers.length > 0 && data?.user?.mcUUID === sortedMembers[0]?.mayor) {
            setIsMemberOwner(true);
        }
    }, [membersArray, data?.user.mcUUID]);

    const createTownInviteCode = async () => {
        if (!joinCode) {
            try {
                const returnedJoinCode = await createJoinCode(userArray.townUUID, sessionId);
                console.log(returnedJoinCode);

                if (returnedJoinCode === true) {
                    setJoinCode("You're not the owner of this town.");
                } else if (returnedJoinCode === false) {
                    setJoinCode("An error occurred.");
                } else {
                    setJoinCode(String(returnedJoinCode));
                }
            } catch (error) {
                console.error("Error creating town invite code:", error);
            }
        }
    };

    const makeUserOwner = async (member) => {
        try {
            const response = await axios.post("/api/server/town/makeTownMemberOwner", {
                userToPromote: member.mcUUID,
                sessionId: sessionId,
                userUUID: userId,
            });

            if (response.status === 200) {
                // Remove the user from the state without reloading the page
                setMembersSorted((prevMembers) => prevMembers.filter((m) => m.userUUID !== member.userUUID));
            } else {
                console.error("Error making user owner. Status: ", response.status);
            }
        } catch (err) {
            console.error("Error making user owner: ", err);
        }
    };

    const removeUserFromTown = async (member) => {
        try {
            const response = await axios.post("/api/server/town/removeMemberFromTown", {
                userToDelete: member.userUUID,
                sessionId: sessionId,
                userUUID: userId
            });

            if (response.status === 200) {
                // Remove the user from the state without reloading the page
                setRemovedUsers((prevRemovedUsers) => [...prevRemovedUsers, member.userUUID]);
                toast(`${member.username} has been removed from ${data.town.name}.`, {description: `${new Date().toDateString()}`, action: {label: "Close",onClick: () => {},},})
            } else {
                console.error("Error removing user from town. Status:", response.status);
            }
        } catch (error) {
            console.error("Error removing user from town:", error);
        }
    };

    const leaveTown = async () => {
        try {
            console.log(sessionId);
            const response = await axios.post("/api/server/town/leaveTown", {
                sessionId: sessionId,
                userUUID: userId,
            })
            if (response.status === 200) {
                // Remove the user from the state without reloading the page
                setMembersSorted((prevMembers) => prevMembers.filter((m) => m.userUUID !== userId));
            }
            else {
                console.error("Error leaving town.", response.status);
            }
        }
        catch (err) {
            console.error("Error leaving town: ", err);
        }
    }

    return (
        <>
            <div className="flex-col gap-[2px] flex items-center bg-zinc-700 rounded-flg overflow-y-auto min-h-[3rem] col-span-8 mb-4">
                {membersSorted
                .filter((member) => !removedUsers.includes(member.userUUID))
                .map((member, index) => (
                    <div key={index} className="flex items-center justify-between gap-4 w-full h-[7rem] bg-zinc-800 p-4">
                        <p className="flex items-center gap-6 font-semibold text-zinc-300">
                            <Image src={`https://minotar.net/armor/bust/${member.mcUUID}/75.png`} className="brightness-95" alt={`${member.username}'s avatar`} width="75" height="75" loading="lazy" />
                            {member.username} <abbr title={`${member.mayor !== member.mcUUID ? "Member" : "Owner"}`}><FontAwesomeIcon icon={member.mayor !== member.mcUUID ? faUser : faCrown} /></abbr>
                        </p>
                        <span className="flex gap-4">
                            {isMemberOwner && member.mayor !== member.mcUUID ? (
                                <>
                                    <abbr title="Make user owner">
                                        <FontAwesomeIcon
                                            icon={faCrown}
                                            className="text-zinc-400 hover:text-zinc-300 transition-all duration-75 cursor-pointer"
                                            userUUID={member.mcUUID}
                                            onClick={() => makeUserOwner(member)}
                                        />
                                    </abbr>
                                    <abbr title="Remove user">
                                        <FontAwesomeIcon
                                            icon={faXmark}
                                            className="text-zinc-400 hover:text-zinc-300 transition-all duration-75 cursor-pointer"
                                            userUUID={member.userUUID}
                                            onClick={() => removeUserFromTown(member)}
                                        />
                                    </abbr>
                                </>
                            ) : 
                                member.mayor !== member.mcUUID && userId === member.userUUID && 
                                (<>
                                    <abbr title="Leave Town">
                                        <FontAwesomeIcon
                                            icon={faRightFromBracket}
                                            className="text-zinc-400 hover:text-zinc-300 transition-all duration-75 cursor-pointer"
                                            onClick={leaveTown}
                                        />
                                    </abbr>
                                </> )
                            }
                        </span>
                    </div>
                ))}
                {isMemberOwner === true? <div className="flex items-center justify-between gap-4 w-full h-[5rem] bg-zinc-900 p-4 cursor-pointer" onClick={createTownInviteCode}>
                    <p className="text-center w-full gap-4 flex items-center justify-center text-xl font-semibold select-text" >
                        {joinCode === false ? (
                            <>
                                <FontAwesomeIcon icon={faUserPlus} /> Invite User
                            </>
                        ) : (
                            <>
                                {joinCode}
                                <br />
                                <span className="font-light">- Valid for 7 days</span>
                            </>
                        )}
                    </p>
                </div> : <></>
                }
            </div>
        </>
    );
}
