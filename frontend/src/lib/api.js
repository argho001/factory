import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5001/api", // Connects to local Express Server
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
