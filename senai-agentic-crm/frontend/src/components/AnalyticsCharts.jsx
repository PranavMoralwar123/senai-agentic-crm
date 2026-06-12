import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
} from "chart.js";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import { countByField, countByDate } from "../utils/filters";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
);

const chartColors = [
  "#0d6efd",
  "#198754",
  "#dc3545",
  "#ffc107",
  "#0dcaf0",
  "#6f42c1",
  "#fd7e14",
  "#20c997",
];

function buildChartData(counts) {
  const labels = Object.keys(counts);
  return {
    labels,
    datasets: [
      {
        data: labels.map((l) => counts[l]),
        backgroundColor: labels.map((_, i) => chartColors[i % chartColors.length]),
        borderWidth: 0,
      },
    ],
  };
}

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: "bottom" } },
};

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
};

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
};

function AnalyticsCharts({ actions, responses, contacts, emails }) {
  const actionCounts = countByField(actions, "action_type");
  const categoryCounts = countByField(emails, "category");
  const statusCounts = countByField(contacts, "status");
  const responseTrend = countByDate(responses, "created_at", 7);

  const trendLabels = Object.keys(responseTrend).map((d) => {
    const date = new Date(d);
    return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  });

  const hasData =
    actions.length > 0 || emails.length > 0 || contacts.length > 0 || responses.length > 0;

  if (!hasData) {
    return (
      <div className="card shadow-sm mb-4">
        <div className="card-body text-muted text-center py-4">
          Analytics will appear once you have contacts, emails, actions, or responses.
        </div>
      </div>
    );
  }

  return (
    <div className="row g-3 mb-4">
      <div className="col-lg-3 col-md-6">
        <div className="card shadow-sm chart-card">
          <div className="card-header bg-white py-2">
            <h6 className="mb-0">Actions by Type</h6>
          </div>
          <div className="card-body">
            {Object.keys(actionCounts).length === 0 ? (
              <p className="text-muted small mb-0">No actions yet</p>
            ) : (
              <div className="chart-container">
                <Doughnut data={buildChartData(actionCounts)} options={doughnutOptions} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="col-lg-3 col-md-6">
        <div className="card shadow-sm chart-card">
          <div className="card-header bg-white py-2">
            <h6 className="mb-0">Email Categories</h6>
          </div>
          <div className="card-body">
            {Object.keys(categoryCounts).length === 0 ? (
              <p className="text-muted small mb-0">No emails yet</p>
            ) : (
              <div className="chart-container">
                <Bar
                  data={{
                    labels: Object.keys(categoryCounts),
                    datasets: [
                      {
                        data: Object.values(categoryCounts),
                        backgroundColor: chartColors[0],
                      },
                    ],
                  }}
                  options={barOptions}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="col-lg-3 col-md-6">
        <div className="card shadow-sm chart-card">
          <div className="card-header bg-white py-2">
            <h6 className="mb-0">Contact Status</h6>
          </div>
          <div className="card-body">
            {Object.keys(statusCounts).length === 0 ? (
              <p className="text-muted small mb-0">No contacts yet</p>
            ) : (
              <div className="chart-container">
                <Doughnut data={buildChartData(statusCounts)} options={doughnutOptions} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="col-lg-3 col-md-6">
        <div className="card shadow-sm chart-card">
          <div className="card-header bg-white py-2">
            <h6 className="mb-0">Responses (7 days)</h6>
          </div>
          <div className="card-body">
            {responses.length === 0 ? (
              <p className="text-muted small mb-0">No responses yet</p>
            ) : (
              <div className="chart-container">
                <Line
                  data={{
                    labels: trendLabels,
                    datasets: [
                      {
                        data: Object.values(responseTrend),
                        borderColor: chartColors[0],
                        backgroundColor: "rgba(13, 110, 253, 0.1)",
                        fill: true,
                        tension: 0.3,
                      },
                    ],
                  }}
                  options={lineOptions}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsCharts;
