interface Props {
  totalAttacks: number;
  highRiskAttacks: number;
  uniqueIPs: number;
  averageRisk: number;
}

export default function StatsCards({
  totalAttacks,
  highRiskAttacks,
  uniqueIPs,
  averageRisk,
}: Props) {
  const cardStyle: React.CSSProperties = {
    border: "1px solid #374151",
    borderRadius: "12px",
    padding: "20px",
    background: "#111827",
    color: "white",
    textAlign: "center",
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
        gap: "20px",
        marginBottom: "30px",
      }}
    >
      <div style={cardStyle}>
        <h3>ðŸ“Š Total Attacks</h3>
        <h1>{totalAttacks}</h1>
      </div>

      <div style={cardStyle}>
        <h3>ðŸš¨ High Risk</h3>
        <h1>{highRiskAttacks}</h1>
      </div>

      <div style={cardStyle}>
        <h3>ðŸŒ Unique IPs</h3>
        <h1>{uniqueIPs}</h1>
      </div>

      <div style={cardStyle}>
        <h3>âš  Average Risk</h3>
        <h1>{averageRisk}</h1>
      </div>
    </div>
  );
}
