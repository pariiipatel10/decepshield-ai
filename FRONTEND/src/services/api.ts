import axios from "axios";
import type { Event } from "../types/Event";

const API = axios.create({
  baseURL: "http://localhost:3001",
});

export async function getEvents(): Promise<Event[]> {
  const response = await API.get("/events");
  return response.data;
}

export default API;
