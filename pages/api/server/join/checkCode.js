const db = require('@/pages/api/db/connection');
export default async function checkJoinCode(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({message: 'Invalid method.'}) // Invalid method used.
    }
    else {
        try {
            const {code, sessionId, userId} = req.body;
            
            if (!code) {
                return res.status(418).json({message: 'You are not a teapot, stop tryna make me crack.'});
            }
            else {
                if (!/[^a-zA-Z0-9]/.test(code)) {
                    console.log(code);
                    const [checkingIfValidCode] = await db.query('SELECT townUUID FROM join_codes WHERE joinCode = ?', [code])



                    try {
                        if (checkingIfValidCode[0].townUUID) {
                            const [gettingTownName] = await db.query('SELECT name FROM towns WHERE townUUID = ?', [checkingIfValidCode[0].townUUID])

                            console.log(gettingTownName[0].name);

                            if (gettingTownName[0].name) {
                                return res.status(200).json({message: 'Town found.', town: gettingTownName[0].name});
                            }
                            else {
                                return res.status(201).json({message: 'Invalid join code.'});
                            }
                        }
                        else {
                            return res.status(201).json({message: 'Invalid join code.'});
                        }
                    }
                    catch (err) {
                        console.error(err);
                        return res.status(201).json({message: 'Invalid join code.'});
                    }


                }
            }
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({message: 'An internal server error occured.'});
        }
    }
}