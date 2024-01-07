import axios from "axios";

export default async function getNationMembers(nationUUID) {
    if (nationUUID) {
        const response = await axios.get("/api/server/nation/getNationData", {params: {nationUUID},});
        if (response.status === 200){ 
            return response.data;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}