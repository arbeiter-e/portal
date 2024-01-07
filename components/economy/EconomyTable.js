import { faCoins, faMinus, faMoneyBillTransfer, faMoneyBillTrendUp, faPlus, faSignature } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react";
import { formatDistanceToNow  } from "date-fns";
import EconomyTableItem from "./EconomyTableItem";
export default function EconomyTable({ townBalance, townOutgoings, townTransactions, data, averageIncome }) {

    console.log(townTransactions);

    return (
        <>
            <div className="flex col-span-8 justify-evenly flex-col lg:flex-row gap-4">
                <EconomyTableItem label="Nation" value={data.nation.name} icon={faSignature} />
                <EconomyTableItem label="Balance" value={townBalance} icon={faCoins} />
                <EconomyTableItem label="Costs" value={townOutgoings} icon={faMoneyBillTransfer} />
                <EconomyTableItem label="Income" value={averageIncome} icon={faMoneyBillTrendUp} />
            </div>
            <div className="col-span-8 bg-zinc-900 rounded-flg overflow-y-scroll grid grid-cols-8 gap-2 items-start justify-start">
                {townTransactions.length < 1 && <span className="col-span-8 h-[4rem] flex items-center justify-center text-zinc-400 font-bold">There has been no transactions recently.</span>}
                {townTransactions.map((transaction, index) => (
                    <div key={index} className="col-span-8 bg-zinc-800 h-full min-h-[6rem] items-center flex px-6">
                        <div className="flex gap-4 items-center justify-between w-full">
                            <div className="flex flex-col">
                                <span className="font-bold text-xl text-zinc-200">{transaction.detail}</span>
                                <span className="text-zinc-400">{formatDistanceToNow(new Date(transaction.time * 1000), { addSuffix: true })}</span>
                            </div>
                            <div className="flex gap-4 items-center text-zinc-200">
                                {transaction.amount}
                                <FontAwesomeIcon icon={transaction.intoAccount === 1 ? faPlus : faMinus} className="text-xl font-semibold pt-1"/>
                            </div>
                        </div>
                    </div>
                ))
                }
            </div>
        </>
    )
}