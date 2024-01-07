import axios from "axios";

export default async function deleteTownClient() {
    const userUUID = sessionStorage.getItem("userId");
    const sessionId = sessionStorage.getItem("sessionId");

    const response = await axios.post("/api/server/town/deleteTown", {sessionId, userUUID})

    if (response.status === 200) {
        return true;
    }
    else{ 
        return false;
    }
}