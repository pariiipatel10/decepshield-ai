import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Event {
  event_type: string;
}

interface Props {
  events: Event[];
}

export default function AttackChart({ events }: Props) {
  const attackCounts: Record<string, number> = {};

  events.forEach((event) => {
    attackCounts[event.event_type] =
      (attackCounts[event.event_type] || 0) + 1;
  });

  const data = {
    labels: Object.keys(attackCounts),
    datasets: [
      {
        label: "Attack Types",
        data: Object.values(attackCounts),
        backgroundColor: [
          "#ff6384",
          "#36a2eb",
          "#ffce56",
          "#4bc0c0",
          "#9966ff",
        ],
      },
    ],
  };

  return (
    <div
      style={{
        width: "400px",
        margin: "30px auto",
        border: "1px solid white",
        padding: "20px",
      }}
    >
      <h2 style={{ textAlign: "center" }}>
        Attack Distribution
      </h2>

      <Pie data={data} />
    </div>
  );
}
