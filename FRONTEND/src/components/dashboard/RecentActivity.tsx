import type { Event } from "../../types/Event";

interface Props {
  events: Event[];
}

export default function RecentActivity({ events }: Props) {
  return (
    <div
      style={{
        border: "1px solid #374151",
        borderRadius: "12px",
        padding: "20px",
        background: "#111827",
        marginBottom: "30px",
      }}
    >
      <h2 style={{ color: "white" }}>
        ðŸ•’ Recent Activity
      </h2>

      {events.length === 0 ? (
        <p style={{ color: "#9CA3AF" }}>
          No activity yet.
        </p>
      ) : (
        <ul>
          {events.slice(0, 5).map((event, index) => (
            <li
              key={index}
              style={{
                color: "white",
                marginBottom: "10px",
              }}
            >
              <strong>{event.timestamp}</strong>

              <br />

              {event.event_type}

              <br />

              {event.ip}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
