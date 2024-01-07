// NationsMemberTable.js

import { faChevronRight, faCrow, faCrown, faDollar, faIdCard, faScroll, faSquare, faStar, faUser, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import styles from "./NationsMemberTable.module.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MembersTable from "../town/members/membersTable";
import NationTownMembersTable from "./NationTownMemberTable";

export default function NationsMemberTable({ capital, towns, data }) {
  const [rotatedCapitalChevron, setRotatedCapitalChevron] = useState(false);

  const rotateCapitalChevron = () => {
    setRotatedCapitalChevron(!rotatedCapitalChevron);
  };

  const capitalStyle = rotatedCapitalChevron ? "h-full p-8" : "h-0 p-0";
  return (
    <>
      <div className="flex-col gap-[2px] flex items-center bg-zinc-700 rounded-flg h-fit overflow-y-auto col-span-8">
        {capital ? (
          <div className="w-full">
            <div className="w-full flex bg-zinc-800 p-8 items-center justify-between">
              <div className="flex items-center gap-4">
                <FontAwesomeIcon icon={faStar} />
                <span className="font-semibold text-lg">{capital?.name}</span>
              </div>
              <div className="flex gap-12">
                <div className="flex gap-2 text-zinc-300 items-center">
                  <FontAwesomeIcon icon={faUser} />
                  <span className="font-semibold">{capital?.members.length} {capital?.members.length === 1 ? "person" : "people"}</span>
                </div>
                <div className="flex gap-2 text-zinc-300 items-center">
                  <FontAwesomeIcon icon={faSquare} />
                  <span className="font-semibold">{capital?.claimCount} {capital?.claimCount === 1 ? "claim" : "claims"}</span>
                </div>
                <div className="flex gap-2 text-zinc-300 items-center">
                  <FontAwesomeIcon icon={faDollar} />
                  <span className="font-semibold">{capital?.upkeep} / day</span>
                </div>
                <div>
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    onClick={rotateCapitalChevron}
                    className={
                      rotatedCapitalChevron
                        ? `rotate-90 transition-all`
                        : `rotate-0 transition-all`
                    }
                  />
                </div>
              </div>
            </div>
            <div className={capitalStyle}>
                <div className="flex-col">
                    <div className="grid grid-cols-12 grid-rows-auto gap-4">
                        <div className="bg-zinc-900 p-4 w-full flex gap-4 items-center text-md rounded-flg col-span-4">
                            <FontAwesomeIcon icon={faUser} />
                            <span className="font-semibold">{capital?.members.length} {capital?.members.length === 1 ? "member" : "members"}</span>
                        </div>
                        <div className="bg-zinc-900 p-4 w-full flex gap-4 items-center text-md rounded-flg col-span-4">
                            <FontAwesomeIcon icon={faSquare} />
                            <span className="font-semibold">{capital?.members.length} {capital?.members.length === 1 ? "claim" : "claims"}</span>
                        </div>
                        <div className="bg-zinc-900 p-4 w-full flex gap-4 items-center text-md rounded-flg col-span-4">
                            <FontAwesomeIcon icon={faDollar} />
                            <span className="font-semibold">{capital?.upkeep} daily upkeep</span>
                        </div>
                        <div className="bg-zinc-900 p-4 w-full flex gap-4 items-center text-md rounded-flg col-span-4">
                            <FontAwesomeIcon icon={faCrown} />
                            <span className="font-semibold">{capital?.mayor.username}</span>
                        </div>
                        <div className="bg-zinc-900 p-4 w-full flex gap-4 items-center text-md rounded-flg col-span-4">
                            <FontAwesomeIcon icon={faScroll} />
                            <span className="font-semibold">{capital?.description}</span>
                        </div>
                        <div className="bg-zinc-900 p-4 w-full flex gap-4 items-center text-md rounded-flg col-span-4">
                            <FontAwesomeIcon icon={faIdCard} />
                            <span className="font-semibold">{capital?.townUUID}</span>
                        </div>
                        <div className="bg-zinc-900 p-4 w-full flex-col gap-4 items-center text-md rounded-flg col-span-12">
                            <div className="flex items-center gap-4">
                                <FontAwesomeIcon icon={faUsers} />
                                <span className="font-semibold">Members</span>
                            </div>
                            <div>
                                <NationTownMembersTable membersArray={capital?.members} mayor={capital?.mayor} />
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
          </div>
          
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
