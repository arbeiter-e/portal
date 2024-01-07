const db = require('@/pages/api/db/connection');

export default async function getBankData(req, res) {
    try {
        if (req.method !== "GET") {
            return res.status(405).json({ message: 'Method not allowed.' });
        }

        const { sessionId, userUUID, nationUUID } = req.query;

        if ((sessionId && !userUUID) || !nationUUID) {
            return res.status(400).json({ message: 'Invalid parameters' });
        }

        if (sessionId) {
            try {
                const [checkingUserTown] = await db.execute("SELECT users.townUUID FROM users WHERE sessionId = ? AND userUUID = ?", [sessionId, userUUID]);
                if (!checkingUserTown || !checkingUserTown[0]?.townUUID) {
                    return res.status(403).json({ message: 'Oops. Invalid session data. Send no session data to get just the town balance. (1)' });
                }
                const [checkingTownNation] = await db.execute("SELECT nations.nationUUID FROM nations JOIN towns ON towns.nationUUID = nations.nationUUID WHERE towns.townUUID = ?", [checkingUserTown[0]?.townUUID]);

                if (!checkingTownNation || !checkingTownNation[0]?.nationUUID) {
                    return res.status(403).json({ message: 'Oops. Invalid session data. Send no session data to get just the town balance. (2)' });
                } else {
                    if (nationUUID === checkingTownNation[0].nationUUID) {
                        // Success - happy to return transaction view.
                        const [gettingTownBalance] = await db.execute("SELECT nations.balance, nations.outgoings FROM nations WHERE nationUUID = ?", [nationUUID]);
                        const [gettingTownTransactions] = 
                        await db.execute(
                        "SELECT id, amount, detail, time, intoAccount FROM transactions WHERE nationUUID = ? AND time >= UNIX_TIMESTAMP(DATE_SUB(NOW(), INTERVAL 30 DAY)) ORDER BY time DESC;"
                        , [nationUUID]);

                        

                        const response = {
                            nationUUID: nationUUID,
                            balance: gettingTownBalance[0].balance,
                            outgoings: gettingTownBalance[0].outgoings,
                            incomings: calculateAverageIncoming(JSON.parse(JSON.stringify(gettingTownTransactions))),
                            transactions: JSON.parse(JSON.stringify(gettingTownTransactions))
                        };

                        return res.status(200).json(response);
                    } 
                    else {
                        return res.status(403).json({
                            message: 'Your session is valid, but you must be a member of the town for a detailed view. ' +
                                'Send no session data to get just the town balance.'
                        });
                    }
                }
            } catch (error) {
                console.error('Error in the database query:', error);
                return res.status(500).json({ message: 'Error 2.' });
            }
        } else {
            const [gettingTownBalance] = await db.execute("SELECT nations.balance FROM nations WHERE nationUUID = ?", [nationUUID]);
            return res.status(200).json({
                nationUUID: nationUUID,
                balance: gettingTownBalance[0].balance,
            });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Error.' });
    }
}

function calculateAverageIncoming(transactions) {
    let total = 0;
  
    for (let i = 0; i < transactions.length; i++) {
      if (transactions[i].intoAccount === 1) {
        total += transactions[i].amount;
      }
    }
    var returnedValue = "";
    if ((total / transactions.length).toFixed(2) > -1) {
        var returnedValue = (total / transactions.length).toFixed(2);
        return returnedValue;
    }
    else {
        var returnedValue = 0;
        return returnedValue;
    }
  }