import type { Event } from "../../types/Event";

interface Props {
  events: Event[];
}

export default function AttackTable({ events }: Props) {
  return (
    <div
      style={{
        overflowX: "auto",
        marginTop: "30px",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          color: "white",
        }}
      >
        <thead
          style={{
            background: "#1F2937",
          }}
        >
          <tr>
            <th>Time</th>
            <th>IP</th>
            <th>Username</th>
            <th>Password</th>
            <th>Attack Type</th>
            <th>Risk</th>
          </tr>
        </thead>

        <tbody>
          {events.map((event, index) => (
            <tr key={index}>
              <td>{event.timestamp}</td>
              <td>{event.ip}</td>
              <td>{event.username}</td>
              <td>{event.password}</td>
              <td>{event.event_type}</td>

              <td
                style={{
                  color:
                    event.risk_score >= 70
                      ? "#ef4444"
                      : event.risk_score >= 40
                      ? "#f59e0b"
                      : "#22c55e",
                  fontWeight: "bold",
                }}
              >
                {event.risk_score}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
