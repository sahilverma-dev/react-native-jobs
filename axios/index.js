import axios from "axios";

import { RAPID_API_KEY } from "@env";

export const api = axios.create({
  baseURL: "https://jsearch.p.rapidapi.com",
  headers: {
    "X-RapidAPI-Key": RAPID_API_KEY,
    "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
  },
});
