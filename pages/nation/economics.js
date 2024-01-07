import React, { useEffect, useState } from 'react';
import playerStore from '@/components/states/gettingPlayersInformation';
import { checkSession } from '@/pages/api/client/utils/checkSession';
import CreateTownModal from '@/components/modals/createTownModal';
import EconomyTable from '@/components/economy/EconomyTable';
import Sidebar from '@/components/nav';
import getBankData from "@/pages/api/client/nation/getBankData";

function SlashTownSlashEconomics() {
  const { data, fetchData } = playerStore();
  const [validSession, setValidSession] = useState(false);
  const [townName, setTownName] = useState();
  const [inTown, setInTown] = useState(true);
  const [townBalance, setTownBalance] = useState(0);
  const [townOutgoings, setTownOutgoings] = useState(0);
  const [townTransactions, setTownTransactions] = useState([]);
  const [averageIncome, setAverageIncome] = useState(0);

  useEffect(() => {
    const fetchDataAndSession = async () => {
      try {
        const userId = sessionStorage.getItem('userId');
        const sessionId = sessionStorage.getItem('sessionId');

        if (!userId || !sessionId) {
          setValidSession(false);
          forceLogin();
        } else {
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

  useEffect(() => {
    const fetchTownEconomy = async () => {
      try {
        if (data && (data.user.townUUID !== null || data.user.townUUID !== 'None')) {
          setInTown(true);
          const nationEconomy = await getBankData(data.nation.nationUUID);

          if (nationEconomy !== false) {
            setTownBalance(new Intl.NumberFormat("en-gb").format(nationEconomy.balance));
            setTownOutgoings(new Intl.NumberFormat("en-gb").format(nationEconomy.outgoings));
            setAverageIncome(`${nationEconomy.incomings % 0 === 1 ? new Intl.NumberFormat("en-gb").format(nationEconomy.incomings) : 0}`);
            setTownTransactions(nationEconomy.transactions);
          }
        } else {
          setInTown(false);
        }
      } catch (error) {
        console.error('Error fetching town economy:', error);
      }
    };

    fetchTownEconomy();
  }, [data]);

  return (
    <div>
      {validSession ? (
        <>
          {!inTown ? <CreateTownModal setInTown={setInTown} />
            :
            <>
              <Sidebar />
              <div className="px-3 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12">
                <span className='font-extrabold text-4xl text-center col-span-8'>{data.nation.name}&apos;s Economy<br /><span className='font-medium text-2xl tracking-widest'>Nation Economics.</span></span>
                <EconomyTable townBalance={townBalance} townTransactions={townTransactions} townOutgoings={townOutgoings} data={data} averageIncome={averageIncome} />
              </div>

            </>
          }
        </>
      ) : null}
    </div>
  );
}

export default SlashTownSlashEconomics;
