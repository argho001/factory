import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.PROD ? "/api" : "http://localhost:5001/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
