import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NODE_ENV === "development" ? "http://localhost:4000/api/v1" : process.env.NEXT_PUBLIC_API_URI,
    withCredentials: true,
});
