import { useEffect, useMemo, useState } from "react";

import AttackChart from "./AttackChart";
import AttackerMap from "./AttackerMap";

import StatsCards from "./dashboard/StatsCards";
import RecentActivity from "./dashboard/RecentActivity";
import SearchBar from "./dashboard/SearchBar";
import LiveAlerts from "./dashboard/LiveAlerts";
import AttackTable from "./dashboard/AttackTable";

import { getEvents } from "../services/api";
import type { Event } from "../types/Event";


export default function EventTable() {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  /* ------------------------- Dashboard Statistics ------------------------ */

  const totalAttacks = events.length;

  const highRiskAttacks = events.filter(
    (event) => event.risk_score >= 70
  ).length;

  const uniqueIPs = new Set(events.map((event) => event.ip)).size;

  const averageRisk =
    events.length > 0
      ? Math.round(
          events.reduce((sum, event) => sum + event.risk_score, 0) /
            events.length
        )
      : 0;

  /* ----------------------------- Search -------------------------------- */

  const filteredEvents = useMemo(() => {
    return events.filter(
      (event) =>
        event.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.event_type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [events, searchTerm]);

  /* -------------------------- Fetch Events ------------------------------ */

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEvents();

    const interval = setInterval(fetchEvents, 5000);

    return () => clearInterval(interval);
  }, []);

  /* -------------------------- Live Alerts ------------------------------- */

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3001");

    socket.onopen = () => {
      console.log("Connected to WebSocket");
    };

    socket.onmessage = (message) => {
      const data = JSON.parse(message.data);

      if (data.type === "new_attack") {
        const attack = data.payload;

        setAlertMessage(
          `ðŸš¨ ${attack.event_type.toUpperCase()} from ${attack.ip} | Risk: ${attack.risk_score}`
        );

        setTimeout(() => {
          setAlertMessage("");
        }, 6000);
      }
    };

    socket.onerror = (error) => {
      console.error(error);
    };

    return () => socket.close();
  }, []);

  return (
    <div
      style={{
        padding: "30px",
        width: "100%",
        minHeight: "100vh",
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      {alertMessage && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            background: "#dc2626",
            color: "white",
            padding: "16px",
            borderRadius: "12px",
            fontWeight: "bold",
            zIndex: 9999,
            boxShadow: "0 0 20px red",
          }}
        >
          {alertMessage}
        </div>
      )}

      <h1
        style={{
          textAlign: "center",
          marginBottom: "30px",
          color: "white",
        }}
      >
        ðŸ›¡ï¸ DecepShield AI Dashboard
      </h1>

      <StatsCards
        totalAttacks={totalAttacks}
        highRiskAttacks={highRiskAttacks}
        uniqueIPs={uniqueIPs}
        averageRisk={averageRisk}
      />

      <RecentActivity events={events} />

      <LiveAlerts events={events} />

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <AttackChart events={events} />

      <AttackerMap events={events} />

      <AttackTable events={filteredEvents} />
    </div>
  );
}
