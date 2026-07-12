import type { Event } from "../../types/Event";

interface Props {
  events: Event[];
}

export default function TopAttackers({ events }: Props) {
  const attackerMap = new Map<
    string,
    { count: number; maxRisk: number }
  >();

  events.forEach((event) => {
    if (!attackerMap.has(event.ip)) {
      attackerMap.set(event.ip, {
        count: 1,
        maxRisk: event.risk_score,
      });
    } else {
      const current = attackerMap.get(event.ip)!;

      current.count++;

      current.maxRisk = Math.max(
        current.maxRisk,
        event.risk_score
      );
    }
  });

  const attackers = Array.from(attackerMap.entries())
    .map(([ip, data]) => ({
      ip,
      ...data,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div
      style={{
        background: "#111827",
        border: "1px solid #374151",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "30px",
      }}
    >
      <h2
        style={{
          color: "white",
          marginBottom: "20px",
        }}
      >
        ðŸŽ¯ Top Attackers
      </h2>

      {attackers.length === 0 ? (
        <p style={{ color: "#9CA3AF" }}>
          No attackers detected.
        </p>
      ) : (
        attackers.map((attacker, index) => (
          <div
            key={index}
            style={{
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "10px",
              background: "#1F2937",
            }}
          >
            <h3
              style={{
                color: "#38BDF8",
                marginBottom: "8px",
              }}
            >
              ðŸŒ {attacker.ip}
            </h3>

            <p
              style={{
                color: "white",
                margin: 0,
              }}
            >
              Attacks : {attacker.count}
            </p>

            <p
              style={{
                color:
                  attacker.maxRisk >= 70
                    ? "#EF4444"
                    : attacker.maxRisk >= 40
                    ? "#F59E0B"
                    : "#22C55E",
                fontWeight: "bold",
                marginTop: "8px",
              }}
            >
              Highest Risk : {attacker.maxRisk}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
