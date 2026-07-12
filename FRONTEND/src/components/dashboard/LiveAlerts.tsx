import type { Event } from "../../types/Event";

interface Props {
  events: Event[];
}

export default function LiveAlerts({ events }: Props) {
  return (
    <div
      style={{
        border: "1px solid #374151",
        borderRadius: "12px",
        background: "#111827",
        padding: "20px",
        marginBottom: "30px",
      }}
    >
      <h2 style={{ color: "white" }}>
        ðŸš¨ Live Alerts
      </h2>

      {events.slice(0, 3).map((event, index) => (
        <div
          key={index}
          style={{
            padding: "12px",
            marginTop: "12px",
            borderLeft: `5px solid ${
              event.risk_score >= 70
                ? "#ef4444"
                : event.risk_score >= 40
                ? "#f59e0b"
                : "#22c55e"
            }`,
            background: "#1F2937",
          }}
        >
          <strong style={{ color: "white" }}>
            {event.event_type}
          </strong>

          <br />

          <span style={{ color: "#9CA3AF" }}>
            {event.ip}
          </span>

          <br />

          <span style={{ color: "#9CA3AF" }}>
            Risk Score: {event.risk_score}
          </span>
        </div>
      ))}
    </div>
  );
}
